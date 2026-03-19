import { MetadataRoute } from "next";
import { ALL_LOCATIONS, COUNTIES } from "@/data/locations";
import { PUBLISHED_BLOG_POSTS } from "@/data/blog";
import { CITY_CALCULATOR_DATA } from "@/data/closingCostData";

const BASE_URL = "https://www.dmvtitleguy.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/title-insurance`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/why-choose-us`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/my-classes`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/subscribe`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/advertising-services`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/investor-friendly-title-company`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/virginia-closing-cost-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/maryland-closing-cost-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/dc-closing-cost-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/calculators`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/agent-tools`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/agent-tools/contract-analyzer`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/my-blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const locationPages: MetadataRoute.Sitemap = ALL_LOCATIONS.map((loc) => ({
    url: `${BASE_URL}/${loc.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: loc.tier === 1 ? 0.9 : 0.7,
  }));

  const countyPages: MetadataRoute.Sitemap = COUNTIES.map((county) => ({
    url: `${BASE_URL}/${county.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = PUBLISHED_BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.dateISO),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const cityCalcPages: MetadataRoute.Sitemap = CITY_CALCULATOR_DATA.map((city) => ({
    url: `${BASE_URL}/${city.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...locationPages, ...countyPages, ...cityCalcPages, ...blogPages];
}
