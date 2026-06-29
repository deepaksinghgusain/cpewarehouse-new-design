import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "srv1246425.hstgr.cloud",
        port: "3000",
        pathname: "/upload/**",
      },
      {
        protocol: "http",
        hostname: "srv1246425.hstgr.cloud",
        port: "3000",
        pathname: "/**",
      },
    ],
      dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
