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
//   - config/domain-redirects.mjs issues a one-hop 301 from each retired slug;
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

export function consolidatedKeeper(slug) {
  return consolidatedPosts[slug];
}
