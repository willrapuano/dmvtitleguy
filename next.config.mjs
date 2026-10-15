import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  canonicalOrigin,
  legacyPathMappings,
  redirectingHosts,
  slashForms,
} from "./config/domain-redirects.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.resolve(__dirname, "../.env") });

function redirectRule(source, destination, host) {
  return {
    source,
    ...(host ? { has: [{ type: "host", value: host }] } : {}),
    destination,
    permanent: true,
  };
}

function knownPathRedirects(host) {
  return legacyPathMappings.flatMap(([source, destination]) =>
    slashForms(source).map((form) =>
      redirectRule(form, host ? `${canonicalOrigin}${destination}` : destination, host)
    )
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  skipTrailingSlashRedirect: true,
  poweredByHeader: false,
  turbopack: { root: __dirname },
  env: {
    NEXT_PUBLIC_PAYPAL_CLIENT_ID:
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || process.env.PAYPAL_CLIENT_ID,
  },
  experimental: {
    serverActions: { bodySizeLimit: "20mb" },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    // Baseline security headers (SEOmator audit 2026-10-15). Framing is denied
    // everywhere except /embed/*, whose calculators are meant to run inside
    // partner sites' iframes.
    const common = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    ];
    return [
      { source: "/:path*", headers: common },
      {
        source: "/((?!embed(?:/|$)).*)",
        headers: [{ key: "X-Frame-Options", value: "SAMEORIGIN" }],
      },
    ];
  },
  async redirects() {
    return [
      // Known legacy paths must precede the host catch-all so every old-host
      // request reaches its final .io destination in exactly one hop.
      ...redirectingHosts.flatMap((host) => knownPathRedirects(host)),
      ...redirectingHosts.map((host) =>
        redirectRule(
          "/my-blog/:path+",
          `${canonicalOrigin}/blog/:path+`,
          host
        )
      ),
      ...redirectingHosts.map((host) =>
        redirectRule("/:path*", `${canonicalOrigin}/:path*`, host)
      ),
      ...knownPathRedirects(),
      {
        source: "/my-blog/:path+",
        destination: "/blog/:path+",
        permanent: true,
      },
      {
        source: "/:path+/",
        destination: "/:path+",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
