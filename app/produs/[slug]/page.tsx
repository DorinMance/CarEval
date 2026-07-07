"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { COMPANY, PRODUCT_FAQ, PRODUCT_NOTE } from "@/lib/products";
import { useProducts } from "@/lib/content";
import { Wizard } from "@/components/Wizard";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Section, Eyebrow, PriceTag, btnPrimary } from "@/components/ui";
import { Check, Clock, Shield, ChevronRight, ArrowRight, Phone } from "@/components/icons";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const products = useProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold text-navy-800">Produs inexistent</h1>
        <p className="mt-2 text-navy-500">Serviciul căutat nu există sau a fost șters.</p>
        <Link href="/produse" className={`${btnPrimary} mt-6`}>Vezi toate serviciile <ArrowRight className="h-4 w-4" /></Link>
      </div>
    );
  }

  const related = products.filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, 3);
  const fallback = products.filter((p) => p.slug !== product.slug).slice(0, 3);
  const suggestions = related.length ? related : fallback;

  const faqs = PRODUCT_FAQ[product.slug] ?? [];
  const note = PRODUCT_NOTE[product.slug];

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
                Comandă <ArrowRight className="h-4 w-4" />
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

            {note && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-lime-300 bg-lime-50 p-4 text-sm font-medium text-navy-700">
                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-lime-600" />
                <span>{note}</span>
              </div>
            )}

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
          <Eyebrow>Comandă</Eyebrow>
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

      {/* FAQ + schema FAQPage (SEO) */}
      {faqs.length > 0 && (
        <Section className="bg-white pt-0">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Eyebrow>Întrebări frecvente</Eyebrow>
            <h2 className="mt-4 font-heading text-3xl font-bold text-navy-800">Ce întreabă oamenii</h2>
          </Reveal>
          <FAQAccordion faqs={faqs} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqs.map(([q, a]) => ({
                  "@type": "Question",
                  name: q,
                  acceptedAnswer: { "@type": "Answer", text: a },
                })),
              }),
            }}
          />
        </Section>
      )}

      {/* Suggestions */}
      <Section className="bg-white">
        <Reveal className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-navy-800">Servicii similare</h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((p) => (
            <div key={p.slug}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
