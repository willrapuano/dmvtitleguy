import { MetadataRoute } from "next";
import { ALL_LOCATIONS, COUNTIES } from "@/data/locations";
import { BLOG_POSTS } from "@/data/blog";

const BASE_URL = "https://www.dmvtitleguy.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/investor-friendly-title-company`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/virginia-closing-cost-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/maryland-closing-cost-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/dc-closing-cost-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
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

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.dateISO),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...locationPages, ...countyPages, ...blogPages];
}
