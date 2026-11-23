// Next.js config: forwards browser calls to the backend API so we avoid CORS.
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Any request the browser makes to /api/* is secretly forwarded by the
  // Next.js server to the real backend. The browser never talks to the
  // backend directly, so the browser's CORS rules never get in the way.
  async rewrites() {
    const apiUrl = process.env.API_URL || "http://localhost:5000";
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
