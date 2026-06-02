/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async redirects() {
    return [
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
