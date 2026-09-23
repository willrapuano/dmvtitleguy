// Blog posts retired into a stronger post on the same search intent.
//
// Why: by 2026-09-23 the blog had 136 posts, and 41 of them sat in 8 groups
// that each answered one question several times over (six posts on enhanced vs
// standard title insurance, seven on lender's vs owner's). Near-identical pages
// split one query's ranking between them, and most of the duplicates had no
// impressions at all. Each keeper below is the post in its group with the most
// clicks, or the most impressions where none had clicks (GSC, 2026-06-22 to
// 2026-09-21).
//
// Posts that answer a genuinely different question were left alone even when
// the slugs look alike: the per-state cost and "who chooses" posts, the two
// Virginia contract posts (both earn clicks), homeowners insurance vs title
// insurance, and the lender-audience post.
//
// This map drives two things so they cannot drift apart:
//   - legacyPathMappings below issues a one-hop 301 from each retired slug;
//   - postCanonicalPath() points each retired slug at its keeper, so the blog
//     index, related posts and the sitemap stop listing it.
// The Sanity documents are untouched; removing this entry restores a post.

export const consolidatedPosts = {
  // Enhanced vs standard title insurance
  "enhanced-title-insurance-vs-standard": "enhanced-vs-standard-title-insurance",
  "title-insurance-enhanced-vs-standard": "enhanced-vs-standard-title-insurance",
  "standard-vs-enhanced-title-insurance": "enhanced-vs-standard-title-insurance",
  "standard-vs-extended-title-insurance": "enhanced-vs-standard-title-insurance",
  "what-is-enhanced-title-insurance": "enhanced-vs-standard-title-insurance",

  // What lender's title insurance is
  "lenders-title-insurance": "lender-title-insurance",
  "what-is-lenders-title-insurance": "lender-title-insurance",

  // Lender's vs owner's policy
  "lenders-title-insurance-vs-owners-title-insurance": "difference-between-lenders-and-owners-title-insurance",
  "owners-policy-vs-lenders-policy": "difference-between-lenders-and-owners-title-insurance",

  // Owner's (homeowner) title insurance
  "homeowners-title-insurance": "homeowner-title-insurance",

  // Title insurance cost, general (the per-state posts stay)
  "how-much-does-title-insurance-cost": "title-insurance-cost-virginia-maryland",

  // Closing costs by state
  "closing-costs-in-virginia-2026": "closing-costs-virginia",
  "closing-costs-maryland-2026": "closing-costs-maryland",

  // Choosing a title company
  "how-to-choose-right-title-company-dmv": "how-to-choose-a-title-company-in-virginia-maryland-or-dc",
  "title-company-northern-virginia": "title-companies-in-northern-virginia",
  "best-title-company-maryland": "title-company-maryland",
};

export const canonicalOrigin = "https://dmvtitleguy.io";

export const redirectingHosts = [
  "www.dmvtitleguy.io",
  // The .io site is canonical. Send the legacy www.com host to the matching
  // .io path without ever moving a customer away from DMVTitleGuy.io.
  "www.dmvtitleguy.com",
];

// This is the single inventory for known path migrations. The Next config and
// the migration verifier both consume it so a new redirect cannot silently
// escape one-hop coverage.
export const legacyPathMappings = [
  ["/home", "/"],
  ["/looking-to-grow-your-business", "/title-company-for-realtors"],
  ["/what-does-a-title-company-do", "/blog/what-does-a-title-company-do"],
  // 2026-08-11: removed /blog/title-search-process-explained → what-does-a-title-company-do
  // That slug is now a live dedicated commercial post in Sanity (no longer a soft-404 map).
  ["/my-blog", "/blog"],
  ["/title-quote", "/calculators/title-quote"],
  ["/blog/alta-homeowner-policy-dmv", "/blog/alta-homeowner-policy"],
  ["/blog/lender-title-insurance-dmv", "/blog/lender-title-insurance"],
  ["/blog/who-does-title-insurance-protect-dmv", "/blog/who-does-title-insurance-protect"],
  ["/blog/sterling-virginia-settlement", "/blog/title-company-sterling-va"],
  ["/closing-costs/virginia", "/virginia-closing-cost-calculator"],
  // Keep the five pre-existing nested Northern Virginia landing pages live
  // and self-canonical while their Search Console measurement window is open.
  ["/title-company/silver-spring-md", "/title-company-silver-spring-md"],
  ["/title-company/vienna-va", "/title-search-vienna-va"],
  ["/title-company/mclean-va", "/title-company-mclean-va"],
  ["/title-company/rockville-md", "/title-company-rockville-md"],
  ["/title-company/bethesda-md", "/title-company-bethesda-md"],
  ["/blog/escrow-services-explained", "/blog/escrow-companies-near-me-dmv"],
  ["/blog/zillow-traffic-data-strategy-real-estate-agents", "/blog/using-zillow-traffic-data-to-close-more-deals"],
  ["/blog/title-insurance-vs-homeowners-insurance", "/blog/homeowners-insurance-vs-title-insurance"],
  ["/blog/title-insurance-commercial-real-estate", "/blog/commercial-real-estate-title-insurance"],
  ["/blog/extended-vs-standard-title-insurance", "/blog/enhanced-vs-standard-title-insurance"],
  ["/blog/title-insurance-requirements-dmv", "/blog/title-insurance-requirements-dc-md-va"],
  ["/blog/title-insurance-requirements-dmv-comparison", "/blog/title-insurance-requirements-dc-md-va"],
  ["/blog/choose-right-title-company-dmv", "/blog/how-to-choose-a-title-company-in-virginia-maryland-or-dc"],
  ["/blog/settlement-costs-buyers-sellers", "/blog/closing-costs-dmv-buyers-sellers"],
  ["/blog/understanding-closing-costs-dmv", "/blog/closing-costs-dmv-buyers-sellers"],
  ["/blog/understanding-title-commitments-agents", "/blog/how-to-read-a-title-commitment"],
  ["/blog/title-insurance-first-time-buyers-dmv", "/blog/first-time-homebuyer-guide-dmv"],
  ["/title-company/herndon", "/title-company-herndon-va"],
  ["/title-company/falls-church-va", "/title-company-falls-church-va"],
  ["/closing-cost-calculator-maryland", "/maryland-closing-cost-calculator"],
  ["/title-company-vienna-va", "/title-search-vienna-va"],
  ["/title-company-fairfax-va", "/title-search-fairfax-va"],
  ["/blog/title-settlement-fee", "/blog/what-is-a-title-settlement-fee"],
  ["/title-insurance-cost-virginia", "/blog/title-insurance-cost-virginia"],
  ["/closing-costs-maryland-2026", "/blog/closing-costs-maryland"],
  ["/title-and-settlement-services", "/why-choose-us"],
  ["/closing-costs-maryland", "/closing-costs/maryland"],
  ["/closing-costs-dc", "/closing-costs/dc"],
  ["/who-pays-closing-costs-in-virginia", "/blog/who-pays-closing-costs-in-virginia"],
  ["/closing-costs-in-virginia-2026", "/blog/closing-costs-virginia"],
  ["/title-company-maryland", "/closing-costs/maryland"],
  ["/what-is-lenders-title-insurance", "/blog/lender-title-insurance"],
  ["/lenders-title-insurance-vs-owners-title-insurance", "/blog/difference-between-lenders-and-owners-title-insurance"],
  ["/settlement-company-fairfax-county", "/blog/settlement-company-fairfax-county"],
  ["/blog/what-is-a-title-search", "/blog/title-search-vs-title-insurance"],
  ["/blog/what-is-title-insurance", "/title-insurance"],
  ["/blog/virginia-settlement-closing-process-explained", "/blog/what-happens-at-closing-real-estate"],
  // 2026-09-23: duplicate posts retired into the strongest post on the same
  // intent. The five entries above that used to land on a retired slug now
  // point at its keeper, so every redirect stays one hop.
  ...Object.entries(consolidatedPosts).map(([retired, keeper]) => [`/blog/${retired}`, `/blog/${keeper}`]),
];

// A destination that is itself redirected makes a two-hop chain. Fail the build
// instead of shipping one.
{
  const sources = new Set(legacyPathMappings.map(([source]) => source));
  const chained = legacyPathMappings.filter(([, destination]) => sources.has(destination));
  if (chained.length > 0) {
    throw new Error(`Redirect chain: ${chained.map(([s, d]) => `${s} -> ${d}`).join(", ")}`);
  }
}

export function slashForms(source) {
  return source === "/" ? [source] : [source, `${source}/`];
}
