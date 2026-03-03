/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vercel-swag-store-api.vercel.app',
      },
    ],
  },
  cacheComponents: true,
  async headers() {
    return [
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Add more rules here if you want to cache other folders (e.g., /images)
    ];
  },
}

export default nextConfig