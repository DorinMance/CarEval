import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Section, Eyebrow, btnPrimary } from "@/components/ui";
import { COMPANY } from "@/lib/products";
import { Shield, Scale, FileText, Check, X, ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Independență și imparțialitate",
  description:
    "CarEval (SC VAST Expertise SRL) realizează expertize tehnice extrajudiciare auto. Aceeași metodologie, sisteme și standard al raportului, indiferent cine este beneficiarul — imparțialitate garantată.",
};

const neschimbate = [
  "Metodologia de calcul.",
  "Sistemele folosite — AUDATEX și DAT.",
  "Structura raportului, sursele citate și datele de referință.",
  "Onorariul, care este fix, comunicat înainte de începerea lucrării și nu depinde de rezultatul obținut.",
];

const ceNuFacem = [
  "Nu garantăm sume și nu promitem rezultate.",
  "Nu negociem în numele clientului.",
  "Nu acceptăm onorarii de succes, în nicio formă.",
  "Nu realizăm evaluări în cazurile în care inspecția fizică este indispensabilă și nu poate fi efectuată.",
];

export default function IndependentaPage() {
  return (
    <>
      <PageHero
        eyebrow="Independență și imparțialitate"
        title={<>Independență și <span className="text-gradient-lime">imparțialitate</span></>}
        subtitle={`${COMPANY.name} este marca sub care ${COMPANY.legal} realizează expertize tehnice extrajudiciare în domeniul auto.`}
      />

      <Section className="bg-white">
        <Reveal className="mx-auto max-w-3xl">
          <Eyebrow>Cine suntem</Eyebrow>
          <p className="mt-4 text-lg leading-relaxed text-navy-600">
            CarEval este marca sub care {COMPANY.legal} realizează expertize tehnice extrajudiciare
            în domeniul auto. Rapoartele sunt semnate de un expert tehnic autorizat de Ministerul
            Justiției. Această calitate presupune o singură obligație fundamentală: imparțialitatea.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-mist bg-white p-7 shadow-[0_2px_12px_rgba(11,25,48,0.04)]">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-surface text-lime-300">
                <Shield className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-heading text-xl font-semibold text-navy-800">Pentru cine lucrăm</h2>
              <p className="mt-3 leading-relaxed text-navy-600">
                Realizăm expertize pentru persoane fizice, companii cu flote, service-uri auto,
                societăți de leasing, asigurători, brokeri și instanțe de judecată. Nu suntem
                avocați, nu suntem firmă de recuperare a despăgubirilor și nu reprezentăm juridic
                nicio parte.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-mist bg-white p-7 shadow-[0_2px_12px_rgba(11,25,48,0.04)]">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-surface text-lime-300">
                <Scale className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-heading text-xl font-semibold text-navy-800">
                Ce nu se schimbă, indiferent cine plătește raportul
              </h2>
              <ul className="mt-4 space-y-3">
                {neschimbate.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-navy-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-cloud pt-0">
        <Reveal className="mx-auto max-w-3xl rounded-3xl border border-mist bg-white p-8 shadow-[0_2px_12px_rgba(11,25,48,0.04)] sm:p-10">
          <Eyebrow>Conflictul de interese</Eyebrow>
          <h2 className="mt-4 font-heading text-2xl font-bold text-navy-800">
            Verificăm relațiile contractuale înainte de fiecare lucrare
          </h2>
          <p className="mt-4 leading-relaxed text-navy-600">
            Înainte de preluarea oricărei lucrări verificăm dacă asigurătorul implicat în dosar are
            o relație contractuală curentă cu {COMPANY.legal}. Dacă da, informăm clientul în scris,
            iar acesta decide dacă dorește să continue sau să se adreseze altui expert. În lucrările
            realizate pentru asigurători aplicăm aceeași regulă, în sens invers.
          </p>
          <p className="mt-3 leading-relaxed text-navy-600">
            Nu preluăm lucrări în care raportul ar urma să fie folosit direct împotriva unui client
            contractual, într-un litigiu activ.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-white pt-0">
        <Reveal className="mx-auto max-w-3xl">
          <Eyebrow>Ce nu facem</Eyebrow>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {ceNuFacem.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-mist bg-white p-5 text-navy-700 shadow-[0_2px_8px_rgba(11,25,48,0.04)]"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface text-lime-300">
                  <X className="h-4 w-4" />
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section className="bg-navy-gradient text-white">
        <Reveal className="mx-auto max-w-3xl">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-lime-300">
            <FileText className="h-6 w-6" />
          </span>
          <h2 className="mt-5 font-heading text-2xl font-bold">Judiciar și extrajudiciar</h2>
          <p className="mt-4 leading-relaxed text-navy-200">
            O expertiză tehnică extrajudiciară este solicitată direct de o parte interesată și are
            valoarea unui înscris tehnic, care poate fi depus la dosar, folosit în negociere sau în
            procedura de soluționare alternativă a litigiilor.
          </p>
          <p className="mt-3 leading-relaxed text-navy-200">
            O expertiză tehnică judiciară există numai atunci când instanța sau organul de urmărire
            penală dispune efectuarea ei și desemnează expertul în cauza respectivă. Aceasta nu poate
            fi comandată online și nu poate fi cumpărată de o parte.
          </p>
          <div className="mt-8">
            <Link href="/produse" className={btnPrimary}>
              Vezi serviciile <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
