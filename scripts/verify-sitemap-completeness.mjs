import assert from "node:assert/strict";
import { PUBLISHED_BLOG_POSTS } from "../src/data/blog.ts";
import { postCanonicalPath } from "../src/lib/post-titles.ts";
import { fetchWithRetry } from "./lib/fetch-with-retry.mjs";

const targetOrigin = (process.env.TARGET_ORIGIN || "http://127.0.0.1:3000").replace(/\/$/, "");
const canonicalOrigin = "https://dmvtitleguy.com";
const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4s0dloxi").trim();
const dataset = "production";
const query = `*[_type in ["post","blogPost"] && !(_id in path("drafts.**")) && publishedAt <= now()] { "slug": slug.current }`;

const sanityUrl = new URL(`https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}`);
sanityUrl.searchParams.set("query", query);

const [sitemapResponse, sanityResponse] = await Promise.all([
  fetch(`${targetOrigin}/sitemap.xml`, { signal: AbortSignal.timeout(30_000) }),
  fetchWithRetry(sanityUrl),
]);

assert.equal(sitemapResponse.status, 200, `sitemap.xml returned HTTP ${sitemapResponse.status}`);
assert.equal(sanityResponse.status, 200, `Sanity inventory returned HTTP ${sanityResponse.status}`);

const sitemapXml = await sitemapResponse.text();
const sanityPayload = await sanityResponse.json();
const sanitySlugs = (sanityPayload.result || [])
  .map((post) => post.slug)
  .filter(Boolean);
const publishedSlugs = new Set([
  ...PUBLISHED_BLOG_POSTS.map((post) => post.slug),
  ...sanitySlugs,
]);
const expectedArticleUrls = new Set(
  Array.from(publishedSlugs, (slug) => `${canonicalOrigin}${postCanonicalPath(slug)}`)
);
const sitemapUrls = Array.from(sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);
const sitemapUrlSet = new Set(sitemapUrls);
const missing = Array.from(expectedArticleUrls).filter((url) => !sitemapUrlSet.has(url));
const expectedBlogUrls = Array.from(expectedArticleUrls)
  .filter((url) => new URL(url).pathname.startsWith("/blog/"))
  .sort();
const actualBlogUrls = sitemapUrls
  .filter((url) => new URL(url).pathname.startsWith("/blog/"))
  .sort();

assert.equal(sitemapUrls.length, sitemapUrlSet.size, "sitemap contains duplicate URLs");
assert.deepEqual(missing, [], `sitemap is missing published canonical articles:\n${missing.join("\n")}`);
assert.deepEqual(
  actualBlogUrls,
  expectedBlogUrls,
  "sitemap blog URLs do not exactly match the published canonical article inventory"
);

for (const match of sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
  const block = match[1];
  const location = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
  const lastModified = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
  if (!lastModified) continue;
  assert.ok(!Number.isNaN(Date.parse(lastModified)), `${location} has an invalid lastmod`);
  assert.ok(Date.parse(lastModified) <= Date.now(), `${location} has a future lastmod`);
}

console.log(
  `Sitemap completeness passed: ${publishedSlugs.size} published articles resolve to ${expectedArticleUrls.size} canonical URLs`
);
