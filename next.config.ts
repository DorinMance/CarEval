import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // firebase-admin (folosit doar în rutele API, server) nu trebuie bundle-uit de
  // Turbopack — are dependențe native/opționale (gRPC, OpenTelemetry) care pică
  // la bundling. Îl lăsăm încărcat ca modul Node normal la runtime.
  serverExternalPackages: ["firebase-admin"],
  images: {
    // Next.js 16: once localPatterns is set it becomes a whitelist for ALL local
    // images. Allow every local path without a query, plus the cache-busting ?v=4.
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/**", search: "?v=4" },
      { pathname: "/**", search: "?v=6" },
    ],
  },
};

export default nextConfig;
