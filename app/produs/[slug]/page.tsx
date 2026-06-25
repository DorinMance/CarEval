import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { products, getProduct, formatPrice, COMPANY } from "@/lib/products";
import { Wizard } from "@/components/Wizard";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { Section, Eyebrow, PriceTag } from "@/components/ui";
import { Check, Clock, Shield, ChevronRight, ArrowRight, Phone } from "@/components/icons";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Produs inexistent" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products.filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, 3);
  const fallback = products.filter((p) => p.slug !== product.slug).slice(0, 3);
  const suggestions = related.length ? related : fallback;

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-mist bg-cloud">
        <nav className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-3 text-sm text-navy-400 sm:px-6 lg:px-8">
          <Link href="/" className="hover:text-navy-700">Acasă</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/produse" className="hover:text-navy-700">Produse</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-navy-700">{product.name}</span>
        </nav>
      </div>

      {/* Product intro */}
      <Section className="bg-white">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl bg-mesh-light p-6">
              <div className="relative aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-contain"
                />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                [<Clock key="c" className="h-5 w-5" />, product.delivery],
                [<Shield key="s" className="h-5 w-5" />, "Autorizat"],
                [<Check key="ch" className="h-5 w-5" />, "100% online"],
              ].map(([icon, label]) => (
                <div key={label as string} className="flex flex-col items-center gap-1.5 rounded-xl border border-mist bg-white p-3 text-center">
                  <span className="text-lime-600">{icon}</span>
                  <span className="text-xs font-medium text-navy-600">{label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <Eyebrow>{product.category}</Eyebrow>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-navy-800 sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-lg text-navy-500">{product.tagline}</p>

            <div className="mt-6 flex items-end gap-4 rounded-2xl border border-mist bg-cloud p-5">
              <div>
                <span className="block text-xs uppercase tracking-wide text-navy-400">
                  {product.price == null ? "Tarif" : "Preț"}
                </span>
                <PriceTag price={product.price} note={product.priceNote} className="text-3xl font-bold" />
              </div>
              <a href="#formular" className="ml-auto inline-flex items-center gap-2 rounded-xl bg-lime-500 px-5 py-3 text-sm font-semibold text-navy-900 transition-colors hover:bg-lime-400">
                Cere ofertă <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <ul className="mt-6 space-y-2.5">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-navy-700">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lime-100">
                    <Check className="h-3.5 w-3.5 text-lime-600" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-7 space-y-3 border-t border-mist pt-6">
              {product.description.map((p, i) => (
                <p key={i} className="leading-relaxed text-navy-600">{p}</p>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-xl bg-navy-800 p-4 text-sm text-navy-100">
              <Phone className="h-5 w-5 text-lime-400" />
              Ai nevoie de ajutor?{" "}
              <a href={COMPANY.phoneHref} className="font-semibold text-white underline-offset-4 hover:underline">
                {COMPANY.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Wizard */}
      <Section id="formular" className="bg-mesh-light">
        <Reveal className="mx-auto mb-8 max-w-3xl text-center">
          <Eyebrow>Cere oferta</Eyebrow>
          <h2 className="mt-4 font-heading text-3xl font-bold text-navy-800">
            Completează pas cu pas
          </h2>
          <p className="mt-3 text-navy-500">
            Durează ~3 minute. La final adaugi serviciul în coș și un expert te contactează cu oferta.
          </p>
        </Reveal>
        <div className="mx-auto max-w-3xl">
          <Wizard product={product} />
        </div>
      </Section>

      {/* Suggestions */}
      <Section className="bg-white">
        <Reveal className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-navy-800">Servicii similare</h2>
        </Reveal>
        <Reveal stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((p) => (
            <div data-reveal key={p.slug}>
              <ProductCard product={p} />
            </div>
          ))}
        </Reveal>
      </Section>
    </>
  );
}
