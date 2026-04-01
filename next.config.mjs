/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  async redirects() {
    return [
      {
        source: '/what-does-a-title-company-do',
        destination: '/what-does-a-title-company-do-dmv',
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
