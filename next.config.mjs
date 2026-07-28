import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.resolve(__dirname, "../.env") });

const canonicalUrl = "https://dmvtitleguy.io";

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_PAYPAL_CLIENT_ID:
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || process.env.PAYPAL_CLIENT_ID,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  images: {
    // Tried in order, so AVIF first and webp for anything that cannot take it.
    // AVIF runs ~20-30% smaller on these photographic post images; encoding is
    // slower but the optimizer caches each variant after the first request.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      // The /why-choose-us hero texture. Only needed while that image is
      // hotlinked rather than served from /public.
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.dmvtitleguy.io' }],
        destination: `${canonicalUrl}/:path*`,
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          { type: 'host', value: 'dmvtitleguy.io' },
          { type: 'header', key: 'x-forwarded-proto', value: 'http' },
        ],
        destination: `${canonicalUrl}/:path*`,
        permanent: true,
      },
      {
        source: '/what-does-a-title-company-do',
        destination: '/blog/what-does-a-title-company-do',
        permanent: true,
      },
      {
        source: '/my-blog',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/my-blog/:path*',
        destination: '/blog/:path*',
        permanent: true,
      },
      {
        source: '/title-quote',
        destination: '/calculators/title-quote',
        permanent: true,
      },
      {
        source: '/title-company/rockville-md',
        destination: '/title-company-rockville-md',
        statusCode: 301,
      },
      {
        source: '/title-company/bethesda-md',
        destination: '/title-company-bethesda-md',
        statusCode: 301,
      },
      {
        source: '/blog/escrow-services-explained',
        destination: '/blog/escrow-companies-near-me-dmv',
        permanent: true,
      },
      {
        source: '/blog/zillow-traffic-data-strategy-real-estate-agents',
        destination: '/blog/using-zillow-traffic-data-to-close-more-deals',
        permanent: true,
      },
      {
        source: '/blog/title-insurance-vs-homeowners-insurance',
        destination: '/blog/homeowners-insurance-vs-title-insurance',
        permanent: true,
      },
      {
        source: '/blog/title-insurance-commercial-real-estate',
        destination: '/blog/commercial-real-estate-title-insurance',
        permanent: true,
      },
      {
        source: '/blog/extended-vs-standard-title-insurance',
        destination: '/blog/enhanced-vs-standard-title-insurance',
        permanent: true,
      },
      {
        source: '/blog/title-insurance-requirements-dmv',
        destination: '/blog/title-insurance-requirements-dc-md-va',
        permanent: true,
      },
      {
        source: '/blog/title-insurance-requirements-dmv-comparison',
        destination: '/blog/title-insurance-requirements-dc-md-va',
        permanent: true,
      },
      {
        source: '/blog/choose-right-title-company-dmv',
        destination: '/blog/how-to-choose-right-title-company-dmv',
        permanent: true,
      },
      {
        source: '/blog/settlement-costs-buyers-sellers',
        destination: '/blog/closing-costs-dmv-buyers-sellers',
        permanent: true,
      },
      {
        source: '/blog/understanding-closing-costs-dmv',
        destination: '/blog/closing-costs-dmv-buyers-sellers',
        permanent: true,
      },
      {
        source: '/blog/understanding-title-commitments-agents',
        destination: '/blog/how-to-read-a-title-commitment',
        permanent: true,
      },
      {
        source: '/blog/title-insurance-first-time-buyers-dmv',
        destination: '/blog/first-time-homebuyer-guide-dmv',
        permanent: true,
      },
      {
        source: '/title-company/herndon',
        destination: '/title-company-herndon-va',
        permanent: true,
      },
      {
        source: '/closing-cost-calculator-maryland',
        destination: '/maryland-closing-cost-calculator',
        permanent: true,
      },
      {
        source: '/title-company-vienna-va',
        destination: '/title-search-vienna-va',
        permanent: true,
      },
      {
        source: '/title-company-fairfax-va',
        destination: '/title-search-fairfax-va',
        permanent: true,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
export default nextConfig;
