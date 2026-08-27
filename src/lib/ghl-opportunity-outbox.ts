import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { recordLeadCRMSync, recordLeadSubmissionEvent } from "@/lib/lead-protection";
import { syncGHLTransactionOpportunity } from "@/lib/ghl-crm";

const OUTBOX_RETENTION_MS = 14 * 24 * 60 * 60 * 1000;

interface OutboxEnvelope {
  source: string;
  payload: Record<string, unknown>;
}

function encryptionKey() {
  const secret = process.env.LEAD_PROTECTION_SECRET;
  if (!secret || secret.length < 32) throw new Error("Lead opportunity outbox is not configured");
  return createHash("sha256").update(`ghl-opportunity-outbox:${secret}`).digest();
}

function encryptEnvelope(envelope: OutboxEnvelope) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(envelope), "utf8"),
    cipher.final(),
  ]);
  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
  };
}

function decryptEnvelope(row: { ciphertext: string; iv: string; authTag: string }): OutboxEnvelope {
  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    Buffer.from(row.iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(row.authTag, "base64"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(row.ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
  const parsed = JSON.parse(plaintext) as OutboxEnvelope;
  if (!parsed || typeof parsed.source !== "string" || !parsed.payload || typeof parsed.payload !== "object") {
    throw new Error("GHL outbox envelope is invalid");
  }
  return parsed;
}

function errorCode(error: unknown) {
  return (error instanceof Error ? error.message : "ghl-sync-failed").slice(0, 120);
}

export async function stageGhlOpportunitySync(
  submissionId: string,
  source: string,
  payload: Record<string, unknown>,
) {
  const encrypted = encryptEnvelope({ source, payload });
  await prisma.leadOpportunityOutbox.create({
    data: {
      submissionId,
      ...encrypted,
      expiresAt: new Date(Date.now() + OUTBOX_RETENTION_MS),
    },
  });
  await recordLeadSubmissionEvent(submissionId, "ghl-opportunity-staged", "encrypted");
}

export async function syncStagedGhlOpportunity(submissionId: string) {
  const [submission, outbox] = await Promise.all([
    prisma.leadSubmission.findUnique({ where: { id: submissionId } }),
    prisma.leadOpportunityOutbox.findUnique({ where: { submissionId } }),
  ]);
  if (!submission || submission.status !== "delivered") {
    return { skipped: true as const, reason: "webhook-not-confirmed" as const };
  }
  if (!outbox) return { skipped: true as const, reason: "outbox-missing" as const };

  await prisma.leadOpportunityOutbox.update({
    where: { submissionId },
    data: { attempts: { increment: 1 }, lastAttemptAt: new Date() },
  });

  try {
    const envelope = decryptEnvelope(outbox);
    const crm = await syncGHLTransactionOpportunity(envelope.payload, envelope.source);
    await recordLeadCRMSync(submissionId, crm);
    await prisma.leadOpportunityOutbox.delete({ where: { submissionId } });
    return { skipped: false as const, ...crm };
  } catch (error) {
    const code = errorCode(error);
    const delayMinutes = Math.min(24 * 60, 2 ** Math.min(outbox.attempts, 10));
    await prisma.leadOpportunityOutbox.updateMany({
      where: { submissionId },
      data: {
        lastErrorCode: code,
        nextAttemptAt: new Date(Date.now() + delayMinutes * 60 * 1000),
      },
    });
    await recordLeadCRMSync(submissionId, { errorCode: code }).catch(() => undefined);
    throw error;
  }
}

export async function retryDueGhlOpportunitySyncs(limit = 25) {
  const now = new Date();
  const expired = await prisma.leadOpportunityOutbox.findMany({
    where: { expiresAt: { lt: now } },
    select: { submissionId: true },
    take: limit,
  });
  for (const row of expired) {
    await recordLeadSubmissionEvent(row.submissionId, "ghl-outbox-expired", "manual-reconciliation-required").catch(() => undefined);
  }
  if (expired.length) {
    await prisma.leadOpportunityOutbox.deleteMany({
      where: { submissionId: { in: expired.map((row) => row.submissionId) } },
    });
  }

  const due = await prisma.leadOpportunityOutbox.findMany({
    where: {
      nextAttemptAt: { lte: now },
      expiresAt: { gte: now },
      submissionId: {
        in: (
          await prisma.leadSubmission.findMany({
            where: { status: "delivered", ghlSyncStatus: { in: ["pending", "error"] } },
            select: { id: true },
            take: limit,
          })
        ).map((row) => row.id),
      },
    },
    orderBy: { nextAttemptAt: "asc" },
    take: limit,
  });

  const results: Array<{ submissionId: string; status: "synced" | "error"; code?: string }> = [];
  for (const row of due) {
    try {
      await syncStagedGhlOpportunity(row.submissionId);
      results.push({ submissionId: row.submissionId, status: "synced" });
    } catch (error) {
      results.push({ submissionId: row.submissionId, status: "error", code: errorCode(error) });
    }
  }
  return { attempted: due.length, expired: expired.length, results };
}
