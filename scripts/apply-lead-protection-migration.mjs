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
  if (names.length === 2) {
    console.log("Lead-protection migration already applied");
  } else {
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
    console.log("Applied lead-protection migration to the configured durable database");
  }
} finally {
  db.close();
}
