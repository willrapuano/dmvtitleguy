// Closing-cost claims that are false, each checked against the primary source cited
// next to it. Shared by verify-tax-facts (coded pages in src/) and verify-cms-content
// (blog posts in Sanity), so a fact corrected in one place is guarded in both.

export const bannedClaims = [
  // Md. Tax-Property § 13-203(a): the state transfer tax is 0.5%; there is no 1.0% rate.
  { pattern: /1\.0% (?:for non-primary|if not primary|if buyer won't)/i, why: "Maryland has no 1.0% state transfer tax (Tax-Prop. § 13-203)" },
  // Md. Tax-Property § 12-103(b): each county sets the recordation rate; there is no state base.
  { pattern: /state recordation tax base|\$2\.50 per \$500/i, why: "Maryland has no statewide recordation tax rate (Tax-Prop. § 12-103)" },
  { pattern: /Maryland[^.\n]{0,40}\bstate recordation tax|State Recordation Tax:<\/strong> \$6\.60/i, unless: /\bno (?:separate )?state recordation tax/i, why: "Maryland has no state recordation tax (Tax-Prop. § 12-103); Virginia does, so this is Maryland-only" },
  // Md. Tax-Property §§ 12-103(a), 12-108(i); D.C. Code § 42-1103(a): recordation is on the deed's consideration.
  { pattern: /recordation tax \(based on loan amount\)/i, why: "MD/DC recordation tax is on the price, not the loan" },
  { pattern: /recordation tax is 0\.5% of the loan/i, why: "MD recordation tax is on the price, not the loan" },
  { pattern: /\$6\.60 per \$1,000|\$0\.005 per \$100|\$0\.0085 per \$100/, why: "not a Maryland or Montgomery County recordation rate" },
  // D.C. Code § 42-1103(e): first-time homebuyers get a reduced 0.725% rate, not an exemption.
  { pattern: /exempt from the recordation tax on properties up to|exempt buyers from recordation taxes/i, why: "DC first-time buyers get a reduced rate (§ 42-1103(e)), not an exemption" },
  // Prince George's County Code § 10-188(d)(1): purchase-money mortgages and deeds of trust are excluded.
  { pattern: /(?:also )?applies to mortgages and deeds of trust|deed of trust transfer tax on the loan/i, why: "PG transfer tax excludes purchase-money deeds of trust (PG Code § 10-188(d))" },
  // Frederick County imposes no county transfer tax.
  { pattern: /Frederick County is lower at 1\.0%/i, why: "Frederick has no county transfer tax" },
  // Va. Code § 58.1-802: grantor's tax is $0.50 per $500 ($0.10 per $100).
  { pattern: /grantor'?s? tax[^.\n]{0,40}\$0\.(?:25|50) per \$100/i, why: "Virginia grantor's tax is $0.10 per $100 (§ 58.1-802)" },
  // § 58.1-802.2 (a single $0.15 congestion fee) was repealed in 2018; §§ 58.1-802.3 and 802.4 are $0.10 each.
  { pattern: /congestion[^.\n]{0,40}\$0\.15|\$0\.15[^.\n]{0,40}congestion/i, why: "the $0.15 congestion fee was repealed; two $0.10 fees apply (§§ 58.1-802.3, 802.4)" },
  // §§ 58.1-814, 58.1-3800: Fairfax, Arlington, Loudoun, Prince William and Alexandria levy the local third.
  { pattern: /(?:does not add|no additional) (?:a )?local recordation tax/i, why: "NoVA localities levy the § 58.1-3800 local recordation tax" },
  // D.C. Code §§ 42-1103(a-4), 47-903(a-4): residential rates top out at 1.45% each.
  { pattern: /can exceed 2\.9%/i, why: "DC residential recordation + transfer tax is at most 2.9% combined" },
  // Va. Code § 38.2-4608(E) and the SCC Virginia Title Insurance Guide: each insurer files its own
  // rates and may negotiate them, and the SCC tells buyers to shop around. In MD and DC rates are
  // filed per underwriter, so premiums still differ between companies.
  { pattern: /(?:every|each|any) (?:licensed )?(?:title )?(?:company|agent|agency|insurer)[^.\n]{0,60}(?:charges?|pays?) (?:the )?(?:exact )?same (?:rate|premium)|same premium for the same|(?:cannot|can't|won't) (?:negotiate|shop)[^.\n]{0,40}premium|premiums?[^.\n]{0,40}\b(?:is|are) (?:not negotiable|the same across)|price is the price|rate is the rate|shopping around won't change|(?:rates?|premiums?)[^.\n]{0,20} (?:are|is) (?:set|fixed) by the (?:state|SCC|(?:Virginia )?State Corporation Commission)|identical down to the penny/i, why: "title premiums are not the same at every company: each insurer files its own rates, and Virginia lets them be negotiated (Va. Code § 38.2-4608)" },
  { pattern: /state-regulated (?:title insurance )?rates|rate-regulated by|(?:premiums?|rates?)[^.\n]{0,40}regulated by the Virginia Bureau|consistent pricing regardless|set by the DC Insurance Commissioner|rates are promulgated/i, why: "title rates are filed by each insurer, not set by the state; Virginia rates can be negotiated (Va. Code § 38.2-4608)" },
  // Maryland Insurance Administration, A Consumer Guide to Title Insurance: who pays "depends in part on
  // local custom" and can be negotiated with the seller. No DMV regulator says the seller customarily pays.
  { pattern: /(?:customary|custom is|tradition(?:al)?(?: Maryland)? custom is|standard Maryland custom)[^.\n]{0,40}seller[^.\n]{0,30}(?:pay|cover)[^.\n]{0,20}owner'?s|seller[^.\n]{0,40}(?:pay|cover)s?[^.\n]{0,30}owner'?s[^.\n]{0,60}(?:a common practice|customary|standard Maryland custom|by tradition)/i, why: "who pays the owner's policy follows local custom and the contract (MIA consumer guide; Virginia Bureau of Insurance); don't state a seller-pays custom" },
  // DC, like VA and MD, lets a title company's settlement agent or a notary conduct a residential
  // settlement (owner, 2026-10-16); no attorney requirement.
  { pattern: /DC (?:law )?requires (?:that )?(?:a licensed DC )?(?:an )?attorney|attorney must supervise|DC requires attorney involvement|District requires that certain closing functions/i, why: "DC doesn't require an attorney at closing; a settlement agent or notary can conduct it" },
  // Stewart's Maryland rate manual offers an upgrade from a standard to an enhanced owner's policy.
  { pattern: /cannot upgrade from standard to enhanced|can't upgrade from standard to enhanced/i, why: "Maryland rate manuals (Stewart, First National) allow a post-closing upgrade to the enhanced policy" },
];
