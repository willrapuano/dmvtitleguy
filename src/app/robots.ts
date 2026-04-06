import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/agent-tools/admin",
          "/agent-tools/contract-analyzer/history",
          "/agent-tools/contract-analyzer/pending",
          "/agent-tools/contract-analyzer/analysis/",
          "/agent-tools/contract-analyzer/login",
          "/api/",
        ],
      },
    ],
    sitemap: "https://www.dmvtitleguy.io/sitemap.xml",
  };
}
