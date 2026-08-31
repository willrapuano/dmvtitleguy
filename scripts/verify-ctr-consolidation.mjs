import assert from "node:assert/strict";

const targetOrigin = (process.env.TARGET_ORIGIN || "http://127.0.0.1:3000").replace(/\/$/, "");
const canonicalOrigin = "https://dmvtitleguy.io";
const isVercelPreview = new URL(targetOrigin).hostname.endsWith(".vercel.app");

const fixtures = {
  "/title-company-herndon-va": {
    title: "Herndon VA Title Company Guide | DMV Title Guy",
    description: "Practical Herndon and Fairfax County title and closing guidance. Request a provider introduction for independent review of an eligible transaction.",
    h1: "Herndon, VA Title Company & Closing Services",
  },
  "/title-company-tysons-va": {
    title: "Tysons VA Title Company Guide | DMV Title Guy",
    description: "Practical title and closing guidance for Tysons, Tysons Corner, and Fairfax County, plus a path to request an independent provider review.",
    h1: "Tysons, VA Title Company & Settlement Services",
  },
  "/title-search-vienna-va": {
    title: "Vienna VA Title Search Guide | DMV Title Guy",
    description: "Learn how Vienna title searches address ownership, liens, easements, restrictions, and other recorded matters before requesting a provider introduction.",
    h1: "Vienna, VA Title Search Services",
  },
  "/title-company-falls-church-va": {
    title: "Falls Church VA Title Company Guide | DMV Title Guy",
    description: "Practical title and closing guidance for Falls Church City and Fairfax County addresses, plus a path to request a provider introduction.",
    h1: "Title Company Serving Falls Church, VA",
  },
  "/title-company-silver-spring-md": {
    title: "Silver Spring MD Title Company Guide | DMV Title Guy",
    description: "Practical title and closing guidance for Silver Spring and Montgomery County, plus a path to request a provider introduction.",
    h1: "Title Company Serving Silver Spring, MD",
  },
  "/why-choose-us": {
    title: "How to Choose a DMV Title Provider | DMV Title Guy",
    description: "Use practical questions to compare title and settlement providers, understand Will Rapuano's role, and request an introduction without creating a service relationship.",
    h1: "How to Choose a Title Provider",
  },
  "/blog/what-is-a-title-settlement-fee": {
    title: "What Is a Title Settlement Fee? What It Covers in VA, MD & DC",
    description: "Learn what a title settlement fee covers, how it differs from title insurance, and where it appears on mortgage disclosures. Fees vary; request an itemized quote.",
    h1: "What Is a Title Settlement Fee?",
  },
};

const redirectFixtures = {
  "/title-company/falls-church-va": "/title-company-falls-church-va",
  "/title-company/silver-spring-md": "/title-company-silver-spring-md",
  "/blog/title-settlement-fee": "/blog/what-is-a-title-settlement-fee",
};

function decodeHtml(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&nbsp;", " ");
}

function tagAttribute(html, tagPattern, attributeName) {
  const tag = html.match(tagPattern)?.[0] || "";
  return decodeHtml(tag.match(new RegExp(`${attributeName}="([^"]*)"`, "i"))?.[1] || "");
}

function titleText(html) {
  return decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "");
}

function h1Text(html) {
  const matches = Array.from(html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi));
  assert.equal(matches.length, 1, `expected one h1, found ${matches.length}`);
  return decodeHtml(matches[0][1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function canonicalHref(html) {
  return tagAttribute(html, /<link\b(?=[^>]*\brel="canonical")[^>]*>/i, "href");
}

function metaContent(html, key, value) {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return tagAttribute(
    html,
    new RegExp(`<meta\\b(?=[^>]*\\b${key}="${escaped}")[^>]*>`, "i"),
    "content",
  );
}

for (const [path, expected] of Object.entries(fixtures)) {
  const response = await fetch(`${targetOrigin}${path}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(30_000),
  });
  assert.equal(response.status, 200, `${path} returned HTTP ${response.status}`);
  assert.equal(response.headers.get("location"), null, `${path} unexpectedly redirects`);
  if (!isVercelPreview) {
    assert.equal(response.headers.get("x-robots-tag"), null, `${path} sends X-Robots-Tag`);
  }

  const html = await response.text();
  const canonical = `${canonicalOrigin}${path}`;
  assert.equal(titleText(html), expected.title, `${path} title fixture changed`);
  assert.equal(metaContent(html, "name", "description"), expected.description, `${path} description fixture changed`);
  assert.equal(h1Text(html), expected.h1, `${path} h1 fixture changed`);
  assert.equal(canonicalHref(html), canonical, `${path} canonical mismatch`);
  assert.equal(metaContent(html, "property", "og:url"), canonical, `${path} og:url mismatch`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html), `${path} is noindex`);

  if (path.startsWith("/title-company-") || path === "/title-search-vienna-va") {
    assert.ok(html.includes(canonical), `${path} structured data does not reference its canonical URL`);
  }
}

for (const [source, destination] of Object.entries(redirectFixtures)) {
  const query = "?source=ctr-consolidation";
  const response = await fetch(`${targetOrigin}${source}${query}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(30_000),
  });
  assert.ok([301, 308].includes(response.status), `${source} is not a permanent redirect`);
  const location = new URL(response.headers.get("location") || "", `${targetOrigin}${source}${query}`);
  assert.equal(location.pathname, destination, `${source} redirects to the wrong winner`);
  assert.equal(location.search, query, `${source} does not preserve its query string`);

  const winner = await fetch(`${targetOrigin}${destination}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(30_000),
  });
  assert.equal(winner.status, 200, `${source} target returned HTTP ${winner.status}`);
  assert.equal(winner.headers.get("location"), null, `${source} creates a redirect chain`);
}

const sitemapResponse = await fetch(`${targetOrigin}/sitemap.xml`, { signal: AbortSignal.timeout(30_000) });
assert.equal(sitemapResponse.status, 200, `sitemap returned HTTP ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const sitemapUrls = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);

for (const path of Object.keys(fixtures)) {
  const count = sitemapUrls.filter((url) => url === `${canonicalOrigin}${path}`).length;
  assert.equal(count, 1, `${path} appears ${count} times in the sitemap`);
}
for (const source of Object.keys(redirectFixtures)) {
  assert.ok(!sitemapUrls.includes(`${canonicalOrigin}${source}`), `${source} remains in the sitemap`);
}

for (const path of [
  "/blog/what-is-a-title-settlement-fee",
  "/closing-costs/seller-virginia",
  "/maryland-closing-cost-calculator",
]) {
  const response = await fetch(`${targetOrigin}${path}`, { signal: AbortSignal.timeout(30_000) });
  const html = await response.text();
  assert.equal(response.status, 200, `${path} returned HTTP ${response.status}`);
  assert.match(html, /href="\/calculators\/seller-net-sheet"/i, `${path} lacks a crawlable seller-net-sheet link`);
}

const sellerNet = await fetch(`${targetOrigin}/calculators/seller-net-sheet`, {
  redirect: "manual",
  signal: AbortSignal.timeout(30_000),
});
assert.equal(sellerNet.status, 200, "seller net sheet is not directly reachable");
const sellerNetHtml = await sellerNet.text();
assert.equal(canonicalHref(sellerNetHtml), `${canonicalOrigin}/calculators/seller-net-sheet`, "seller net sheet canonical mismatch");
assert.ok(!sellerNetHtml.includes("palmagent.com"), "seller net sheet leaks to PalmAgent");

for (const forbidden of [
  "Same-Week Closings",
  "closes on time, every time",
  "within hours",
  "going back 50+ years",
  "thousands of residential closings",
]) {
  for (const path of Object.keys(fixtures)) {
    const response = await fetch(`${targetOrigin}${path}`, { signal: AbortSignal.timeout(30_000) });
    const html = await response.text();
    assert.ok(!html.includes(forbidden), `${path} contains unsupported claim: ${forbidden}`);
  }
}

console.log(`CTR consolidation passed: ${Object.keys(fixtures).length} winners, ${Object.keys(redirectFixtures).length} permanent redirects, and contextual seller links verified`);
