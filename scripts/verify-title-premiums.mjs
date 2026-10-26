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

// Pages that show the calculator (and Vienna, which shares Fairfax's cost table) quote the
// same Pruitt rates in their FAQs, so the answer and the calculator never disagree.
const usd = (n) => `$${n.toLocaleString("en-US")}`;
const faqExamples = [
  ["fairfax-va", 600_000],
  ["vienna-va", 600_000],
  ["arlington-va", 500_000],
  ["loudoun-county-va", 775_000],
  ["prince-william-county-va", 525_000],
];
for (const [slug, price] of faqExamples) {
  const page = await readFile(`src/app/(marketing)/title-company/${slug}/page.tsx`, "utf8");
  assert.doesNotMatch(page, /Stewart/, `${slug}: FAQ must quote Pruitt Title's rates, like the calculator`);
  assert.match(page, /At Pruitt Title's rates \(a First American Eagle owner's policy, before discounts\)/, `${slug}: FAQ must say whose rates it quotes`);
  assert.ok(page.includes(`${usd(price)}`) && page.includes(`is ${usd(ownersTitlePremium("VA", price))}`), `${slug}: FAQ owner's premium on ${usd(price)} must be ${usd(ownersTitlePremium("VA", price))}`);
  assert.ok(page.includes("lender's policy issued with it is $200"), `${slug}: FAQ lender's premium must be $200`);
}
const localPage = await readFile("src/components/LocalTitleCompanyPage.tsx", "utf8");
assert.doesNotMatch(localPage, /Stewart|STEWART/, "The local cost table must use the calculator's schedule");
assert.match(localPage, /ownersTitlePremium\("VA", EXAMPLE_PRICE\)/);
assert.match(localPage, /simultaneousLendersTitlePremium\("VA", EXAMPLE_LOAN\)/);

console.log("Calculator title premiums and the calculator pages' FAQs match Pruitt Title's quote calculator in VA, MD and DC.");
