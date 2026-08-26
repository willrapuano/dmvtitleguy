import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

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
assert.match(crmSource, /Version:\s*"v3"/, "GHL opportunity sync must declare its versioned API contract");
assert.match(crmSource, /locationId,\s*\n\s*pipelineId,/, "GHL v3 opportunity search must use camelCase query keys");
assert.match(crmSource, /SEO Submission ID/, "GHL opportunities do not preserve submission IDs");

const prismaSchema = await readFile("prisma/schema.prisma", "utf8");
for (const field of ["submittedAt", "qualificationStatus", "ghlOpportunityId", "ghlSyncStatus"]) {
  assert.match(prismaSchema, new RegExp(`\\b${field}\\b`), `LeadSubmission.${field} is missing`);
}

const routingNoticeSource = await readFile("src/components/LeadRoutingNotice.tsx", "utf8");
assert.match(routingNoticeSource, /Submission does not mean Pruitt has accepted the transaction/, "transaction routing notice is incomplete");
assert.match(routingNoticeSource, /does not enroll you in Pruitt Title marketing/, "newsletter consent boundary is incomplete");

console.log(`Lead-attribution gate passed across ${requiredClientForms.length} public forms and both server intake paths`);
