import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.cpewarehouse.com",
        pathname: "/upload/**",
      },
      {
        protocol: "https",
        hostname: "admin.cpewarehouse.com",
        pathname: "/**",
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
