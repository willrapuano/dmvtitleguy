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
   * both exist and both target "Title & Closing Services in <place>".
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
    title: "What Is a Title Settlement Fee? A DMV Guide | Pruitt Title",
    description:
      "Title settlement fee guide for DMV buyers and sellers. Learn what the fee covers, what is fair locally, and when to request a Pruitt quote today.",
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
    title: "Title Insurance Cost in Virginia & Maryland (2026 Buyer Guide)",
    description:
      "What buyers actually pay for title insurance in VA and MD: owner vs lender policies, rate basics, and how to compare closing numbers. Free Pruitt Title quote online.",
  },
  "how-much-does-title-insurance-cost": {
    title: "How Much Does Title Insurance Cost? VA/MD/DC Breakdown",
    description:
      "Title insurance cost explained before you sign the Closing Disclosure. What drives the premium in VA, MD, and DC — and how to request a clear Pruitt Title quote today.",
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
