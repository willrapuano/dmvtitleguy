import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  ownersTitlePremium,
  simultaneousLendersTitlePremium,
  TITLE_PREMIUM_SOURCE_NOTE,
} from "../src/lib/titlePremiums.ts";

// Samples read from Pruitt Title's own quote calculator (see the fixture's "source").
// If Pruitt's rates change, re-read them and update both the fixture and
// src/lib/titlePremiums.ts; this guard keeps the two from drifting apart.
const samples = JSON.parse(
  await readFile(new URL("./fixtures/pruitt-title-premium-samples.json", import.meta.url), "utf8")
);

for (const state of ["VA", "MD", "DC"]) {
  const { owners, simultaneousLenders } = samples[state];
  assert.ok(owners.length >= 200, `${state}: expected the full sample grid`);
  for (const [price, premium] of owners) {
    assert.equal(ownersTitlePremium(state, price), premium, `${state} owner's premium on $${price}`);
  }
  assert.equal(simultaneousLendersTitlePremium(state, Math.round(500_000 * 0.8)), simultaneousLenders, `${state} simultaneous lender's premium`);
  assert.equal(simultaneousLendersTitlePremium(state, 0), 0, `${state}: a cash purchase has no lender's policy`);
}

// Pruitt's calculator on the default and Fairfax examples (purchase with financing).
assert.equal(ownersTitlePremium("VA", 500_000), 2_518);
assert.equal(ownersTitlePremium("VA", 600_000), 2_968);
assert.equal(simultaneousLendersTitlePremium("VA", 400_000), 200);
assert.equal(ownersTitlePremium("MD", 500_000), 2_993);
assert.equal(simultaneousLendersTitlePremium("MD", 400_000), 275);
assert.equal(ownersTitlePremium("DC", 500_000), 3_240);
assert.equal(simultaneousLendersTitlePremium("DC", 400_000), 150);

// The calculator must price title insurance from the schedule, never a flat percentage
// of the price (which once showed a $1,750 simultaneous lender's policy), and say whose
// rates it uses.
const calculator = await readFile("src/components/ClosingCostCalculator.tsx", "utf8");
for (const state of ["VA", "MD", "DC"]) {
  assert.match(calculator, new RegExp(`titleInsuranceOwner: ownersTitlePremium\\("${state}", price\\)`), `${state} owner's premium must use the schedule`);
  assert.match(calculator, new RegExp(`titleInsuranceLender: simultaneousLendersTitlePremium\\("${state}", loanAmount\\)`), `${state} lender's premium must use the schedule`);
}
assert.doesNotMatch(calculator, /titleInsurance(?:Owner|Lender):\s*price\s*\*/, "Title premiums must not be a percentage of the price");
assert.match(calculator, /\{TITLE_PREMIUM_SOURCE_NOTE\}/, "The calculator must label whose title rates it shows");
assert.match(TITLE_PREMIUM_SOURCE_NOTE, /Pruitt Title's rates/);
assert.match(TITLE_PREMIUM_SOURCE_NOTE, /before reissue or other discounts/);

console.log("Calculator title premiums match Pruitt Title's quote calculator in VA, MD and DC.");
