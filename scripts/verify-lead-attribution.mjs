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
  assert.match(source, /if \(result\.retrySafe\) await releaseLeadSubmission/, `${file} can reopen an ambiguously delivered submission`);
}

const routingNoticeSource = await readFile("src/components/LeadRoutingNotice.tsx", "utf8");
assert.match(routingNoticeSource, /Submission does not mean Pruitt has accepted the transaction/, "transaction routing notice is incomplete");
assert.match(routingNoticeSource, /does not enroll you in Pruitt Title marketing/, "newsletter consent boundary is incomplete");

console.log(`Lead-attribution gate passed across ${requiredClientForms.length} public forms and both server intake paths`);
