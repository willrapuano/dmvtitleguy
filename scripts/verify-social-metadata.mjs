import assert from "node:assert/strict";

const targetOrigin = (process.env.TARGET_ORIGIN || "http://127.0.0.1:3000").replace(/\/$/, "");
const canonicalOrigin = "https://dmvtitleguy.com";
const routes = [
  "/",
  "/blog",
  "/contact",
  "/title-insurance",
  "/title-company-for-realtors",
  "/why-choose-us",
];

function attribute(html, selector, attributeName) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tag = html.match(new RegExp(`<meta[^>]+${escapedSelector}[^>]*>`, "i"))?.[0];
  return tag?.match(new RegExp(`${attributeName}="([^"]*)"`, "i"))?.[1] || "";
}

for (const route of routes) {
  const response = await fetch(`${targetOrigin}${route}`, { signal: AbortSignal.timeout(30_000) });
  assert.equal(response.status, 200, `${route} returned HTTP ${response.status}`);
  const html = await response.text();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  const expectedUrl = `${canonicalOrigin}${route === "/" ? "" : route}`;
  const ogTitle = attribute(html, 'property="og:title"', "content");
  const ogDescription = attribute(html, 'property="og:description"', "content");
  const ogUrl = attribute(html, 'property="og:url"', "content");
  const twitterTitle = attribute(html, 'name="twitter:title"', "content");
  const twitterDescription = attribute(html, 'name="twitter:description"', "content");

  assert.equal(canonical, expectedUrl, `${route} canonical is not route-specific`);
  assert.ok(ogTitle, `${route} is missing og:title`);
  assert.ok(ogDescription, `${route} is missing og:description`);
  assert.equal(ogUrl, expectedUrl, `${route} og:url is not route-specific`);
  assert.equal(twitterTitle, ogTitle, `${route} Twitter and Open Graph titles differ`);
  assert.equal(twitterDescription, ogDescription, `${route} Twitter and Open Graph descriptions differ`);
}

console.log(`Social metadata passed for ${routes.length} priority routes`);
