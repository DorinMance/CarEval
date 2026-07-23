import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Section, Eyebrow, btnPrimary } from "@/components/ui";
import { Check, ArrowRight, FileText, Shield } from "@/components/icons";

export const metadata: Metadata = {
  title: "Model de raport",
  description: "Vezi ce conține un raport de evaluare CarEval: date tehnice, estimare tehnică a valorii, deviz de reparație și semnătura expertului autorizat de Ministerul Justiției.",
};

const contents = [
  "Datele complete ale vehiculului (marcă, model, VIN, km, dotări)",
  "Estimare tehnică a valorii, pe baza sistemelor AUDATEX/DAT",
  "Deviz de reparație detaliat (AUDATEX / DAT) — unde e cazul",
  "Fotografiile relevante cu starea vehiculului",
  "Concluzia și valoarea finală, evidențiate clar",
  "Semnătura și ștampila expertului tehnic judiciar",
];

const reports = [
  { slug: "raport-despagubiri", title: "Evaluare tehnică a prejudiciului", pages: 5 },
  { slug: "raport-costuri-reparatie", title: "Evaluare Costuri Reparație", pages: 4 },
  { slug: "raport-devalorizare", title: "Evaluare Devalorizare", pages: 6 },
  { slug: "raport-epava", title: "Evaluare Epavă Autoturism", pages: 4 },
  { slug: "raport-data-accidentului", title: "Evaluare la Data Accidentului", pages: 2 },
];

export default function ModelRaportPage() {
  return (
    <>
      <PageHero
        eyebrow="Model raport"
        title={<>Cum arată un <span className="text-gradient-lime">raport autorizat</span></>}
        subtitle="Un document clar, profesionist și verificabil — cifre calculate în AUDATEX și DAT, utile în discuția cu asigurătorul sau în instanță."
      />

      <Section className="bg-white">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <Eyebrow>Ce conține</Eyebrow>
            <h2 className="mt-4 font-heading text-3xl font-bold text-navy-800">
              Toate informațiile, într-un singur PDF
            </h2>
            <ul className="mt-6 space-y-3">
              {contents.map((c) => (
                <li key={c} className="flex items-start gap-3 text-navy-700">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lime-100">
                    <Check className="h-3.5 w-3.5 text-lime-600" />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/produse" className={btnPrimary}>Cere raportul tău <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </Reveal>

          <Reveal className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-3xl bg-surface p-10">
              {/* glow + grid */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "26px 26px" }}
              />
              <div className="pointer-events-none absolute left-1/2 top-1/3 h-52 w-52 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(143,208,47,0.16)_0%,transparent_65%)] blur-lg" />
              {/* docs-cut.png — 3D floating documents + key */}
              <div className="relative flex items-center justify-center py-4">
                <Image
                  src="/images/generated/docs-cut.png"
                  alt="Raport oficial CarEval — documente și cheie auto"
                  width={853}
                  height={471}
                  className="h-auto w-full max-w-[420px] object-contain"
                  style={{ filter: "drop-shadow(0 30px 45px rgba(0,0,0,0.55))" }}
                />
              </div>
              {/* caption chip */}
              <div className="relative mt-4 flex items-center justify-center gap-2 rounded-xl border border-lime-400/15 bg-lime-400/[0.08] px-4 py-2.5">
                <Shield className="h-4 w-4 shrink-0 text-lime-400" />
                <span className="text-sm font-semibold text-white">Document oficial, semnat de expert judiciar</span>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-white pt-0">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Modele reale</Eyebrow>
          <h2 className="mt-4 font-heading text-3xl font-bold text-navy-800">
            Exemple de rapoarte, pe fiecare serviciu
          </h2>
          <p className="mt-3 text-navy-500">
            Deschide sau descarcă un model complet și vezi exact structura, cifrele și nivelul de detaliu.
          </p>
        </Reveal>

        <Reveal stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <div
              data-reveal
              key={r.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-mist bg-white shadow-[0_2px_12px_rgba(11,25,48,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(11,25,48,0.35)]"
            >
              <a
                href={`/model-raport/${r.slug}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block aspect-[1/1.414] overflow-hidden border-b border-mist bg-cloud"
              >
                <Image
                  src={`/model-raport/thumbs/${r.slug}.png`}
                  alt={`Model de raport — ${r.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:bg-navy-900/70 group-hover:opacity-100">
                  <FileText className="h-4 w-4" /> Deschide raportul
                </span>
              </a>

              <div className="flex flex-1 flex-col p-5">
                <span className="text-[11px] font-bold uppercase tracking-wide text-lime-600">
                  {r.pages} pagini · PDF
                </span>
                <h3 className="mt-1 font-heading text-base font-semibold leading-snug text-navy-800">{r.title}</h3>
                <div className="mt-4 flex gap-2">
                  <a
                    href={`/model-raport/${r.slug}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-surface px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-surface-soft"
                  >
                    <FileText className="h-4 w-4" /> Vezi
                  </a>
                  <a
                    href={`/model-raport/${r.slug}.pdf`}
                    download
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-mist px-4 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:bg-cloud"
                  >
                    Descarcă
                  </a>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </Section>

      <Section className="bg-cloud pt-0">
        <Reveal stagger className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: <FileText className="h-6 w-6" />, t: "Format PDF", d: "Primit direct pe email, ușor de printat și de trimis mai departe." },
            { icon: <Shield className="h-6 w-6" />, t: "Valoare legală", d: "Expertiză semnată de expert tehnic judiciar autorizat." },
            { icon: <Check className="h-6 w-6" />, t: "Document oficial", d: "Poate fi folosit în discuția cu asigurătorul și în proceduri legale." },
          ].map((b) => (
            <div data-reveal key={b.t} className="rounded-2xl border border-mist bg-white p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-surface text-lime-300">{b.icon}</span>
              <h3 className="mt-4 font-heading text-lg font-semibold text-navy-800">{b.t}</h3>
              <p className="mt-1.5 text-sm text-navy-500">{b.d}</p>
            </div>
          ))}
        </Reveal>
      </Section>
    </>
  );
}
