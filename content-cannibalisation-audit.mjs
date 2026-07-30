#!/usr/bin/env node
/**
 * Flag blog posts competing with a landing page for the same phrase.
 *
 * This is the check that should run before publishing a post about a place we already
 * have a landing page for. It exists because a batch of posts each opened with
 * "Title Company in <place>" — the exact phrase the matching landing page targets —
 * so the two pages competed for one intent and split their own ranking.
 *
 * The criterion is deliberately "a landing page owns this phrase", NOT "the slug
 * collides". An earlier pass used slug collision and got it wrong in both directions:
 * it retitled a post whose sibling had an identical title (achieving nothing) while
 * missing posts that cannibalised a landing page under a different slug.
 *
 * Heuristic, not authoritative — it reports candidates for a human to judge. It reads
 * published Sanity posts and the landing-page slugs in src/data/locations.ts, so it
 * needs no build and no token.
 *
 *   node content-cannibalisation-audit.mjs
 *   node content-cannibalisation-audit.mjs "Proposed Post Title" my-proposed-slug
 */

import { readFileSync } from "fs";

const PROJECT = "4s0dloxi";
const DATASET = "production";
const API = "2024-01-01";

/**
 * Opening phrases our landing pages target. A post leading with one of these is
 * competing with a landing page rather than complementing it.
 */
const COMMERCIAL_LEADS = [
  /^title company (in|for) /i,
  /^title (&|and) closing services (in|for) /i,
  /^title search (in|for) /i,
  /^title insurance (in|for) /i,
  /^(best|top) title compan/i,
];

function landingSlugs(path = "src/data/locations.ts") {
  const src = readFileSync(path, "utf8");
  return new Set([...src.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]));
}

async function publishedPosts() {
  const groq = `*[_type=="post" && !(_id in path("drafts.**"))]{"slug":slug.current,title}`;
  const res = await fetch(
    `https://${PROJECT}.api.sanity.io/v${API}/data/query/${DATASET}?query=${encodeURIComponent(groq)}`
  );
  if (!res.ok) throw new Error(`query ${res.status}`);
  return (await res.json()).result;
}

const slugs = landingSlugs();
const posts = await publishedPosts();

const [argTitle, argSlug] = process.argv.slice(2);
if (argTitle) posts.push({ slug: argSlug || "(proposed)", title: argTitle, proposed: true });

console.log(`published posts: ${posts.filter((p) => !p.proposed).length}   landing-page slugs: ${slugs.size}\n`);

const flagged = [];
for (const p of posts) {
  const lead = COMMERCIAL_LEADS.find((re) => re.test(p.title || ""));
  if (!lead) continue;
  // A commercial lead only cannibalises if a landing page actually exists for it.
  const hasLanding = slugs.has(p.slug);
  flagged.push({ ...p, hasLanding });
}

const real = flagged.filter((f) => f.hasLanding);
const soft = flagged.filter((f) => !f.hasLanding);

if (real.length) {
  console.log(`COMPETING WITH A LANDING PAGE — ${real.length}:`);
  for (const f of real) console.log(`  /${f.slug}\n     post title: ${f.title}\n     landing page /${f.slug} targets the same phrase\n`);
} else {
  console.log("COMPETING WITH A LANDING PAGE — 0");
}

if (soft.length) {
  console.log(`\nCommercial lead but no matching landing page (usually fine) — ${soft.length}:`);
  for (const f of soft) console.log(`  ${f.title}   [/${f.slug}]`);
}

// Exact-duplicate titles are always a defect, landing page or not.
const byTitle = new Map();
for (const p of posts) {
  const k = (p.title || "").toLowerCase().trim();
  if (!byTitle.has(k)) byTitle.set(k, []);
  byTitle.get(k).push(p.slug);
}
const dupes = [...byTitle].filter(([, v]) => v.length > 1);
console.log(`\nIDENTICAL POST TITLES — ${dupes.length}`);
for (const [t, v] of dupes) console.log(`  "${t}"\n     ${v.join(", ")}`);

process.exit(real.length || dupes.length ? 1 : 0);
