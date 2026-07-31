-- Durable, privacy-preserving abuse protection and idempotency for public lead forms.
CREATE TABLE "LeadRateLimitBucket" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "count" INTEGER NOT NULL DEFAULT 1,
    "windowEndsAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "LeadSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredAt" DATETIME
);
