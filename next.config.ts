import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent the root Next.js compiler from scanning the frontend/ sub-project.
  // frontend/ is a separate standalone Next.js app with its own tsconfig and @/* alias.
  outputFileTracingExcludes: {
    "*": ["./frontend/**/*"],
  },
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
