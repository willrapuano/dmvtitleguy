import assert from "node:assert/strict";
import { createSign } from "node:crypto";
import { access, lstat, readFile } from "node:fs/promises";
import { constants } from "node:fs";

const PROPERTY = "sc-domain:dmvtitleguy.io";

function failClosed() {
  console.error(JSON.stringify({
    schemaVersion: 1,
    credentialSecure: false,
    propertyAccess: false,
    error: { code: "GSC_CREDENTIAL_VALIDATION_FAILED" },
  }));
  process.exit(1);
}

process.on("uncaughtException", failClosed);
process.on("unhandledRejection", failClosed);

const credentialPath = process.env.GSC_SERVICE_ACCOUNT_PATH;
assert.ok(credentialPath, "GSC_SERVICE_ACCOUNT_PATH is required");
const credentialStat = await lstat(credentialPath);
assert.ok(credentialStat.isFile() && !credentialStat.isSymbolicLink(), "GSC credential must be a regular file");
assert.equal(credentialStat.uid, process.getuid(), "GSC credential must be owned by the current user");
assert.equal(credentialStat.mode & 0o077, 0, "GSC credential must not be group/world accessible");
await access(credentialPath, constants.R_OK);

const credential = JSON.parse(await readFile(credentialPath, "utf8"));
assert.equal(credential.type, "service_account", "GSC credential must be a service account");
assert.ok(credential.client_email && credential.private_key, "GSC credential fields are incomplete");

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

const now = Math.floor(Date.now() / 1_000);
const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
const claims = base64url(JSON.stringify({
  iss: credential.client_email,
  scope: "https://www.googleapis.com/auth/webmasters.readonly",
  aud: "https://oauth2.googleapis.com/token",
  iat: now,
  exp: now + 3_600,
}));
const unsigned = `${header}.${claims}`;
const signer = createSign("RSA-SHA256");
signer.update(unsigned);
const assertion = `${unsigned}.${signer.sign(credential.private_key, "base64url")}`;

const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  signal: AbortSignal.timeout(20_000),
});
const tokenBody = await tokenResponse.json().catch(() => ({}));
assert.ok(tokenResponse.ok && tokenBody.access_token, "Google OAuth denied the readonly credential");

const propertyResponse = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(PROPERTY)}`, {
  headers: { Authorization: `Bearer ${tokenBody.access_token}`, Accept: "application/json" },
  signal: AbortSignal.timeout(20_000),
});
const propertyBody = await propertyResponse.json().catch(() => ({}));
assert.ok(propertyResponse.ok, "GSC property access was denied");
assert.equal(propertyBody.siteUrl, PROPERTY, "GSC returned an unexpected property");
assert.notEqual(propertyBody.permissionLevel, "siteUnverifiedUser", "GSC service account is not verified for the property");

console.log(JSON.stringify({
  schemaVersion: 1,
  credentialSecure: true,
  propertyAccess: true,
  property: PROPERTY,
  scope: "webmasters.readonly",
}));
