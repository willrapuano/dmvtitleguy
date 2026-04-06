/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  images: {
    formats: ["image/webp"],
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
    ];
  },
};
export default nextConfig;
