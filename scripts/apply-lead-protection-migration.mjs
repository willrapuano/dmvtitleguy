import assert from "node:assert/strict";
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

assert.ok(url && url !== "file:dev.db", "A durable TURSO_DATABASE_URL is required");
assert.ok(authToken, "TURSO_AUTH_TOKEN is required");

const db = createClient({ url, authToken });
try {
  const existing = await db.execute(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('LeadSubmission', 'LeadRateLimitBucket') ORDER BY name"
  );
  const names = existing.rows.map((row) => String(row.name));
  if (names.length !== 2) {
    assert.deepEqual(names, [], "Refusing to modify a partially applied lead-protection migration");

    await db.batch(
      [
        `CREATE TABLE "LeadRateLimitBucket" (
          "key" TEXT NOT NULL PRIMARY KEY,
          "count" INTEGER NOT NULL DEFAULT 1,
          "windowEndsAt" DATETIME NOT NULL,
          "updatedAt" DATETIME NOT NULL
        )`,
        `CREATE TABLE "LeadSubmission" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "status" TEXT NOT NULL DEFAULT 'pending',
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "deliveredAt" DATETIME
        )`,
      ],
      "write"
    );
  }

  const columns = await db.execute('PRAGMA table_info("LeadSubmission")');
  const existingColumns = new Set(columns.rows.map((row) => String(row.name)));
  const additions = [
    ["source", 'TEXT'],
    ["formType", 'TEXT'],
    ["submittedAt", 'DATETIME'],
    ["updatedAt", 'DATETIME'],
    ["lastAttemptAt", 'DATETIME'],
    ["deliveryAttempts", 'INTEGER NOT NULL DEFAULT 0'],
    ["payloadHash", 'TEXT'],
    ["conversionPath", 'TEXT'],
    ["firstLandingPath", 'TEXT'],
    ["firstReferrerHost", 'TEXT'],
    ["channel", 'TEXT'],
    ["jurisdiction", 'TEXT'],
    ["transactionType", 'TEXT'],
    ["contactRole", 'TEXT'],
    ["qualificationStatus", 'TEXT NOT NULL DEFAULT \'submitted\''],
    ["qualificationReason", 'TEXT'],
    ["qualifiedAt", 'DATETIME'],
    ["acceptedAt", 'DATETIME'],
    ["closedAt", 'DATETIME'],
    ["outcomeValueCents", 'INTEGER'],
    ["lostReason", 'TEXT'],
    ["lastDeliveryErrorCode", 'TEXT'],
    ["ghlContactId", 'TEXT'],
    ["ghlOpportunityId", 'TEXT'],
    ["ghlSyncStatus", 'TEXT NOT NULL DEFAULT \'not-required\''],
    ["ghlSyncErrorCode", 'TEXT'],
    ["isQa", 'BOOLEAN NOT NULL DEFAULT false'],
  ];
  for (const [name, type] of additions) {
    if (!existingColumns.has(name)) {
      await db.execute(`ALTER TABLE "LeadSubmission" ADD COLUMN "${name}" ${type}`);
    }
  }
  await db.execute(`UPDATE "LeadSubmission" SET "submittedAt" = COALESCE("submittedAt", "createdAt", CURRENT_TIMESTAMP)`);
  await db.execute(`UPDATE "LeadSubmission" SET "updatedAt" = COALESCE("updatedAt", "submittedAt", CURRENT_TIMESTAMP)`);
  await db.execute(`UPDATE "LeadSubmission" SET "ghlSyncStatus" = COALESCE("ghlSyncStatus", 'not-required')`);
  await db.execute(`UPDATE "LeadSubmission" SET "isQa" = true WHERE "qualificationStatus" = 'test'`);

  await db.execute(`CREATE TABLE IF NOT EXISTS "LeadOpportunityOutbox" (
    "submissionId" TEXT NOT NULL PRIMARY KEY,
    "ciphertext" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "authTag" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAttemptAt" DATETIME,
    "lastErrorCode" TEXT,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`);
  await db.execute(`CREATE INDEX IF NOT EXISTS "LeadOpportunityOutbox_nextAttemptAt_idx" ON "LeadOpportunityOutbox"("nextAttemptAt")`);
  await db.execute(`CREATE INDEX IF NOT EXISTS "LeadOpportunityOutbox_expiresAt_idx" ON "LeadOpportunityOutbox"("expiresAt")`);

  await db.execute(`CREATE TABLE IF NOT EXISTS "LeadSubmissionEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "stateCode" TEXT,
    "detailsHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
  await db.execute(`CREATE INDEX IF NOT EXISTS "LeadSubmissionEvent_submissionId_createdAt_idx" ON "LeadSubmissionEvent"("submissionId", "createdAt")`);
  await db.execute(`CREATE INDEX IF NOT EXISTS "LeadSubmissionEvent_eventType_createdAt_idx" ON "LeadSubmissionEvent"("eventType", "createdAt")`);
  console.log("Lead conversion-history migration is applied to the configured durable database");
} finally {
  db.close();
}
