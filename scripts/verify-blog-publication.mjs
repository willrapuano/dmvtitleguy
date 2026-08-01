import assert from "node:assert/strict";
import { BLOG_POSTS, blogPostModifiedDateISO, isBlogPostPublished } from "../src/data/blog.ts";

const targetOrigin = (process.env.TARGET_ORIGIN || "http://127.0.0.1:3000").replace(/\/$/, "");
const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4s0dloxi").trim();
const sanityUrl = new URL(`https://${projectId}.api.sanity.io/v2024-01-01/data/query/production`);
sanityUrl.searchParams.set(
  "query",
  `*[_type in ["post","blogPost"] && !(_id in path("drafts.**")) && publishedAt > now()] { "slug": slug.current }`,
);

assert.equal(
  isBlogPostPublished({ dateISO: "2999-01-01" }, "2026-07-31"),
  false,
  "future static posts must not be published",
);
assert.equal(
  blogPostModifiedDateISO({ dateISO: "2026-07-26", updatedAtISO: "2026-07-25T11:10:05Z" }),
  "2026-07-26",
  "dateModified must not precede datePublished",
);

const sanityResponse = await fetch(sanityUrl, { signal: AbortSignal.timeout(30_000) });
assert.equal(sanityResponse.status, 200, `Sanity future inventory returned HTTP ${sanityResponse.status}`);
const sanityPayload = await sanityResponse.json();
const todayISO = new Date().toISOString().slice(0, 10);
const futureStaticSlugs = BLOG_POSTS
  .filter((post) => !isBlogPostPublished(post, todayISO))
  .map((post) => post.slug);
const futureSlugs = new Set([
  ...futureStaticSlugs,
  ...(sanityPayload.result || []).map((post) => post.slug).filter(Boolean),
]);

for (const slug of futureSlugs) {
  const response = await fetch(`${targetOrigin}/blog/${slug}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(30_000),
  });
  assert.equal(response.status, 404, `future post /blog/${slug} returned HTTP ${response.status}`);
}

console.log(`Blog publication guard passed: ${futureSlugs.size} scheduled routes are private`);
