import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", 
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1", 
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;