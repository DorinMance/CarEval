import type { Metadata } from "next";
import { CosClient } from "./CosClient";

// Pagină tranzacțională: nu are ce căuta în index, dar linkurile din ea se urmăresc.
export const metadata: Metadata = {
  title: "Coșul tău",
  robots: { index: false, follow: true },
};

export default function CosPage() {
  return <CosClient />;
}
