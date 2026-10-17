/**
 * Per-post title and metadata overrides, shared by every surface that shows a
 * post's name — the index cards, the related-post cards, the article h1 and the
 * metadata. When only the article page honoured these, a card read "Title Company
 * in Arlington, VA" and clicked through to a page headed "An Arlington Closing
 * Guide", and the index kept repeating the exact phrase the retitle exists to stop
 * competing for, thirteen times on one page.
 *
 * These win over the Sanity title.
 *
 * `description` is optional because generateMetadata already falls back to the
 * post's own seo.description, then its excerpt, then its body — so an override
 * that only needs to fix a title should not have to invent a description.
 *
 * `h1` exists so a retitled post does not end up with a heading that disagrees
 * with its own tab and search result. It is now needed only where the CMS title is
 * still the wrong heading: the fifteen retitled posts had their Sanity `title` set to
 * the value this file used to override, so `postDisplayTitle` reaches the same string
 * through its CMS fallback and the override would be a duplicate. Studio and the site
 * now show the same heading, which they did not before.
 *
 * `title` overrides are NOT redundant and all remain — a search-result title carries
 * the brand suffix and often a different phrasing than the on-page heading.
 *
 * If you retitle a post in Studio, that is now the heading the site uses. Add an `h1`
 * entry here only to deliberately override it.
 */
export const BLOG_SEO_OVERRIDES: Record<
  string,
  { title: string; description?: string; canonical?: string; h1?: string }
> = {
  // ── 2026-09-30 CTR decision (fixed pre/post windows in docs/seo-checkpoint-operations-2026-08-26.md).
  // Pages already ranking near page one whose result showed a truncated title or a
  // raw first-paragraph description. Titles use the searchers' own wording.
  "what-is-a-deed-transfer": {
    title: "What Is a Deed Transfer? How It Works in VA, MD & DC",
    description:
      "What a deed transfer is, how the deed moves from seller to buyer at closing, how it differs from a title transfer, and what can go wrong along the way.",
  },
  "title-search-refinance": {
    title: "Do You Need a New Title Search to Refinance? | DMV Title Guy",
    description:
      "Why lenders require a new title search for a refinance in DC, Maryland, and Virginia, what the search checks, what it costs, and when the reissue rate saves you money.",
  },
  "virginia-real-estate-contract": {
    title: "Virginia Real Estate Contract: How the NVAR Form Works",
    description:
      "How the standard Northern Virginia purchase contract works, which deadlines matter most, and the four clauses agents most often miss before settlement.",
  },
  "refinance-title-insurance": {
    title: "Refinance Title Insurance: Cost and the Reissue Rate",
  },
  "types-of-property-surveys-dc-md-va": {
    title: "Title Survey vs Boundary Survey: DMV Property Survey Guide",
  },
  "firpta-explained-dmv": {
    title: "FIRPTA Withholding: A DMV Buyer, Seller & Agent Guide",
    description:
      "FIRPTA withholding explained for DC, Maryland, and Virginia closings: buyer responsibility, 15% and residence rules, certificates, forms, and early review steps.",
  },
  "title-search-process-explained": {
    title: "What Does a Title Company Do? | DMV Title Guy",
    canonical: "/blog/what-does-a-title-company-do",
  },
  /**
   * These thirteen slugs also exist as location landing pages, and every one of
   * them opened with "Title Company in <place>" — the exact phrase the landing
   * page targets, so the two competed for one intent. The landing page keeps the
   * commercial phrase; each article leads with its own angle instead, taken from
   * its own H2s. Place names are retained so the articles still rank for their
   * informational long-tail.
   */
  "title-company-washington-dc": {
    title: "Why DC Closings Differ From VA and MD | DMV Title Guy",
  },
  "title-company-arlington-va": {
    // Body already has a "Why Arlington Closings Are Different" section head.
    title: "An Arlington Closing Guide | DMV Title Guy",
  },
  "title-company-alexandria-va": {
    title: "An Alexandria Closing Guide | DMV Title Guy",
  },
  "title-company-mclean-va": {
    title: "Why McLean Closings Need Extra Expertise | DMV Title Guy",
  },
  "title-company-reston-va": {
    title: "Closing on a Home in Reston, VA | DMV Title Guy",
  },
  "title-company-woodbridge-va": {
    title: "Closing in Prince William County: A Woodbridge Guide",
  },
  "title-company-bethesda-md": {
    title: "A Bethesda Closing Guide | DMV Title Guy",
  },
  "title-company-springfield-va": {
    title: "Closing in Fairfax County's Southern Corridor",
  },
  "title-company-falls-church-va": {
    title: "A Closing Guide for Falls Church, VA | DMV Title Guy",
  },
  "title-company-sterling-va": {
    title: "A Closing Guide for the Dulles Corridor | DMV Title Guy",
  },
  "title-company-fairfax-county-va": {
    title: "Closing in Fairfax County: What to Expect",
  },
  "title-company-loudoun-county-va": {
    title: "Closing in Virginia's Fastest-Growing County",
  },
  "title-company-montgomery-county-md": {
    title: "Settlement Services That Know Montgomery County",
  },
  /**
   * Neither of these collides with a location slug, so neither was in the thirteen
   * above — but both target a phrase a landing page owns, which is the criterion
   * that actually matters. /title-search-fairfax-va and /title-company-sterling-va
   * both exist and both target "Title Company in <place>" (before 2026-10-17, "Title & Closing Services in <place>").
   *
   * The second Sterling post, sterling-virginia-settlement, is gone: its title was
   * identical to this one's, so retitling only one of them achieved nothing. Its
   * unique content — a settlement explainer, a cost breakdown and five practical
   * Q&As — was merged into title-company-sterling-va's FAQ, the document was
   * unpublished, and /blog/sterling-virginia-settlement now 301s to the guide.
   * (It was 422 words of body text, not the ~4,000 an earlier note here claimed;
   * that figure counted page chrome.)
   */
  "title-company-fairfax-va": {
    title: "A Fairfax County Closing Guide | DMV Title Guy",
  },
  "what-is-a-title-quote": {
    title: "What Is a Title Quote? DMV Closing Guide | Free Quote | Pruitt Title",
    description:
      "What a title quote includes for DMV buyers, sellers, and agents — fees, insurance, and timing. Request a free Pruitt Title quote online before you schedule closing.",
  },
  "what-is-a-title-settlement-fee": {
    title: "What Is a Title Settlement Fee? What It Covers in VA, MD & DC",
    description:
      "Learn what a title settlement fee covers, how it differs from title insurance, and where it appears on mortgage disclosures. Fees vary; request an itemized quote.",
    h1: "What Is a Title Settlement Fee?",
  },
  "title-settlement-fee": {
    title: "What Is a Title Settlement Fee? What It Covers in VA, MD & DC",
    canonical: "/blog/what-is-a-title-settlement-fee",
  },
  "enhanced-vs-standard-title-insurance": {
    title: "Enhanced vs Standard Title Insurance: Which Policy Do You Actually Need?",
    description:
      "Enhanced title insurance costs about 20% more than standard. What it adds, published VA, MD and DC premiums, and when the upgrade is worth it.",
  },
  "who-chooses-the-title-company-in-virginia": {
    title: "Who Chooses the Title Company in Virginia? Here's the No-BS Answer.",
    description:
      "Virginia buyers choose the settlement agent, and a seller can't make one a condition of the sale. What agents should know and how to guide clients.",
  },
  "dc-first-time-homebuyer-tax-exemption": {
    title: "DC First-Time Homebuyer Recordation Tax: The 0.725% Rate and Who Qualifies",
    description:
      "DC first-time buyers pay a 0.725% recordation rate instead of 1.1% or 1.45%. Who qualifies, what it saves, and the separate lower-income exemption.",
  },
  "who-pays-closing-costs-maryland": {
    title: "Who Pays Closing Costs in Maryland? Buyer vs Seller Customs Explained",
    description:
      "Who pays what at a Maryland closing: transfer and recordation taxes, title insurance and settlement fees, and what the contract can change.",
  },
  "understanding-subject-to-transactions": {
    title: "Understanding Subject-To Transactions: What Buyers and Sellers Should Know",
    description:
      "How subject-to deals work, where the risks are for buyers and sellers, and what to check before you sign a subject-to agreement.",
  },
  "mechanic-lien-agent-virginia": {
    title: "Mechanic's Lien Agent in Virginia: What Builders and Lenders Must Know Before Breaking Ground",
    description:
      "Virginia's mechanic's lien agent rules for builders, lenders and buyers: who names the agent, lien notices, and what title insurance needs at closing.",
  },
  "title-insurance-fsbo-northern-virginia": {
    title: "Title Insurance for FSBO Buyers in Northern Virginia: What Happens With No Agent",
    description:
      "Buying directly from the owner in Northern Virginia? You choose the settlement agent, even if the FSBO contract doesn't say so. What to order, and when.",
  },
  "title-company-military-relocation-northern-virginia": {
    title: "Title Company for Military and Out-of-State Relocation to Northern Virginia",
    description:
      "Moving to Northern Virginia on PCS orders or from out of state? You can close without being here and you choose the settlement agent. What to line up first.",
  },
  "closing-costs-dc": {
    title: "Closing Costs in DC: What Buyers and Sellers Pay in the District",
    description:
      "What buyers and sellers pay at a DC closing: recordation and transfer tax rates, the 0.725% first-time buyer rate and a $700,000 sample breakdown.",
  },
  "title-insurance-requirements-dc-md-va": {
    title: "Title Insurance Requirements in DC, Maryland, and Virginia: A Comparison",
    description:
      "Is title insurance required in DC, Maryland and Virginia? A side-by-side look at lender's and owner's policies, who chooses the company and typical costs.",
  },
  "builders-preferred-title-company": {
    title: "Do You Have to Use the Builder's Title Company? RESPA Rights for DMV Homebuyers",
    description:
      "Do you have to use the builder's title company on a new home in the DMV? RESPA bars a seller from requiring one. Know your rights before you sign.",
  },
  "title-insurance-new-construction": {
    title: "Title Insurance for New Construction: What Buyers of New Builds Actually Pay For",
    description:
      "Title insurance on a new build: what the owner's policy covers, why mechanic's liens matter, and what buyers pay in Virginia, Maryland and DC.",
  },
  "title-insurance-claims-process": {
    title: "Understanding the Title Insurance Claims Process",
    description:
      "How a title insurance claim works: what's covered, how to file, and what the insurer does next. A plain-English guide for DMV homeowners.",
  },
  "title-and-settlement-services": {
    title: "Title and Settlement Services: What You Should Expect From Your Closing Team",
    description:
      "What title and settlement services cover, what your closing team protects you from, and how to choose one in DC, Maryland or Virginia.",
  },
  // 2026-10-17: search titles Google was truncating (over 60 characters); the
  // on-page heading keeps the CMS title.
  "settlement-company-fairfax-county": {
    title: "Choosing a Settlement Company in Fairfax County, VA",
  },
  "maryland-real-estate-contract": {
    title: "Maryland Residential Contract of Sale: How It Works",
  },
  "dc-real-estate-purchase-contract": {
    title: "DC Purchase Agreement: How a Home Purchase Contract Works",
  },
  "maryland-first-time-homebuyer-transfer-tax-exemption": {
    title: "Maryland First-Time Homebuyer Transfer Tax Exemption",
  },
  "title-companies-near-me": {
    title: "Title Companies Near Me: Choosing One in the DMV",
  },
  // 2026-10-16 consolidation: these duplicates 301 to the survivor (config/domain-redirects.mjs);
  // the canonical keeps them out of the sitemap and blog index.
  "enhanced-title-insurance-vs-standard": {
    title: "Enhanced vs Standard Title Insurance: Which Policy Do You Actually Need?",
    canonical: "/blog/enhanced-vs-standard-title-insurance",
  },
  "standard-vs-enhanced-title-insurance": {
    title: "Enhanced vs Standard Title Insurance: Which Policy Do You Actually Need?",
    canonical: "/blog/enhanced-vs-standard-title-insurance",
  },
  "standard-vs-extended-title-insurance": {
    title: "Enhanced vs Standard Title Insurance: Which Policy Do You Actually Need?",
    canonical: "/blog/enhanced-vs-standard-title-insurance",
  },
  "title-insurance-enhanced-vs-standard": {
    title: "Enhanced vs Standard Title Insurance: Which Policy Do You Actually Need?",
    canonical: "/blog/enhanced-vs-standard-title-insurance",
  },
  "what-is-enhanced-title-insurance": {
    title: "Enhanced vs Standard Title Insurance: Which Policy Do You Actually Need?",
    canonical: "/blog/enhanced-vs-standard-title-insurance",
  },
  "alta-homeowner-policy": {
    title: "Enhanced vs Standard Title Insurance: Which Policy Do You Actually Need?",
    canonical: "/blog/enhanced-vs-standard-title-insurance",
  },
  "lenders-title-insurance-vs-owners-title-insurance": {
    title: "Lender's vs Owner's Title Insurance: What's the Difference and Do You Need Both?",
    canonical: "/blog/difference-between-lenders-and-owners-title-insurance",
  },
  "owners-policy-vs-lenders-policy": {
    title: "Lender's vs Owner's Title Insurance: What's the Difference and Do You Need Both?",
    canonical: "/blog/difference-between-lenders-and-owners-title-insurance",
  },
  "lenders-title-insurance": {
    title: "Lender Title Insurance: What It Is, What It Costs, and Why Your Bank Requires It",
    canonical: "/blog/lender-title-insurance",
  },
  "what-is-lenders-title-insurance": {
    title: "Lender Title Insurance: What It Is, What It Costs, and Why Your Bank Requires It",
    canonical: "/blog/lender-title-insurance",
  },
  "homeowners-title-insurance": {
    title: "Homeowner Title Insurance: What It Covers and Why Many DMV Owners Keep It Too Low on the Priority List",
    canonical: "/blog/homeowner-title-insurance",
  },
  "settlement-closing-fee": {
    title: "What Is a Title Settlement Fee? What It Covers in VA, MD & DC",
    canonical: "/blog/what-is-a-title-settlement-fee",
  },
  "title-company-vienna-va": {
    title: "Vienna VA Title Closings: How Closings Work | Pruitt Title",
    description:
      "Vienna title company guide explaining how closings work locally, with Pruitt Title insights from 17+ years serving Fairfax County. Call today.",
    canonical: "/title-search-vienna-va",
    // Without an h1 the heading fell back to the brand-stripped CMS title, "Title
    // Company in Vienna, VA" — the landing page's phrase, on a post already
    // canonicalised to it. Avoids the body's "Why Vienna Real Estate Closings Are
    // Different" section head.
  },
  "construction-loans-maryland": {
    title: "Construction Loans in Maryland: Title Review | Pruitt Title",
    description:
      "Construction loans Maryland guide for title, draw, and closing issues. Pruitt Title helps builders and buyers review title early. Call today.",
  },
  "settlement-services-arlington-va": {
    title: "Settlement Services in Arlington, VA: A Guide | Pruitt Title",
    description:
      "Arlington settlement services guide for residential closings, title work, and escrow. Pruitt Title helps DMV deals close cleanly. Call today.",
  },
  "title-insurance-cost-virginia-maryland": {
    // 2026-10-16: the single answer for "how much is title insurance"; the
    // how-much-does-title-insurance-cost duplicate now 301s here.
    title: "How Much Is Title Insurance? VA, MD & DC Costs (2026 Guide)",
    description:
      "What buyers pay for title insurance in Virginia, Maryland and DC, with real published premiums, simultaneous-issue rates and how to compare quotes.",
  },
  "how-much-does-title-insurance-cost": {
    title: "How Much Is Title Insurance? VA, MD & DC Costs (2026 Guide)",
    canonical: "/blog/title-insurance-cost-virginia-maryland",
  },
  "title-insurance-cost-virginia": {
    // 2026-10-16: targets "title insurance in Virginia", which was landing on
    // who-chooses-the-title-company-in-virginia at ~#20.
    title: "Title Insurance in Virginia: What It Costs in 2026",
    description:
      "What title insurance costs in Virginia: Stewart Title's published premiums from $400K to $1M, the $200 lender's policy, and how to compare quotes.",
    h1: "Title Insurance in Virginia: What It Costs in 2026",
  },
};

/**
 * Brand suffixes that belong in a <title> but not in a heading. Eleven posts have
 * one baked into the CMS title, so cards and h1s rendered "Title Company in
 * Sterling, VA | Pruitt Title & DMV Title Guy" as visible copy.
 */
const BRAND_SUFFIX = /\s*\|\s*(Pruitt Title(\s*&\s*DMV Title Guy)?|DMV Title Guy)\s*$/i;

/** The name a post goes by on screen, falling back to whatever the CMS holds. */
export function postDisplayTitle(slug: string, cmsTitle: string): string {
  const override = BLOG_SEO_OVERRIDES[slug]?.h1;
  if (override) return override;
  // Only a recognised brand tail is stripped — a title may legitimately contain a pipe.
  return cmsTitle.replace(BRAND_SUFFIX, "").trim() || cmsTitle;
}

/** Canonical route shared by article metadata and the sitemap. */
export function postCanonicalPath(slug: string): string {
  return BLOG_SEO_OVERRIDES[slug]?.canonical || `/blog/${slug}`;
}
