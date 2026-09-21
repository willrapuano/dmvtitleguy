import assert from "node:assert/strict";

const targetOrigin = (process.env.TARGET_ORIGIN || "http://127.0.0.1:3000").replace(/\/$/, "");
const canonicalOrigin = "https://dmvtitleguy.io";
const surveyPath = "/blog/types-of-property-surveys-dc-md-va";

const supportingPaths = [
  "/title-search-vienna-va",
  "/title-search-fairfax-va",
  "/commercial-due-diligence",
];

const [articleResponse, sitemapResponse, ...supportingResponses] = await Promise.all([
  fetch(`${targetOrigin}${surveyPath}`, { signal: AbortSignal.timeout(30_000) }),
  fetch(`${targetOrigin}/sitemap.xml`, { signal: AbortSignal.timeout(30_000) }),
  ...supportingPaths.map((path) =>
    fetch(`${targetOrigin}${path}`, { signal: AbortSignal.timeout(30_000) })
  ),
]);

assert.equal(articleResponse.status, 200, `${surveyPath} returned HTTP ${articleResponse.status}`);
assert.equal(sitemapResponse.status, 200, `sitemap.xml returned HTTP ${sitemapResponse.status}`);

for (const [index, response] of supportingResponses.entries()) {
  assert.equal(response.status, 200, `${supportingPaths[index]} returned HTTP ${response.status}`);
}

const articleHtml = await articleResponse.text();
const sitemapXml = await sitemapResponse.text();
const canonical = articleHtml.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];

assert.equal(canonical, `${canonicalOrigin}${surveyPath}`);
assert.ok(articleHtml.includes("Types of Property Surveys"), "survey guide title is missing");
assert.ok(articleHtml.includes("Boundary survey"), "survey guide is missing boundary-survey coverage");
assert.ok(articleHtml.includes("ALTA/NSPS Land Title Survey"), "survey guide is missing ALTA/NSPS coverage");
assert.ok(articleHtml.includes("Location drawing"), "survey guide is missing location-drawing coverage");
assert.ok(articleHtml.includes('"@type":"BlogPosting"'), "survey guide is missing BlogPosting schema");
assert.ok(articleHtml.includes('"@type":"FAQPage"'), "survey guide is missing FAQPage schema");

const surveyUrlMatches = sitemapXml.match(new RegExp(`${canonicalOrigin}${surveyPath}`, "g")) || [];
assert.equal(surveyUrlMatches.length, 1, "survey guide must appear exactly once in the sitemap");
assert.ok(
  !sitemapXml.includes(`${canonicalOrigin}/blog/title-search-process-explained`),
  "sitemap still contains the redirecting title-search-process-explained URL"
);

const supportingHtml = await Promise.all(supportingResponses.map((response) => response.text()));
for (const [index, html] of supportingHtml.entries()) {
  assert.ok(
    html.includes(`href="${surveyPath}"`),
    `${supportingPaths[index]} does not link to the survey guide`
  );
}

console.log(
  "Competitive content passed: survey guide is direct, self-canonical, structured, sitemap-listed, and internally linked"
);
