export const canonicalOrigin = "https://dmvtitleguy.io";

export const redirectingHosts = [
  "www.dmvtitleguy.io",
];

// This is the single inventory for known path migrations. The Next config and
// the migration verifier both consume it so a new redirect cannot silently
// escape one-hop coverage.
export const legacyPathMappings = [
  ["/home", "/"],
  ["/looking-to-grow-your-business", "/title-company-for-realtors"],
  ["/what-does-a-title-company-do", "/blog/what-does-a-title-company-do"],
  ["/blog/title-search-process-explained", "/blog/what-does-a-title-company-do"],
  ["/my-blog", "/blog"],
  ["/title-quote", "/calculators/title-quote"],
  ["/blog/alta-homeowner-policy-dmv", "/blog/alta-homeowner-policy"],
  ["/blog/lender-title-insurance-dmv", "/blog/lender-title-insurance"],
  ["/blog/who-does-title-insurance-protect-dmv", "/blog/who-does-title-insurance-protect"],
  ["/blog/sterling-virginia-settlement", "/blog/title-company-sterling-va"],
  ["/closing-costs/virginia", "/virginia-closing-cost-calculator"],
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
  ["/closing-cost-calculator-maryland", "/maryland-closing-cost-calculator"],
  ["/title-company-vienna-va", "/title-search-vienna-va"],
  ["/title-company-fairfax-va", "/title-search-fairfax-va"],
  ["/title-company/falls-church-va", "/title-company-falls-church-va"],
  ["/title-company/silver-spring-md", "/title-company-silver-spring-md"],
  ["/blog/title-settlement-fee", "/blog/what-is-a-title-settlement-fee"],
];

export function slashForms(source) {
  return source === "/" ? [source] : [source, `${source}/`];
}
