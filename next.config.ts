import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Backend accessible via IP privée en dev (LAN) — désactivé par défaut par Next.js (protection SSRF)
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.226',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'staging-backend-api-591180749674.europe-west1.run.app',
        pathname: '/**',
      },
    ],
  },
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;