import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next.js 16: once localPatterns is set it becomes a whitelist for ALL local
    // images. Allow every local path without a query, plus the cache-busting ?v=4.
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/**", search: "?v=4" },
    ],
  },
};

export default nextConfig;
