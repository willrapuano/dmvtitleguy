ALTER TABLE "LeadSubmission" ADD COLUMN "isQa" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "LeadOpportunityOutbox" (
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
);

CREATE INDEX "LeadOpportunityOutbox_nextAttemptAt_idx" ON "LeadOpportunityOutbox"("nextAttemptAt");
CREATE INDEX "LeadOpportunityOutbox_expiresAt_idx" ON "LeadOpportunityOutbox"("expiresAt");

CREATE TABLE "LeadSubmissionEvent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "submissionId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "stateCode" TEXT,
  "detailsHash" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "LeadSubmissionEvent_submissionId_createdAt_idx" ON "LeadSubmissionEvent"("submissionId", "createdAt");
CREATE INDEX "LeadSubmissionEvent_eventType_createdAt_idx" ON "LeadSubmissionEvent"("eventType", "createdAt");

UPDATE "LeadSubmission"
SET "isQa" = true
WHERE "qualificationStatus" = 'test';
