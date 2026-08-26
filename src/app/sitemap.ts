import { MetadataRoute } from "next";
import { ALL_LOCATIONS, COUNTIES } from "@/data/locations";
import { blogPostModifiedDateISO } from "@/data/blog";
import { CITY_CALCULATOR_DATA } from "@/data/closingCostData";
import { fetchAllBlogPosts } from "@/lib/blog-data";
import { postCanonicalPath } from "@/lib/post-titles";

const BASE_URL = "https://dmvtitleguy.io";

// A CMS outage during revalidation keeps the previous complete sitemap rather
// than publishing a partial inventory that drops Sanity-backed articles.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /**
   * Hand-listed routes, by priority band. Everything else comes from the generated
   * groups below.
   *
   * Three classes of entry were removed rather than moved:
   *  - /title-search-vienna-va and /title-search-fairfax-va, which ALL_LOCATIONS
   *    already supplies — they were emitted twice.
   *  - /privacy-policy and /terms, which serve `noindex`. Listing a noindex page in a
   *    sitemap asks Google to crawl something it is told not to index.
   *  - /agent-tools/contract-analyzer, which 307s to a login wall.
   *
   * 35 routes that return 200 were absent entirely: every /calculators/* tool, the
   * /closing-costs/* guides, the /title-company/* hubs, the audience pages and
   * several service pages. They are added below.
   */
  const entry = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: path === "/" ? BASE_URL : `${BASE_URL}${path}`,
    changeFrequency,
    priority,
  });

  const staticPages: MetadataRoute.Sitemap = [
    entry("/", 1.0, "weekly"),

    // State calculators and core service pages
    ...["/virginia-closing-cost-calculator", "/maryland-closing-cost-calculator", "/dc-closing-cost-calculator",
      "/investor-title-services", "/auction-property-title-search", "/foreclosure-title-review",
      "/commercial-due-diligence", "/commercial-property-title-search", "/commercial-real-estate-closings",
      "/investor-due-diligence"].map((p) => entry(p, 0.9)),

    // Hubs, guides and audience pages
    ...["/title-insurance", "/about-will-rapuano", "/why-choose-us", "/investor-friendly-title-company", "/calculators",
      // /request-title-review and /upload-contract are deliberately absent: both
      // serve "noindex, follow" as conversion endpoints, not landing pages.
      "/agent-tools", "/contact",
      "/title-insurance-cost-by-state",
      "/title-company-for-builders", "/title-company-for-credit-unions",
      "/title-company-for-lenders", "/title-company-for-realtors",
      "/closing-costs/maryland", "/closing-costs/dc", "/closing-costs/dc-who-pays",
      "/closing-costs/buyer-maryland", "/closing-costs/seller-virginia",
      "/title-company/alexandria-va", "/title-company/arlington-va", "/title-company/fairfax-va",
      "/title-company/falls-church-va", "/title-company/loudoun-county-va",
      "/title-company/prince-william-county-va", "/title-company/silver-spring-md"].map((p) => entry(p, 0.8)),

    entry("/blog", 0.8, "weekly"),

    // Individual calculator tools
    ...["/calculators/amortization", "/calculators/buy-now-or-later", "/calculators/compensation",
      "/calculators/extra-payment", "/calculators/flip", "/calculators/home-equity",
      "/calculators/loan-estimate", "/calculators/monthly-affordability", "/calculators/rent-vs-buy",
      "/calculators/seller-net-sheet", "/calculators/smart-compare", "/calculators/title-quote"]
      .map((p) => entry(p, 0.7)),

    ...["/my-classes", "/advertising-services"].map((p) => entry(p, 0.7)),
    entry("/subscribe", 0.6),
  ];

  const locationPages: MetadataRoute.Sitemap = ALL_LOCATIONS
    .filter((loc) => !['title-company-vienna-va', 'title-company-fairfax-va'].includes(loc.slug))
    .map((loc) => ({
      url: `${BASE_URL}/${loc.slug}`,
      changeFrequency: "monthly" as const,
      priority: loc.tier === 1 ? 0.9 : 0.7,
    }));

  const countyPages: MetadataRoute.Sitemap = COUNTIES.map((county) => ({
    url: `${BASE_URL}/${county.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const publishedPosts = await fetchAllBlogPosts();
  const blogPages: MetadataRoute.Sitemap = publishedPosts.map((post) => {
    const modifiedAt = new Date(blogPostModifiedDateISO(post));
    const hasValidModifiedAt = !Number.isNaN(modifiedAt.getTime());

    return {
      url: `${BASE_URL}${postCanonicalPath(post.slug)}`,
      ...(hasValidModifiedAt ? { lastModified: modifiedAt } : {}),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    };
  });

  const cityCalcPages: MetadataRoute.Sitemap = CITY_CALCULATOR_DATA.map((city) => ({
    url: `${BASE_URL}/${city.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const pages = [...staticPages, ...locationPages, ...countyPages, ...cityCalcPages, ...blogPages];
  return Array.from(new Map(pages.map((page) => [page.url, page])).values());
}
