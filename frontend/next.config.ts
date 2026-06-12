import "dotenv/config";
import type { NextConfig } from "next";

console.log("[Next.js config] Loading configuration. process.env.BACKEND_ORIGIN is:", process.env.BACKEND_ORIGIN);
const backendOrigin = (process.env.BACKEND_ORIGIN || "http://localhost:5000").replace(/\/$/, "");
console.log("[Next.js config] Directing API rewrites to backend origin:", backendOrigin);

const nextConfig: NextConfig = {
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
