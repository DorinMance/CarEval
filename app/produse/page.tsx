import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { Section, Eyebrow, btnPrimary } from "@/components/ui";
import { products, COMPANY } from "@/lib/products";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Produse & servicii de evaluare auto",
  description:
    "Toate serviciile CarEval: evaluare autovehicul, costuri reparație, despăgubiri, epavă, devalorizare și consultanță în caz de accident. Rapoarte autorizate în 24–48h.",
};

export default function ProdusePage() {
  return (
    <>
      <section className="bg-navy-gradient text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <Reveal>
            <Eyebrow light>Serviciile noastre</Eyebrow>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Evaluări &amp; expertize auto, cu raport autorizat
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-navy-200">
              Alege serviciul potrivit situației tale. Preț transparent, livrare 24–48h, totul online.
              Nu ești sigur ce ai nevoie? <Link href="/cum-functioneaza" className="text-lime-300 underline-offset-4 hover:underline">Vezi cum funcționează</Link> sau sună-ne.
            </p>
          </Reveal>
        </div>
      </section>

      <Section className="bg-white">
        <Reveal stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <div data-reveal key={p.slug}>
              <ProductCard product={p} priority={i < 3} />
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-14 flex flex-col items-center gap-4 rounded-3xl bg-mesh-light p-8 text-center sm:p-12">
          <h2 className="font-heading text-2xl font-bold text-navy-800 sm:text-3xl">
            Nu știi ce serviciu ți se potrivește?
          </h2>
          <p className="max-w-xl text-navy-500">
            Spune-ne pe scurt situația ta și îți recomandăm exact ce ai nevoie — fără obligații.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/produs/consultanta-in-caz-de-accident" className={btnPrimary}>
              Cere consultanță gratuită <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={COMPANY.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy-200 bg-white px-6 py-3 text-sm font-semibold text-navy-800 hover:bg-cloud">
              {COMPANY.phone}
            </a>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
