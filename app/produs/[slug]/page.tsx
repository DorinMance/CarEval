import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, COMPANY, formatPrice } from "@/lib/products";
import { ProductPageClient } from "./ProductPageClient";

type Props = { params: Promise<{ slug: string }> };

/** Cele 8 servicii sunt prerandate la build → CDN static, nu funcție la fiecare cerere. */
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  if (!p) return { title: "Serviciu inexistent", robots: { index: false, follow: false } };

  return {
    title: p.name,
    description: `${p.tagline} ${formatPrice(p)}. Raport semnat de expert tehnic judiciar autorizat, livrat în ${p.delivery}. ${COMPANY.name}.`.slice(0, 320),
    alternates: { canonical: `/produs/${p.slug}` },
    // `openGraph` NU se merge-uiește cu cel din layout: dacă declari obiectul, îl
    // înlocuiești complet. De aceea type/siteName/locale se repetă explicit aici.
    openGraph: {
      type: "website",
      locale: "ro_RO",
      siteName: COMPANY.name,
      title: `${p.name} · ${COMPANY.name}`,
      description: p.tagline,
      url: `/produs/${p.slug}`,
      // Imaginile de produs sunt 1024×1024 (verificat), nu 1200×1200.
      images: [{ url: p.image, width: 1024, height: 1024, alt: p.name }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  // 404 real (nu soft-404 cu status 200) pentru slug-uri inexistente.
  if (!products.some((p) => p.slug === slug)) notFound();
  return <ProductPageClient slug={slug} />;
}
