/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    instrumentationHook: true,
    serverComponentsExternalPackages: ["archiver"],
  },
  output:'standalone',
};

module.exports = nextConfig;