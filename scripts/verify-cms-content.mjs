// Guards the blog content that lives in Sanity, which no other check reads.
//
// Why: verify-tax-facts only scans src/. A 2026-09-24 audit of the 140 Sanity posts
// found about 190 errors it could not see:
// - tax claims the 2026-09-23 audit had already corrected in code;
// - posts speaking as the title company ("At DMV Title Guy, we close…");
// - 111 duplicated callout boxes.
// This check fails the release if any of those return.
//
// Rules:
// - Tax claims come from ./lib/tax-claim-rules.mjs (shared with verify-tax-facts),
//   plus the CMS-only patterns below. Each one was checked against the primary
//   source cited next to it.
// - Identity rules come from the site brief: DMV Title Guy is Will's educational
//   brand and never performs title, settlement, or escrow work; Pruitt Title does.
//
// Usage: node scripts/verify-cms-content.mjs   (reads published posts; no token needed)

import { readFileSync } from "node:fs";
import { bannedClaims } from "./lib/tax-claim-rules.mjs";

const PROJECT_ID = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4s0dloxi").trim();
const QUERY = '*[_type=="post" && !(_id in path("drafts.**"))]{"slug":slug.current,title,excerpt,body}';

const cmsClaims = [
  // D.C. Code § 42-1103(e): the first-time benefit is a reduced 0.725% rate. The only full
  // exemption is the separate Lower Income Homeownership program (§ 47-3503).
  { pattern: /\b(?:DC|D\.C\.|District(?:'s)?)\b[^.\n]{0,60}first[- ]time[^.\n]{0,40}exemption|first[- ]time[^.\n]{0,40}recordation tax exemption/i, unless: /not an exemption|lower income|Maryland/i, why: "DC first-time buyers get a reduced 0.725% recordation rate, not an exemption (D.C. Code § 42-1103(e))" },
  // D.C. Code §§ 42-1103(a-4), 47-903(a-4): 1.45% each at $400,000+, so 2.9% combined on most sales.
  { pattern: /combined rate for most residential transactions is 2\.2%/i, why: "DC sales at $400,000+ pay 2.9% combined (1.45% + 1.45%)" },
  // Md. Tax-Property §§ 12-103(a), 12-108(i): recordation is charged on the price, not the loan.
  { pattern: /recordation tax is based on the loan|recordation tax on the deed and (?:separately )?on the deed of trust/i, why: "Maryland recordation tax is on the price; a purchase-money deed of trust is not taxed separately" },
  // Montgomery County 311, "Rates for the County Transfer Tax": 1% of the price on typical residential sales.
  { pattern: /Montgomery County does not (?:add|impose|charge) a (?:county |local )?transfer tax/i, why: "Montgomery County charges a 1% county transfer tax" },
];

// DMV Title Guy is not a title, settlement, escrow or insurance provider and must not
// speak as one (docs/DMVTITLEGUY-SITE-BRIEF.md in velocity-connectors).
const identityRules = [
  { pattern: /\bAt (?:DMV ?Title ?Guy|DMVTitleGuy|Pruitt Title),? (?:we|our)\b/i, why: "site-voice claim of doing title work; attribute it to Pruitt Title in the third person" },
  { pattern: /Pruitt Title\s*\/\s*DMV Title Guy|DMV Title Guy\s*\/\s*Pruitt Title/i, why: "presents DMV Title Guy and Pruitt Title as one provider" },
  { pattern: /\b(?:Contact|Call) (?:DMV ?Title ?Guy|DMVTitleGuy)\b[^.\n]{0,60}(?:title search|closing|settlement|escrow|consultation)/i, why: "DMV Title Guy does not perform title searches, closings or consultations" },
  { pattern: /\bour (?:DC|Bethesda|Maryland|Virginia|Fairfax|Arlington|Alexandria) title company\b(?! (?:guide|page|overview))/i, why: "DMV Title Guy does not own a title company; link to the guide or name Pruitt Title" },
  { pattern: /\bwe(?:'ll| will| can| also)? (?:close|conduct|disburse|underwrite) (?:transactions|closings|settlements|the closing|funds)\b/i, why: "site-voice claim of closing or disbursing" },
];

// Drafting leftovers that reached a live post on 2026-09-24: an AI assistant's reply
// ("I am unable to write files directly…") and content-pipeline metadata.
const draftingLeftovers = [
  { pattern: /\bI (?:am unable|cannot|can't) (?:to )?write files\b|\bsave the following content to a file\b|\bas an AI\b|\bHere is the (?:complete|full|revised|updated) (?:blog )?post\b/i, why: "leftover AI-assistant text, not article content" },
  { pattern: /\b(?:target_keyword|ownership_status|dedup_status|slug_status)\s*:/i, why: "leftover content-pipeline metadata, not article content" },
];

const spanText = (blocks) =>
  Array.isArray(blocks) ? blocks.map((b) => (b?.children || []).map((s) => s?.text || "").join("")).join("\n") : String(blocks || "");

// Every piece of reader-visible text in a post, with where it came from.
function* texts(post) {
  if (post.title) yield ["title", post.title];
  if (post.excerpt) yield ["excerpt", post.excerpt];
  for (const [i, b] of (post.body || []).entries()) {
    if (b._type === "block") yield [`block ${i}`, spanText([b])];
    else if (b._type === "callout") yield [`callout ${i}`, `${b.title || ""}\n${spanText(b.body)}`];
    else if (b._type === "accordion") for (const it of b.items || []) yield [`FAQ ${i}`, `${it.question || ""}\n${spanText(it.answer)}`];
    else if (b._type === "table") for (const r of b.rows || []) yield [`table ${i}`, (r.cells || []).join(" | ")];
  }
}

const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
function blockSignature(b) {
  if (b._type === "block") return `block:${norm(spanText([b]))}`;
  if (b._type === "callout") return `callout:${norm(b.title)}|${norm(spanText(b.body))}`;
  return null;
}

// CMS_CONTENT_FIXTURE points the check at a local JSON array of posts instead of
// Sanity; verify-cms-content-fixture.mjs uses it to prove each rule still fires.
const fixture = process.env.CMS_CONTENT_FIXTURE;
let posts;
if (fixture) {
  posts = JSON.parse(readFileSync(fixture, "utf8"));
} else {
  const response = await fetch(`https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/production?query=${encodeURIComponent(QUERY)}`);
  if (!response.ok) {
    console.error(`CMS content check could not read Sanity (HTTP ${response.status}); refusing to pass unchecked content.`);
    process.exit(1);
  }
  posts = (await response.json()).result || [];
}
if (!fixture && posts.length < 50) {
  console.error(`CMS content check expected the full blog, got ${posts.length} posts; refusing to pass.`);
  process.exit(1);
}

const failures = [];
const rules = [...bannedClaims, ...cmsClaims, ...identityRules, ...draftingLeftovers];
for (const post of posts) {
  for (const [where, text] of texts(post)) {
    for (const sentence of text.split(/(?<=[.!?])\s+|\n+/)) {
      for (const { pattern, why, unless } of rules) {
        if (pattern.test(sentence) && !(unless && unless.test(sentence))) {
          failures.push(`/blog/${post.slug} (${where}): ${why}\n    ${sentence.trim().slice(0, 180)}`);
        }
      }
    }
  }
  const body = post.body || [];
  body.forEach((b, i) => {
    if (!b._key) failures.push(`/blog/${post.slug} (block ${i}): missing _key — Sanity Studio cannot edit this item`);
    if (b._type === "callout" && !spanText(b.body).trim()) failures.push(`/blog/${post.slug} (callout ${i}): callout "${b.title || ""}" has no body text`);
    const sig = blockSignature(b);
    const next = body[i + 1] && blockSignature(body[i + 1]);
    if (sig && next && sig === next && sig.length > 12) failures.push(`/blog/${post.slug} (block ${i}): the same ${b._type} appears twice in a row`);
  });
  // A callout repeated anywhere in the post, e.g. an emoji-only title difference.
  const seen = new Map();
  body.forEach((b, i) => {
    if (b._type !== "callout") return;
    const sig = blockSignature(b);
    if (seen.has(sig)) failures.push(`/blog/${post.slug} (callouts ${seen.get(sig)} and ${i}): the same callout appears twice`);
    else seen.set(sig, i);
  });
}

if (failures.length) {
  console.error(`CMS content check failed (${failures.length}):\n${failures.join("\n")}`);
  process.exit(1);
}
console.log(`CMS content verified: ${posts.length} Sanity posts, ${rules.length} claim and identity rules, no duplicated or keyless blocks`);
