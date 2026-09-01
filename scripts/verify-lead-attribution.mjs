import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const requiredClientForms = [
  "src/components/LeadCaptureForm.tsx",
  "src/components/AdvertisingPageClient.tsx",
  "src/components/SubscribePageClient.tsx",
  "src/components/funnels/TitleReviewForm.tsx",
  "src/components/funnels/UploadContractForm.tsx",
  "src/components/funnels/InvestorDueDiligenceForm.tsx",
];

for (const file of requiredClientForms) {
  const source = await readFile(file, "utf8");
  assert.match(source, /getLeadAttribution\(\)/, `${file} does not attach attribution to lead intake`);
  assert.match(source, /LeadRoutingNotice/, `${file} does not show a near-submit routing notice`);
}

for (const file of ["src/app/api/leads/route.ts", "src/lib/protected-lead-route.ts"]) {
  const source = await readFile(file, "utf8");
  assert.match(source, /leadAttributionFields\(body, request\)/, `${file} does not sanitize attribution server-side`);
}

const attributionSource = await readFile("src/lib/client-lead-attribution.ts", "utf8");
assert.match(attributionSource, /firstLandingPage/, "first landing path is missing");
assert.match(attributionSource, /conversionPage/, "conversion path is missing");
assert.match(attributionSource, /ATTRIBUTION_WINDOW_MS/, "first-touch expiry is missing");
assert.match(attributionSource, /lastNonDirectReferrerHost/, "last-non-direct attribution is missing");
assert.match(attributionSource, /window\.location\.pathname\.slice/, "landing and conversion values must be path-only");
assert.ok(!/gclid|fbclid|msclkid/i.test(attributionSource), "ad click IDs must not be stored before a consent policy is implemented");

const serverAttributionSource = await readFile("src/lib/lead-attribution.ts", "utf8");
assert.match(serverAttributionSource, /deploymentEnvironment/, "server-derived deployment environment is missing");
assert.match(serverAttributionSource, /attributionComplete/, "attribution completeness flag is missing");
assert.match(serverAttributionSource, /classifyFirstChannel/, "server attribution does not use the behavioral channel classifier");

const channelSource = await readFile("src/lib/attribution-channel.ts", "utf8");
const channelJavaScript = ts.transpileModule(channelSource, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { classifyFirstChannel } = await import(`data:text/javascript;base64,${Buffer.from(channelJavaScript).toString("base64")}`);
const channel = (overrides = {}) => classifyFirstChannel({
  firstReferrerHost: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
  ...overrides,
});
assert.equal(channel({ utmSource: "google", utmMedium: "organic", utmCampaign: "gbp", utmContent: "profile-website-button" }), "google-business-profile");
assert.equal(channel({ utmSource: "bing", utmMedium: "organic", utmCampaign: "gbp", utmContent: "profile-website-button" }), "organic-search");
assert.equal(channel({ utmSource: "google", utmMedium: "organic", utmCampaign: "gbp", utmContent: "wrong-button" }), "organic-search");
assert.equal(channel({ utmSource: "google", utmMedium: "cpc", utmCampaign: "gbp", utmContent: "profile-website-button" }), "paid");
assert.equal(channel({ firstReferrerHost: "www.google.com" }), "organic-search");
assert.equal(channel({ utmSource: "newsletter", utmCampaign: "summer" }), "campaign");
assert.equal(channel({ firstReferrerHost: "example.com" }), "referral");
assert.equal(channel(), "direct-or-unknown");

const protectionSource = await readFile("src/lib/lead-protection.ts", "utf8");
assert.match(protectionSource, /parsed\.pathname\.slice/, "server landing-page attribution must discard query strings");
assert.ok(!/parsed\.pathname\}\$\{parsed\.search/.test(protectionSource), "server landing-page attribution retains query strings");

const webhookSource = await readFile("src/lib/ghl-webhook.ts", "utf8");
assert.match(webhookSource, /retrySafe: false/, "ambiguous webhook outcomes are not classified as unsafe to retry");
for (const file of ["src/app/api/leads/route.ts", "src/lib/protected-lead-route.ts"]) {
  const source = await readFile(file, "utf8");
  assert.match(source, /if \(result\.retrySafe\)/, `${file} does not distinguish safe from ambiguous delivery failures`);
  assert.match(source, /markLeadSubmissionUnknown/, `${file} does not preserve ambiguous delivery for reconciliation`);
  assert.match(source, /status: 202/, `${file} does not return an honest pending-review state`);
}

const crmSource = await readFile("src/lib/ghl-crm.ts", "utf8");
for (const source of ["quote", "request-title-review", "upload-contract", "investor-due-diligence"]) {
  assert.match(crmSource, new RegExp(`\\b${source}\\b`), `${source} is missing from transaction-intent opportunity measurement`);
}
assert.doesNotMatch(crmSource, /TRANSACTION_INTENT_SOURCES[^]*subscribe/, "newsletter subscriptions must not enter the transaction-intent KPI");
assert.match(crmSource, /opportunities\/search/, "GHL opportunity idempotency search is missing");
assert.match(crmSource, /contactId,\s*\n\s*status: "all"/, "GHL sync does not honor the location's one-opportunity-per-contact setting");
assert.match(crmSource, /method: "PUT"/, "GHL sync cannot reuse an existing contact opportunity");
assert.match(crmSource, /Version:\s*"v3"/, "GHL opportunity sync must declare its versioned API contract");
assert.match(crmSource, /locationId,\s*\n\s*pipelineId,/, "GHL v3 opportunity search must use camelCase query keys");
assert.match(crmSource, /SEO Submission ID/, "GHL opportunities do not preserve submission IDs");
assert.match(crmSource, /SEO QA Excluded/, "GHL opportunities do not carry an explicit QA exclusion");
assert.match(crmSource, /token !== token\.trim\(\)/, "GHL credentials with loader prefixes or surrounding whitespace must fail closed");
assert.match(crmSource, /\\u0000-\\u0020\\u007f/, "GHL credentials containing control characters must fail closed");

const reconciliationRouteSource = await readFile("src/app/api/cron/reconcile-ghl-opportunities/route.ts", "utf8");
assert.match(reconciliationRouteSource, /GHL_RECONCILIATION_FAILED/, "GHL reconciliation errors need a stable incident code");
assert.doesNotMatch(reconciliationRouteSource, /error\s+instanceof\s+Error|error\.message/, "GHL reconciliation must never serialize provider error text");

const outboxSource = await readFile("src/lib/ghl-opportunity-outbox.ts", "utf8");
assert.match(outboxSource, /aes-256-gcm/, "GHL recovery payload is not encrypted at rest");
assert.match(outboxSource, /status !== "delivered"/, "GHL retry could run before confirmed webhook delivery");
assert.match(outboxSource, /syncGHLTransactionOpportunity/, "GHL retry does not use the idempotent opportunity sync");
assert.doesNotMatch(outboxSource, /postToGHLWebhook/, "GHL retry must never replay the ambiguous webhook");

const prismaSchema = await readFile("prisma/schema.prisma", "utf8");
for (const field of ["submittedAt", "qualificationStatus", "ghlOpportunityId", "ghlSyncStatus", "isQa", "LeadOpportunityOutbox", "LeadSubmissionEvent"]) {
  assert.match(prismaSchema, new RegExp(`\\b${field}\\b`), `LeadSubmission.${field} is missing`);
}

const routingNoticeSource = await readFile("src/components/LeadRoutingNotice.tsx", "utf8");
assert.match(routingNoticeSource, /Submission does not mean Pruitt has accepted the transaction/, "transaction routing notice is incomplete");
assert.match(routingNoticeSource, /does not enroll you in Pruitt Title marketing/, "newsletter consent boundary is incomplete");

console.log(`Lead-attribution gate passed across ${requiredClientForms.length} public forms and both server intake paths`);
