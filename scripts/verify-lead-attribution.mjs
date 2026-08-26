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
}

for (const file of ["src/app/api/leads/route.ts", "src/lib/protected-lead-route.ts"]) {
  const source = await readFile(file, "utf8");
  assert.match(source, /leadAttributionFields\(body, request\)/, `${file} does not sanitize attribution server-side`);
}

const attributionSource = await readFile("src/lib/client-lead-attribution.ts", "utf8");
assert.match(attributionSource, /firstLandingPage/, "first landing path is missing");
assert.match(attributionSource, /conversionPage/, "conversion path is missing");
assert.ok(!/gclid|fbclid|msclkid/i.test(attributionSource), "ad click IDs must not be stored before a consent policy is implemented");

console.log(`Lead-attribution gate passed across ${requiredClientForms.length} public forms and both server intake paths`);
