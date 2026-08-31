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
  // Consolidate the older nested location routes into the flat URLs that
  // already carry the strongest Search Console history and internal-link
  // equity. Keeping one URL per local intent prevents the two templates from
  // competing for the same query.
  ["/title-company/alexandria-va", "/title-company-alexandria-va"],
  ["/title-company/arlington-va", "/title-company-arlington-va"],
  ["/title-company/fairfax-va", "/title-search-fairfax-va"],
  ["/title-company/loudoun-county-va", "/title-company-loudoun-county-va"],
  ["/title-company/prince-william-county-va", "/title-company-prince-william-county-va"],
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
  ["/blog/choose-right-title-company-dmv", "/blog/how-to-choose-right-title-company-dmv"],
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
  ["/closing-costs-maryland-2026", "/blog/closing-costs-maryland-2026"],
  ["/title-and-settlement-services", "/why-choose-us"],
  ["/closing-costs-maryland", "/closing-costs/maryland"],
  ["/closing-costs-dc", "/closing-costs/dc"],
  ["/who-pays-closing-costs-in-virginia", "/blog/who-pays-closing-costs-in-virginia"],
  ["/closing-costs-in-virginia-2026", "/blog/closing-costs-in-virginia-2026"],
  ["/title-company-maryland", "/closing-costs/maryland"],
  ["/what-is-lenders-title-insurance", "/blog/what-is-lenders-title-insurance"],
  ["/lenders-title-insurance-vs-owners-title-insurance", "/blog/lenders-title-insurance-vs-owners-title-insurance"],
  ["/settlement-company-fairfax-county", "/blog/settlement-company-fairfax-county"],
  ["/blog/what-is-a-title-search", "/blog/title-search-vs-title-insurance"],
  ["/blog/what-is-title-insurance", "/title-insurance"],
  ["/blog/virginia-settlement-closing-process-explained", "/blog/what-happens-at-closing-real-estate"],
];

export function slashForms(source) {
  return source === "/" ? [source] : [source, `${source}/`];
}
