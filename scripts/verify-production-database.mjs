import assert from "node:assert/strict";
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

assert.ok(url && url !== "file:dev.db", "A durable TURSO_DATABASE_URL is required");
assert.ok(authToken, "TURSO_AUTH_TOKEN is required");

const db = createClient({ url, authToken });
try {
  const result = await db.execute(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('LeadSubmission', 'LeadRateLimitBucket') ORDER BY name"
  );
  const names = result.rows.map((row) => String(row.name));
  assert.deepEqual(names, ["LeadRateLimitBucket", "LeadSubmission"], "Lead-protection migration is not applied");
  const columns = await db.execute('PRAGMA table_info("LeadSubmission")');
  const columnNames = new Set(columns.rows.map((row) => String(row.name)));
  for (const required of [
    "submittedAt",
    "updatedAt",
    "payloadHash",
    "conversionPath",
    "firstLandingPath",
    "channel",
    "qualificationStatus",
    "lastDeliveryErrorCode",
    "ghlOpportunityId",
    "ghlSyncStatus",
  ]) {
    assert.ok(columnNames.has(required), `LeadSubmission.${required} is missing`);
  }
  console.log("Production database gate passed: durable conversion history and delivery reconciliation fields exist");
} finally {
  db.close();
}
