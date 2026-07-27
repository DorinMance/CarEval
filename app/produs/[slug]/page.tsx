import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPANY, formatPrice } from "@/lib/products";
import { getAllProducts, getProductBySlug } from "@/lib/products-server";
import { ProductPageClient } from "./ProductPageClient";

type Props = { params: Promise<{ slug: string }> };

/**
 * Produsele cunoscute la build sunt prerandate → CDN static, nu funcție la fiecare
 * cerere. Cele adăugate din panou DUPĂ build se generează la prima cerere
 * (`dynamicParams` e `true` implicit) — altfel ar fi 404 până la următorul deploy.
 */
export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
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
  // 404 real (nu soft-404 cu status 200) pentru slug-uri inexistente. Căutarea
  // include și produsele din panou, altfel cele adăugate de admin ar fi de negăsit.
  if (!(await getProductBySlug(slug))) notFound();
  return <ProductPageClient slug={slug} />;
}
