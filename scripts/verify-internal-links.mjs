import assert from "node:assert/strict";

const canonicalOrigin = "https://dmvtitleguy.io";
const targetOrigin = (process.env.TARGET_ORIGIN || canonicalOrigin).replace(/\/$/, "");
const allowedRedirectPaths = new Set(["/agent-tools/contract-analyzer"]);
const priorityMinimums = new Map([
  ["/calculators/seller-net-sheet", 3],
  ["/blog/firpta-explained-dmv", 3],
  ["/blog/types-of-property-surveys-dc-md-va", 3],
  ["/about-will-rapuano", 3],
  ["/why-choose-us", 3],
]);

function normalizePath(value) {
  const url = new URL(value, canonicalOrigin);
  const pathname = url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, "");
  return pathname || "/";
}

function internalPath(href) {
  if (!href || /^(#|mailto:|tel:|javascript:)/i.test(href)) return null;
  try {
    const url = new URL(href, canonicalOrigin);
    if (url.origin !== canonicalOrigin && url.origin !== targetOrigin) return null;
    return normalizePath(url.pathname);
  } catch {
    return null;
  }
}

function extractLinks(html) {
  return Array.from(html.matchAll(/<a\b[^>]*\bhref=(?:"([^"]+)"|'([^']+)')[^>]*>/gi), (match) => match[1] || match[2])
    .map(internalPath)
    .filter(Boolean);
}

async function fetchPath(path) {
  return fetch(`${targetOrigin}${path}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(30_000),
  });
}

const sitemapResponse = await fetch(`${targetOrigin}/sitemap.xml`, { signal: AbortSignal.timeout(30_000) });
assert.equal(sitemapResponse.status, 200, `sitemap returned HTTP ${sitemapResponse.status}`);
const sitemapXml = await sitemapResponse.text();
const sitemapPaths = Array.from(sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => normalizePath(match[1]));
assert.ok(sitemapPaths.length, "sitemap contained no URLs");

const pages = new Map();
let cursor = 0;
async function crawlWorker() {
  while (cursor < sitemapPaths.length) {
    const path = sitemapPaths[cursor++];
    const response = await fetchPath(path);
    const html = await response.text();
    pages.set(path, { status: response.status, links: extractLinks(html) });
  }
}
await Promise.all(Array.from({ length: Math.min(12, sitemapPaths.length) }, () => crawlWorker()));

const incoming = new Map(sitemapPaths.map((path) => [path, new Set()]));
const destinations = new Map();
for (const [source, page] of pages) {
  assert.equal(page.status, 200, `sitemap page ${source} returned HTTP ${page.status}`);
  for (const destination of new Set(page.links)) {
    if (destination !== source && incoming.has(destination)) incoming.get(destination).add(source);
    if (!destinations.has(destination)) destinations.set(destination, new Set());
    destinations.get(destination).add(source);
  }
}

const failures = [];
cursor = 0;
const destinationEntries = [...destinations.entries()];
async function destinationWorker() {
  while (cursor < destinationEntries.length) {
    const [path, sources] = destinationEntries[cursor++];
    const response = await fetchPath(path);
    const redirect = response.status >= 300 && response.status < 400;
    if (response.status >= 400 || (redirect && !allowedRedirectPaths.has(path))) {
      failures.push({ path, status: response.status, location: response.headers.get("location"), sources: [...sources].slice(0, 5) });
    }
  }
}
await Promise.all(Array.from({ length: Math.min(12, destinationEntries.length) }, () => destinationWorker()));

for (const [path, minimum] of priorityMinimums) {
  const count = incoming.get(path)?.size || 0;
  if (count < minimum) failures.push({ path, status: "priority-link-gap", detail: `${count} unique incoming pages; need ${minimum}` });
}

const effectiveOrphans = [...incoming]
  .filter(([path, sources]) => path !== "/" && sources.size === 0)
  .map(([path]) => path);

console.log(
  `Internal-link crawl: ${sitemapPaths.length} sitemap pages, ${destinations.size} internal destinations, ${effectiveOrphans.length} effective orphan(s)`,
);
for (const [path, minimum] of priorityMinimums) {
  console.log(`Priority ${path}: ${incoming.get(path)?.size || 0} incoming page(s), minimum ${minimum}`);
}
if (effectiveOrphans.length) {
  console.log(`Effective-orphan backlog (triage, no regression gate yet): ${effectiveOrphans.slice(0, 20).join(", ")}${effectiveOrphans.length > 20 ? " …" : ""}`);
}
for (const failure of failures) console.error("FAIL", JSON.stringify(failure));
if (failures.length) process.exitCode = 1;

