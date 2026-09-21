import assert from "node:assert/strict";

const origin = (process.env.TARGET_ORIGIN || "http://127.0.0.1:3217").replace(/\/$/, "");
const paths = {
  terms: "/terms",
  privacy: "/privacy-policy",
  firpta: "/blog/firpta-explained-dmv",
  netSheet: "/calculators/seller-net-sheet",
  about: "/about-will-rapuano",
};

const entries = await Promise.all(
  Object.entries(paths).map(async ([name, path]) => {
    const response = await fetch(`${origin}${path}`, { signal: AbortSignal.timeout(30_000) });
    assert.equal(response.status, 200, `${path} returned HTTP ${response.status}`);
    return [name, await response.text()];
  }),
);
const html = Object.fromEntries(entries);

assert.ok(!html.terms.includes("content coming soon"), "Terms page is still a placeholder");
assert.ok(html.terms.includes("not legal, tax, accounting"), "Terms page lacks calculator/content limitations");
assert.ok(html.privacy.includes("GoHighLevel"), "Privacy policy does not disclose lead routing");
assert.ok(html.privacy.includes("Pruitt Title LLC"), "Privacy policy does not disclose the service-provider relationship");

assert.ok(html.firpta.includes("buyer is generally the withholding agent"), "FIRPTA buyer responsibility is missing");
assert.ok(html.firpta.includes("actual knowledge"), "FIRPTA certification limitation is missing");
assert.ok(html.firpta.includes("irs.gov/individuals/international-taxpayers/firpta-withholding"), "FIRPTA IRS source is missing");
assert.ok(html.firpta.includes("Do not submit an SSN"), "FIRPTA intake warning is missing");

assert.ok(html.netSheet.includes("Build your seller estimate"), "Hosted seller calculator is missing");
assert.ok(html.netSheet.includes("Projected seller proceeds"), "Seller calculator result is missing");
assert.ok(!html.netSheet.includes("palmagent.com"), "Seller calculator still leaks visitors to PalmAgent");
assert.ok(html.netSheet.includes('"@type":"FAQPage"'), "Seller net sheet FAQ schema is missing");

assert.ok(html.firpta.includes("/about-will-rapuano"), "FIRPTA author/entity link is missing");
assert.ok(html.about.includes("Marketing and Business Development Officer"), "About page lacks Will's verified title");

console.log("Optimized-plan checks passed: compliance, FIRPTA, entity, and seller-funnel requirements are rendered");
