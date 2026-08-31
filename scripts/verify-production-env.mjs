import assert from "node:assert/strict";

if (process.env.VERCEL_ENV !== "production") {
  console.log("Production environment gate skipped outside a Vercel Production build");
  process.exit(0);
}

const webhook = process.env.GHL_WEBHOOK_URL || "";
const protectionSecret = process.env.LEAD_PROTECTION_SECRET || "";
const databaseUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "";
const databaseToken = process.env.TURSO_AUTH_TOKEN || "";
const ghlPrivateToken = process.env.GHL_PRIVATE_INTEGRATION_TOKEN || "";
const ghlLocationId = process.env.GHL_LOCATION_ID || "";
const ghlPipelineId = process.env.GHL_WEBSITE_PIPELINE_ID || "";
const ghlSubmittedStageId = process.env.GHL_WEBSITE_SUBMITTED_STAGE_ID || "";
const cronSecret = process.env.CRON_SECRET || "";

assert.match(webhook, /^https:\/\/[^\s]+$/, "GHL_WEBHOOK_URL must be an HTTPS URL in Production");
assert.ok(protectionSecret.length >= 64, "LEAD_PROTECTION_SECRET must contain at least 32 random bytes in Production");
assert.ok(databaseUrl && databaseUrl !== "file:dev.db", "Production requires a durable TURSO_DATABASE_URL or DATABASE_URL");
if (/^(libsql|https):/i.test(databaseUrl)) {
  assert.ok(databaseToken.length >= 20, "TURSO_AUTH_TOKEN is required for the remote Production database");
}
assert.ok(ghlPrivateToken.length >= 20, "GHL_PRIVATE_INTEGRATION_TOKEN is required for Production opportunity measurement");
assert.ok(ghlLocationId, "GHL_LOCATION_ID is required in Production");
assert.ok(ghlPipelineId, "GHL_WEBSITE_PIPELINE_ID is required in Production");
assert.ok(ghlSubmittedStageId, "GHL_WEBSITE_SUBMITTED_STAGE_ID is required in Production");
assert.ok(cronSecret.length >= 32, "CRON_SECRET is required for Production reconciliation");

console.log("Production environment gate passed: lead delivery, durable protection, and GHL opportunity measurement are configured");
