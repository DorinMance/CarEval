import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // firebase-admin (folosit doar în rutele API, server) nu trebuie bundle-uit de
  // Turbopack — are dependențe native/opționale (gRPC, OpenTelemetry) care pică
  // la bundling. Îl lăsăm încărcat ca modul Node normal la runtime.
  // nodemailer e la fel: pachet strict de server, cu module Node native (net,
  // tls, dns). Bundle-uit, Turbopack încearcă să-i rezolve dependențele
  // opționale și pică la build.
  serverExternalPackages: ["firebase-admin", "nodemailer"],
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
