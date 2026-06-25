import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Section, Eyebrow, btnPrimary } from "@/components/ui";
import { Check, ArrowRight, FileText, Shield } from "@/components/icons";

export const metadata: Metadata = {
  title: "Model de raport",
  description: "Vezi ce conține un raport de evaluare CarEval: date tehnice, valoarea de piață, deviz de reparație și semnătura expertului tehnic judiciar.",
};

const contents = [
  "Datele complete ale vehiculului (marcă, model, VIN, km, dotări)",
  "Valoarea de piață calculată profesionist",
  "Deviz de reparație detaliat (AUDATEX / DAT) — unde e cazul",
  "Fotografiile relevante cu starea vehiculului",
  "Concluzia și valoarea finală, evidențiate clar",
  "Semnătura și ștampila expertului tehnic judiciar",
];

export default function ModelRaportPage() {
  return (
    <>
      <PageHero
        eyebrow="Model raport"
        title={<>Cum arată un <span className="text-gradient-lime">raport autorizat</span></>}
        subtitle="Un document clar, profesionist și acceptat oficial — exact ce ai nevoie în fața asigurătorului sau în instanță."
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
            <div className="relative overflow-hidden rounded-3xl bg-[#07101f] p-10">
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

      <Section className="bg-cloud pt-0">
        <Reveal stagger className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: <FileText className="h-6 w-6" />, t: "Format PDF", d: "Primit direct pe email, ușor de printat și de trimis mai departe." },
            { icon: <Shield className="h-6 w-6" />, t: "Valoare legală", d: "Expertiză semnată de expert tehnic judiciar autorizat." },
            { icon: <Check className="h-6 w-6" />, t: "Acceptat oficial", d: "Folosit în relația cu asigurătorii și în proceduri legale." },
          ].map((b) => (
            <div data-reveal key={b.t} className="rounded-2xl border border-mist bg-white p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-800 text-lime-300">{b.icon}</span>
              <h3 className="mt-4 font-heading text-lg font-semibold text-navy-800">{b.t}</h3>
              <p className="mt-1.5 text-sm text-navy-500">{b.d}</p>
            </div>
          ))}
        </Reveal>
      </Section>
    </>
  );
}
