import { createHmac } from "node:crypto";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_BODY_BYTES = 16_384;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const IP_LIMIT = 5;
const EMAIL_LIMIT = 3;
const IDEMPOTENCY_LEASE_MS = 5 * 60 * 1000;
const SUBMISSION_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class LeadRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly retryAfter?: number
  ) {
    super(message);
  }
}

function protectionSecret() {
  const secret = process.env.LEAD_PROTECTION_SECRET;
  if (!secret || secret.length < 32) {
    throw new LeadRequestError("Lead intake is temporarily unavailable", 503);
  }
  return secret;
}

function opaqueKey(namespace: string, value: string) {
  return createHmac("sha256", protectionSecret()).update(`${namespace}:${value}`).digest("hex");
}

function clientAddress(request: NextRequest) {
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function assertSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) throw new LeadRequestError("Invalid request", 403);

  try {
    const parsed = new URL(origin);
    if (parsed.host !== host || (parsed.protocol !== "https:" && !parsed.hostname.match(/^(localhost|127\.0\.0\.1)$/))) {
      throw new LeadRequestError("Invalid request", 403);
    }
  } catch (error) {
    if (error instanceof LeadRequestError) throw error;
    throw new LeadRequestError("Invalid request", 403);
  }
}

export async function readLeadBody(request: NextRequest): Promise<Record<string, unknown>> {
  assertSameOrigin(request);
  const mediaType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (mediaType !== "application/json") {
    throw new LeadRequestError("JSON content type required", 415);
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) throw new LeadRequestError("Request is too large", 413);

  const raw = await request.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) throw new LeadRequestError("Request is too large", 413);

  try {
    const body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("object required");
    return body as Record<string, unknown>;
  } catch {
    throw new LeadRequestError("Invalid request", 400);
  }
}

async function consumeBucket(key: string, limit: number, now: Date) {
  const windowStart = Math.floor(now.getTime() / RATE_WINDOW_MS) * RATE_WINDOW_MS;
  const bucketKey = `${key}:${windowStart}`;
  const windowEndsAt = new Date(windowStart + RATE_WINDOW_MS);

  try {
    await prisma.leadRateLimitBucket.create({ data: { key: bucketKey, count: 1, windowEndsAt } });
    return;
  } catch {
    const updated = await prisma.leadRateLimitBucket.updateMany({
      where: { key: bucketKey, count: { lt: limit } },
      data: { count: { increment: 1 } },
    });
    if (updated.count === 0) {
      throw new LeadRequestError("Too many requests", 429, Math.max(1, Math.ceil((windowEndsAt.getTime() - now.getTime()) / 1000)));
    }
  }
}

export async function enforceLeadRateLimit(request: NextRequest, email: string) {
  const now = new Date();
  const address = clientAddress(request);
  await consumeBucket(opaqueKey("ip", address), IP_LIMIT, now);
  // Couple the email limit to the caller so one remote attacker cannot lock a
  // known victim out globally simply by submitting their address three times.
  await consumeBucket(opaqueKey("ip-email", `${address}:${email.toLowerCase()}`), EMAIL_LIMIT, now);

  // Keep the durable store bounded without retaining raw IP addresses or emails.
  await prisma.leadRateLimitBucket.deleteMany({
    where: { windowEndsAt: { lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) } },
  });
}

export function validateSubmissionId(value: unknown) {
  if (typeof value !== "string" || !SUBMISSION_ID.test(value)) {
    throw new LeadRequestError("Invalid submission identifier", 400);
  }
  return value;
}

export async function reserveLeadSubmission(id: string) {
  try {
    const now = new Date();
    await prisma.leadSubmission.create({ data: { id, submittedAt: now, updatedAt: now } });
    return "reserved" as const;
  } catch {
    const existing = await prisma.leadSubmission.findUnique({ where: { id } });
    if (existing?.status === "delivered") return "delivered" as const;
    if (existing?.status === "unknown" || existing?.status === "sending") {
      if (existing.status === "sending" && existing.lastAttemptAt && existing.lastAttemptAt.getTime() <= Date.now() - IDEMPOTENCY_LEASE_MS) {
        await prisma.leadSubmission.updateMany({
          where: { id, status: "sending" },
          data: { status: "unknown", lastDeliveryErrorCode: "delivery-interrupted" },
        });
      }
      return "pending-review" as const;
    }
    if (existing?.status === "pending") {
      const staleBefore = new Date(Date.now() - IDEMPOTENCY_LEASE_MS);
      const takeover = await prisma.leadSubmission.updateMany({
        where: { id, status: "pending", submittedAt: { lte: staleBefore } },
        data: { updatedAt: new Date() },
      });
      if (takeover.count === 1) return "reserved" as const;
    }
    throw new LeadRequestError("Submission is already processing", 409);
  }
}

interface LeadSubmissionDetails {
  source: string;
  formType: string;
  payload: Record<string, unknown>;
  conversionPath: string;
  firstLandingPath: string;
  firstReferrerHost: string;
  channel: string;
  jurisdiction?: string;
  transactionType?: string;
  contactRole?: string;
  transactionIntent: boolean;
}

export async function recordLeadSubmissionDetails(id: string, details: LeadSubmissionDetails) {
  const payloadHash = opaqueKey("lead-payload", JSON.stringify(details.payload));
  const updated = await prisma.leadSubmission.updateMany({
    where: { id, status: "pending" },
    data: {
      source: details.source,
      formType: details.formType,
      payloadHash,
      conversionPath: details.conversionPath,
      firstLandingPath: details.firstLandingPath,
      firstReferrerHost: details.firstReferrerHost,
      channel: details.channel,
      jurisdiction: details.jurisdiction || null,
      transactionType: details.transactionType || null,
      contactRole: details.contactRole || null,
      ghlSyncStatus: details.transactionIntent ? "pending" : "not-required",
    },
  });
  if (updated.count !== 1) throw new LeadRequestError("Submission is already processing", 409);
}

export async function completeLeadSubmission(id: string) {
  await prisma.leadSubmission.update({
    where: { id },
    data: { status: "delivered", deliveredAt: new Date() },
  });
}

export async function markLeadSubmissionSending(id: string) {
  const updated = await prisma.leadSubmission.updateMany({
    where: { id, status: "pending" },
    data: { status: "sending", lastAttemptAt: new Date(), deliveryAttempts: { increment: 1 }, lastDeliveryErrorCode: null },
  });
  if (updated.count !== 1) {
    throw new LeadRequestError("Submission is already processing", 409);
  }
}

export async function markLeadSubmissionUnknown(id: string, errorCode: string) {
  await prisma.leadSubmission.updateMany({
    where: { id, status: "sending" },
    data: { status: "unknown", lastDeliveryErrorCode: errorCode.slice(0, 120) },
  });
}

export async function recordLeadCRMSync(
  id: string,
  result: { contactId?: string; opportunityId?: string; errorCode?: string }
) {
  await prisma.leadSubmission.update({
    where: { id },
    data: {
      ghlContactId: result.contactId || undefined,
      ghlOpportunityId: result.opportunityId || undefined,
      ghlSyncStatus: result.errorCode ? "error" : "synced",
      ghlSyncErrorCode: result.errorCode?.slice(0, 120) || null,
    },
  });
}

export async function releaseLeadSubmission(id: string) {
  await prisma.leadSubmission.deleteMany({
    where: { id, status: { in: ["pending", "sending"] } },
  });
}

export function leadLandingPage(request: NextRequest) {
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");
  if (!referer || !host) return "/unknown";
  try {
    const parsed = new URL(referer);
    return parsed.host === host ? parsed.pathname.slice(0, 500) : "/unknown";
  } catch {
    return "/unknown";
  }
}
