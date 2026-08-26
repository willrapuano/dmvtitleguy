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

const FORM_TYPES = new Set(["quote", "subscribe", "advertising"]);

function clean(value: unknown, maxLength = 500): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  let submissionId: string | undefined;
  let ownsReservation = false;
  try {
    const body = await readLeadBody(request);
    const formType = clean(body.formType, 40);
    const name = clean(body.name, 120);
    const email = clean(body.email, 200).toLowerCase();

    if (!FORM_TYPES.has(formType)) {
      return NextResponse.json({ ok: false, error: "Unknown form type" }, { status: 400 });
    }

    // Honeypot fields are visually hidden from people. A bot gets a neutral
    // response so it has no signal to retry with a different payload.
    if (clean(body.website, 200)) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Name and a valid email are required" }, { status: 400 });
    }

    const listing = clean(body.listing, 240);
    if (formType === "advertising" && !listing) {
      return NextResponse.json({ ok: false, error: "A listing address or MLS number is required" }, { status: 400 });
    }

    submissionId = validateSubmissionId(body.submissionId);
    const reservation = await reserveLeadSubmission(submissionId);
    if (reservation === "delivered") return NextResponse.json({ ok: true, duplicate: true });
    ownsReservation = true;

    await enforceLeadRateLimit(request, email);
    await markLeadSubmissionSending(submissionId);
    const result = await postToGHLWebhook(
      {
        submissionId,
        formType,
        name,
        email,
        phone: clean(body.phone, 60),
        transactionType: clean(body.transactionType, 80),
        role: clean(body.role, 80),
        jurisdiction: clean(body.jurisdiction, 80),
        closingDate: clean(body.closingDate, 40),
        message: clean(body.message, 2000),
        listing,
        landingPage: leadLandingPage(request),
        ...leadAttributionFields(body, request),
      },
      formType
    );

    if (!result.ok) {
      if (result.retrySafe) await releaseLeadSubmission(submissionId);
      console.error(`[Lead API:${requestId}] Delivery failed:`, result.error);
      return NextResponse.json({ ok: false, error: "We couldn't deliver your request", requestId }, { status: 502 });
    }

    await completeLeadSubmission(submissionId).catch((error) => {
      // The webhook already acknowledged delivery. Never tell the visitor to
      // retry (and risk a duplicate) solely because bookkeeping failed.
      console.error(`[Lead API:${requestId}] Delivery recorded upstream but idempotency completion failed:`, error);
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
    console.error(`[Lead API:${requestId}] Unexpected error:`, error);
    return NextResponse.json({ ok: false, error: "Lead intake is temporarily unavailable", requestId }, { status: 503 });
  }
}
