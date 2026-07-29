/**
 * Per-post title overrides, shared by every surface that shows a post's name.
 *
 * These live outside the article route because the blog index and the related-post
 * cards render titles too. When only the article page honoured the override, a card
 * read "Title Company in Arlington, VA" and clicked through to a page headed "An
 * Arlington Closing Guide" — and the index kept repeating the exact phrase the
 * retitle exists to stop competing for, thirteen times on one page.
 */
/**
 * Per-post metadata overrides, which win over the Sanity title.
 *
 * `description` is optional because generateMetadata already falls back to the
 * post's own seo.description, then its excerpt, then its body — so an override
 * that only needs to fix a title should not have to invent a description.
 *
 * `h1` exists so a retitled post does not end up with a heading that disagrees
 * with its own tab and search result.
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
    h1: "Why DC Closings Differ From Virginia and Maryland",
  },
  "title-company-arlington-va": {
    // Body already has a "Why Arlington Closings Are Different" section head.
    title: "An Arlington Closing Guide | DMV Title Guy",
    h1: "An Arlington Closing Guide for Buyers and Sellers",
  },
  "title-company-alexandria-va": {
    title: "An Alexandria Closing Guide | DMV Title Guy",
    h1: "An Alexandria Closing Guide for Buyers and Sellers",
  },
  "title-company-mclean-va": {
    title: "Why McLean Closings Need Extra Expertise | DMV Title Guy",
    h1: "Why McLean Closings Need Extra Expertise",
  },
  "title-company-reston-va": {
    title: "Closing on a Home in Reston, VA | DMV Title Guy",
    h1: "Closing on a Home in Reston, VA",
  },
  "title-company-woodbridge-va": {
    title: "Closing in Prince William County: A Woodbridge Guide",
    h1: "Closing in Prince William County: A Woodbridge Guide",
  },
  "title-company-bethesda-md": {
    title: "A Bethesda Closing Guide | DMV Title Guy",
    h1: "A Bethesda Closing Guide for Buyers and Sellers",
  },
  "title-company-springfield-va": {
    title: "Closing in Fairfax County's Southern Corridor",
    h1: "Closing in Fairfax County's Southern Corridor",
  },
  "title-company-falls-church-va": {
    title: "A Closing Guide for Falls Church, VA | DMV Title Guy",
    h1: "A Closing Guide for Falls Church, VA",
  },
  "title-company-sterling-va": {
    title: "A Closing Guide for the Dulles Corridor | DMV Title Guy",
    h1: "A Closing Guide for the Dulles Corridor",
  },
  "title-company-fairfax-county-va": {
    title: "Closing in Fairfax County: What to Expect",
    h1: "Closing in Fairfax County: What to Expect",
  },
  "title-company-loudoun-county-va": {
    title: "Closing in Virginia's Fastest-Growing County",
    h1: "Closing in Virginia's Fastest-Growing County",
  },
  "title-company-montgomery-county-md": {
    title: "Settlement Services That Know Montgomery County",
    h1: "Settlement Services That Know Montgomery County",
  },
  "what-is-a-title-quote": {
    title: "What Is a Title Quote? A DMV Closing Guide | Pruitt Title",
    description:
      "Title quote guide for DMV buyers, sellers, and agents. Learn what a title quote includes and when to request one from Pruitt Title online today.",
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
