import assert from "node:assert/strict";
import {
  intentBucket,
  normalizeQueryText,
  queryGeographicModifierBucket,
} from "./lib/gsc-fresh-opportunities.mjs";

const geographicFixtures = [
  ["how much is title insurance near washington, dc", "core-dmv-query-modifier"],
  ["how much is title insurance near Washington D.C.", "core-dmv-query-modifier"],
  ["title company in Silver Spring", "core-dmv-query-modifier"],
  ["title company in McLean", "core-dmv-query-modifier"],
  ["title company Northern Virginia", "core-dmv-query-modifier"],
  ["title company NOVA", "core-dmv-query-modifier"],
  ["title company dc", "core-dmv-query-modifier"],
  ["title company Leesburg", "core-dmv-query-modifier"],
  ["title company Centerville VA", "core-dmv-query-modifier"],
  ["how much is title insurance near baltimore, md", "extended-dc-md-va-query-modifier"],
  ["how much is title insurance near maryland", "extended-dc-md-va-query-modifier"],
  ["how much is title insurance near richmond va", "extended-dc-md-va-query-modifier"],
  ["title company Anne Arundel", "extended-dc-md-va-query-modifier"],
  ["how much is title insurance near charleston, wv", "outside-dc-md-va-query-modifier"],
  ["how much is title insurance near west virginia", "outside-dc-md-va-query-modifier"],
  ["title survey", "unrecognized-or-no-geographic-modifier"],
  ["title company in Chicago", "unrecognized-or-no-geographic-modifier"],
  ["title insurance is available", "unrecognized-or-no-geographic-modifier"],
  ["advanced title advice", "unrecognized-or-no-geographic-modifier"],
];

for (const [query, expected] of geographicFixtures) {
  assert.equal(queryGeographicModifierBucket(query), expected, `Geographic-modifier fixture failed: ${query}`);
}

for (const query of [
  "title insurance costs",
  "title insurance rates",
  "title insurance fees",
  "title insurance premiums",
  "title insurance quotes",
  "title insurance calculator",
  "title insurance estimate",
  "title insurance estimator",
]) {
  assert.equal(intentBucket(query), "title-insurance-pricing", `Pricing fixture failed: ${query}`);
}

assert.equal(intentBucket("title company in McLean"), "title-company-local-commercial");
assert.equal(intentBucket("best title company near me"), "title-company-local-commercial");
assert.equal(intentBucket("title companies near me"), "title-company-local-commercial");
assert.equal(intentBucket("Tysons VA title services"), "title-company-local-commercial");
assert.equal(intentBucket("Herndon VA title closings"), "title-company-local-commercial");
assert.equal(intentBucket("closing services Falls Church Virginia"), "title-company-local-commercial");
assert.equal(intentBucket("settlement agent Northern Virginia"), "title-company-local-commercial");
assert.equal(intentBucket("title insurer Washington DC"), "title-company-local-commercial");
assert.equal(intentBucket("how to start a title company"), "title-company-informational-or-ambiguous");
assert.equal(intentBucket("what is a title company"), "title-company-informational-or-ambiguous");
assert.equal(intentBucket("what are title services"), "title-company-informational-or-ambiguous");
assert.equal(intentBucket("title survey"), "property-survey");
assert.equal(normalizeQueryText("Washington D.C."), "washington dc");

process.stdout.write(`Verified ${geographicFixtures.length + 21} GSC opportunity-classifier fixtures.\n`);
