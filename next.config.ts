import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "saifuliqbal.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
