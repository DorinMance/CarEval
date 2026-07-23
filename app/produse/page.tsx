import type { Metadata } from "next";
import { ProduseClient } from "./ProduseClient";

export const metadata: Metadata = {
  title: "Servicii și tarife",
  description:
    "Evaluări auto și expertize după accident: prejudiciu, costuri reparație, devalorizare, epavă, contraexpertiză. Raport autorizat în 24–48h.",
  alternates: { canonical: "/produse" },
};

export default function ProdusePage() {
  return <ProduseClient />;
}
