import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // The Sanity Studio admin UI. It is a client component, so it cannot export
          // metadata to carry a noindex tag, and it was serving "index, follow" —
          // the only admin route on the site that was crawlable.
          "/studio",
          "/api/",
        ],
      },
    ],
    sitemap: "https://dmvtitleguy.io/sitemap.xml",
  };
}
