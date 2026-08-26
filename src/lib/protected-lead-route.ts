import { NextRequest, NextResponse } from "next/server";
import { postToGHLWebhook } from "@/lib/ghl-webhook";
import {
  completeLeadSubmission,
  enforceLeadRateLimit,
  LeadRequestError,
  leadLandingPage,
  markLeadSubmissionSending,
  readLeadBody,
  releaseLeadSubmission,
  reserveLeadSubmission,
  validateSubmissionId,
} from "@/lib/lead-protection";
import { leadAttributionFields } from "@/lib/lead-attribution";

export function leadText(value: unknown, maxLength = 500) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function leadRequiredText(value: unknown, label: string, maxLength = 500) {
  const text = leadText(value, maxLength);
  if (!text) throw new LeadRequestError(`${label} is required`, 400);
  return text;
}

export async function handleProtectedFunnelLead(
  request: NextRequest,
  source: string,
  buildPayload: (body: Record<string, unknown>) => Record<string, unknown>
) {
  const requestId = crypto.randomUUID();
  let submissionId: string | undefined;
  let ownsReservation = false;
  try {
    const body = await readLeadBody(request);
    if (leadText(body.website, 200)) return NextResponse.json({ ok: true });

    const name = leadText(body.name, 120);
    const email = leadText(body.email, 200).toLowerCase();
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      throw new LeadRequestError("Name and a valid email are required", 400);
    }

    submissionId = validateSubmissionId(body.submissionId);
    const reservation = await reserveLeadSubmission(submissionId);
    if (reservation === "delivered") return NextResponse.json({ ok: true, duplicate: true });
    ownsReservation = true;

    await enforceLeadRateLimit(request, email);
    const payload = buildPayload(body);
    // Move out of the reclaimable pre-delivery lease before contacting the
    // webhook. If the process dies during delivery, retries stay blocked rather
    // than risking a duplicate CRM record.
    await markLeadSubmissionSending(submissionId);
    const result = await postToGHLWebhook(
      {
        submissionId,
        name,
        email,
        ...payload,
        landingPage: leadLandingPage(request),
        ...leadAttributionFields(body, request),
      },
      source
    );

    if (!result.ok) {
      if (result.retrySafe) await releaseLeadSubmission(submissionId);
      console.error(`[${source}:${requestId}] Delivery failed:`, result.error);
      return NextResponse.json({ ok: false, error: "We couldn't deliver your request", requestId }, { status: 502 });
    }

    await completeLeadSubmission(submissionId).catch((error) => {
      // The webhook already acknowledged delivery. Never invite a retry that
      // could duplicate the CRM record because local bookkeeping failed.
      console.error(`[${source}:${requestId}] Delivery recorded upstream but idempotency completion failed:`, error);
    });
    return NextResponse.json({ ok: true, requestId });
  } catch (error) {
    if (submissionId && ownsReservation) {
      await releaseLeadSubmission(submissionId).catch(() => undefined);
    }
    if (error instanceof LeadRequestError) {
      const response = NextResponse.json({ ok: false, error: error.message, requestId }, { status: error.status });
      if (error.retryAfter) response.headers.set("Retry-After", String(error.retryAfter));
      return response;
    }
    console.error(`[${source}:${requestId}] Unexpected error:`, error);
    return NextResponse.json({ ok: false, error: "Lead intake is temporarily unavailable", requestId }, { status: 503 });
  }
}
