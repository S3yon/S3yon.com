import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Toronto date of the build, so the first render of the feed matches on server and client.
  env: { NEXT_PUBLIC_BUILD_DAY: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' }) },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '/image/**',
      },
    ],
  },
};

export default nextConfig;
