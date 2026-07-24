import type { Metadata } from "next";
import { RezultatClient } from "./RezultatClient";

export const metadata: Metadata = {
  title: "Rezultatul plății",
  robots: { index: false, follow: false },
};

export default async function RezultatPage({
  searchParams,
}: {
  // NETOPIA adaugă singur `orderId` (cu „d" mic) la revenire, pe lângă parametrul
  // nostru `orderID`. Le acceptăm pe amândouă.
  searchParams: Promise<{ orderID?: string; orderId?: string }>;
}) {
  const sp = await searchParams;
  return <RezultatClient orderID={sp.orderID ?? sp.orderId ?? ""} />;
}
