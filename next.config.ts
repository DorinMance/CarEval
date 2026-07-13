import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow local images with or without the cache-busting ?v= query
    // (Next.js 16 blocks query-string local images unless whitelisted).
    localPatterns: [
      { pathname: "/images/**", search: "" },
      { pathname: "/images/**", search: "?v=4" },
    ],
  },
};

export default nextConfig;
