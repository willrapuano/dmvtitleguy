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