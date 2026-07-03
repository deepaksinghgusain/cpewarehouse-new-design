import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.cpewarehouse.us",
        pathname: "/upload/**",
      },
      {
        protocol: "https",
        hostname: "admin.cpewarehouse.us",
        pathname: "/**",
      },
    ],
      dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
