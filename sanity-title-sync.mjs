#!/usr/bin/env node
/**
 * Sync Sanity post titles to the `h1` overrides in src/lib/post-titles.ts.
 *
 * Background: the site renders post titles through postDisplayTitle(), which prefers
 * an `h1` override over the CMS value. That is useful for a fix that has to ship
 * immediately, but if the override is left in place the CMS permanently disagrees
 * with production — an editor opens Studio, sees the old title on a post the site
 * renders differently, and "fixes" a field that has no effect.
 *
 * So the intended lifecycle is: add an `h1` override to ship the change, run this to
 * push it into Sanity, then delete the override. This script is the middle step.
 *
 * Idempotent: it patches only documents whose title actually differs, so a clean run
 * printing "nothing to do" is the expected steady state.
 *
 *   node sanity-title-sync.mjs                          # dry run, no token needed
 *   SANITY_TOKEN_DMVTITLEGUY=... node sanity-title-sync.mjs --apply
 *
 * See sanity-token.mjs for the variables accepted per project. Set one in this
 * environment once — Sanity tokens do not expire — rather than passing it per run.
 *
 * Needs an Editor token (Deploy Studio cannot write documents). The token is read
 * only from the environment, never argv, so it stays out of shell history.
 */

import { readFileSync } from "fs";
import { sanityToken, sanityTokenSource } from "./sanity-token.mjs";

const PROJECT = "4s0dloxi";
const DATASET = "production";
const API = "2024-01-01";
const TOKEN = sanityToken(PROJECT);
const APPLY = process.argv.includes("--apply");

/**
 * Slugs to leave alone even when they carry an `h1`. Add a slug here when the
 * override is deliberately fighting the CMS rather than waiting to replace it.
 */
const EXCLUDE = new Set([]);

function overridesWithH1(path = "src/lib/post-titles.ts") {
  const src = readFileSync(path, "utf8");
  const out = [];
  const re = /"([a-z0-9-]+)":\s*\{([\s\S]*?)\n\s{2}\},/g;
  let m;
  while ((m = re.exec(src))) {
    const h1 = (m[2].match(/h1:\s*"((?:[^"\\]|\\.)*)"/) || [])[1];
    if (h1 && !EXCLUDE.has(m[1])) out.push({ slug: m[1], h1: h1.replace(/\\"/g, '"') });
  }
  return out;
}

async function query(groq) {
  const url = `https://${PROJECT}.api.sanity.io/v${API}/data/query/${DATASET}?query=${encodeURIComponent(groq)}`;
  const res = await fetch(url, TOKEN ? { headers: { Authorization: `Bearer ${TOKEN}` } } : undefined);
  if (!res.ok) throw new Error(`query ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return (await res.json()).result;
}

async function mutate(mutations, dryRun = false) {
  const res = await fetch(
    `https://${PROJECT}.api.sanity.io/v${API}/data/mutate/${DATASET}?returnIds=true${dryRun ? "&dryRun=true" : ""}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({ mutations }),
    }
  );
  const text = await res.text();
  if (!res.ok) throw new Error(`mutate ${res.status}: ${text.slice(0, 600)}`);
  return JSON.parse(text);
}

const overrides = overridesWithH1();
if (!overrides.length) {
  console.log("No h1 overrides left in post-titles.ts — nothing to sync.");
  process.exit(0);
}

const docs = await query(
  `*[_type=="post" && slug.current in ${JSON.stringify(overrides.map((o) => o.slug))}]{_id,"slug":slug.current,title}`
);
const bySlug = new Map(docs.map((d) => [d.slug, d]));

const changes = [];
for (const o of overrides) {
  const doc = bySlug.get(o.slug);
  if (!doc) { console.log(`  skip ${o.slug} — not in Sanity`); continue; }
  if (doc.title === o.h1) { console.log(`  ok   ${o.slug} — already matches`); continue; }
  changes.push({ id: doc._id, slug: o.slug, from: doc.title, to: o.h1 });
}

console.log(`\nh1 overrides: ${overrides.length}   to change: ${changes.length}\n`);
for (const c of changes) console.log(`  ${c.slug}\n    - ${c.from}\n    + ${c.to}\n`);

if (!changes.length) { console.log("nothing to do."); process.exit(0); }
if (!APPLY) {
  if (TOKEN) console.log(`dryRun: ${JSON.stringify((await mutate(changes.map((c) => ({ patch: { id: c.id, set: { title: c.to } } })), true)).results)}`);
  console.log(`\nDRY RUN — re-run with --apply and a Sanity Editor token in the environment.`);
  process.exit(0);
}
if (!TOKEN) {
  // Prints which variables are accepted and how to create the token, rather than
  // letting the API answer with a bare 401.
  const { requireSanityToken } = await import("./sanity-token.mjs");
  try { requireSanityToken(PROJECT); } catch (e) { console.error(e.message); process.exit(1); }
}
console.log(`token source: ${sanityTokenSource(PROJECT)}`);

// Patch the title field alone so nothing else on the document can be clobbered.
await mutate(changes.map((c) => ({ patch: { id: c.id, set: { title: c.to } } })));

// Read back rather than trusting the mutation response.
const after = await query(
  `*[_type=="post" && slug.current in ${JSON.stringify(changes.map((c) => c.slug))}]{"slug":slug.current,title}`
);
const now = new Map(after.map((d) => [d.slug, d.title]));
let ok = 0;
for (const c of changes) {
  if (now.get(c.slug) === c.to) ok++;
  else console.log(`  MISMATCH ${c.slug}: expected "${c.to}", got "${now.get(c.slug)}"`);
}
console.log(`\napplied and verified: ${ok}/${changes.length}`);
if (ok === changes.length) console.log("Now delete the synced h1 entries from post-titles.ts — they are duplicates of the CMS.");
