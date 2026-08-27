import { NextRequest, NextResponse } from "next/server";
import { postToGHLWebhook } from "@/lib/ghl-webhook";
import {
  completeLeadSubmission,
  enforceLeadRateLimit,
  LeadRequestError,
  leadLandingPage,
  markLeadSubmissionSending,
  markLeadSubmissionUnknown,
  readLeadBody,
  recordLeadSubmissionDetails,
  releaseLeadSubmission,
  reserveLeadSubmission,
  validateSubmissionId,
} from "@/lib/lead-protection";
import { leadAttributionFields } from "@/lib/lead-attribution";
import { isSeoQaPayload, TRANSACTION_INTENT_SOURCES } from "@/lib/ghl-crm";
import { stageGhlOpportunitySync, syncStagedGhlOpportunity } from "@/lib/ghl-opportunity-outbox";

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
  let deliveryStarted = false;
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
    if (reservation === "pending-review") {
      return NextResponse.json({ ok: true, pending: true, message: "We are checking this request." }, { status: 202 });
    }
    ownsReservation = true;

    await enforceLeadRateLimit(request, email);
    const payload = buildPayload(body);
    const attribution = leadAttributionFields(body, request);
    const submittedAt = new Date().toISOString();
    const webhookPayload = {
      submissionId,
      submittedAt,
      formType: source,
      name,
      email,
      ...payload,
      landingPage: leadLandingPage(request),
      ...attribution,
    };
    const isQa = isSeoQaPayload(webhookPayload);
    await recordLeadSubmissionDetails(submissionId, {
      source: `dmvtitleguy-${source}`,
      formType: source,
      payload: webhookPayload,
      conversionPath: attribution.serverConversionPage,
      firstLandingPath: attribution.firstLandingPage,
      firstReferrerHost: attribution.firstReferrerHost,
      channel: attribution.firstChannel,
      jurisdiction: leadText(body.jurisdiction, 80),
      transactionType: leadText(body.transactionType, 80),
      contactRole: leadText(body.role, 80),
      transactionIntent: TRANSACTION_INTENT_SOURCES.has(source),
      isQa,
    });
    if (TRANSACTION_INTENT_SOURCES.has(source)) {
      await stageGhlOpportunitySync(
        submissionId,
        source,
        isQa ? { ...webhookPayload, seoQaExcluded: true } : webhookPayload,
      );
    }
    // Move out of the reclaimable pre-delivery lease before contacting the
    // webhook. If the process dies during delivery, retries stay blocked rather
    // than risking a duplicate CRM record.
    await markLeadSubmissionSending(submissionId);
    deliveryStarted = true;
    const result = await postToGHLWebhook(webhookPayload, source);

    if (!result.ok) {
      if (result.retrySafe) {
        await releaseLeadSubmission(submissionId);
      } else {
        await markLeadSubmissionUnknown(submissionId, result.errorCode || "ambiguous-delivery");
      }
      console.error(`[${source}:${requestId}] Delivery failed:`, result.error);
      if (!result.retrySafe) {
        return NextResponse.json({ ok: true, pending: true, message: "We are checking this request.", requestId }, { status: 202 });
      }
      return NextResponse.json({ ok: false, error: "We couldn't deliver your request", requestId }, { status: 502 });
    }

    await completeLeadSubmission(submissionId).catch((error) => {
      // The webhook already acknowledged delivery. Never invite a retry that
      // could duplicate the CRM record because local bookkeeping failed.
      console.error(`[${source}:${requestId}] Delivery recorded upstream but idempotency completion failed:`, error);
      return markLeadSubmissionUnknown(submissionId!, "delivery-record-failed");
    });
    if (TRANSACTION_INTENT_SOURCES.has(source)) {
      try {
        await syncStagedGhlOpportunity(submissionId);
      } catch (error) {
        const errorCode = error instanceof Error ? error.message : "ghl-sync-failed";
        console.error(`[${source}:${requestId}] GHL opportunity sync failed:`, errorCode);
      }
    }
    return NextResponse.json({ ok: true, requestId });
  } catch (error) {
    if (submissionId && ownsReservation && !deliveryStarted) {
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
