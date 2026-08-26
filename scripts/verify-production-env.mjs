import assert from "node:assert/strict";

if (process.env.VERCEL_ENV !== "production") {
  console.log("Production environment gate skipped outside a Vercel Production build");
  process.exit(0);
}

const webhook = process.env.GHL_WEBHOOK_URL || "";
const protectionSecret = process.env.LEAD_PROTECTION_SECRET || "";
const databaseUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "";
const databaseToken = process.env.TURSO_AUTH_TOKEN || "";

assert.match(webhook, /^https:\/\/[^\s]+$/, "GHL_WEBHOOK_URL must be an HTTPS URL in Production");
assert.ok(protectionSecret.length >= 64, "LEAD_PROTECTION_SECRET must contain at least 32 random bytes in Production");
assert.ok(databaseUrl && databaseUrl !== "file:dev.db", "Production requires a durable TURSO_DATABASE_URL or DATABASE_URL");
if (/^(libsql|https):/i.test(databaseUrl)) {
  assert.ok(databaseToken.length >= 20, "TURSO_AUTH_TOKEN is required for the remote Production database");
}

console.log("Production environment gate passed: lead delivery and durable protection settings are present");
