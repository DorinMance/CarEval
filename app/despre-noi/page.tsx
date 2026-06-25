import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Section, Eyebrow, btnPrimary } from "@/components/ui";
import { COMPANY } from "@/lib/products";
import { Award, Shield, Scale, Check, ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Despre noi",
  description: "CarEval (SC VAST Expertise SRL) — expertize tehnice auto autorizate, conduse de expert tehnic judiciar. Misiunea noastră: despăgubiri corecte, fără stres.",
};

const values = [
  { icon: <Shield className="h-6 w-6" />, t: "Independență", d: "Lucrăm pentru tine, nu pentru asigurător. Cifrele noastre sunt obiective și documentate." },
  { icon: <Scale className="h-6 w-6" />, t: "Rigoare tehnică", d: "Folosim sistemele oficiale AUDATEX și DAT și standardele expertizei judiciare." },
  { icon: <Award className="h-6 w-6" />, t: "Experiență", d: "Sute de evaluări și expertize, premiate la Targetare.ro AWARDS 2023 și 2024." },
];

export default function DespreNoiPage() {
  return (
    <>
      <PageHero
        eyebrow="Despre noi"
        title={<>Experți care îți apără <span className="text-gradient-lime">interesul</span></>}
        subtitle={`${COMPANY.name} este marca sub care ${COMPANY.legal} oferă expertize tehnice auto autorizate.`}
      />

      <Section className="bg-white">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <Eyebrow>Misiunea noastră</Eyebrow>
            <h2 className="mt-4 font-heading text-3xl font-bold text-navy-800">
              Despăgubiri corecte, fără bătăi de cap
            </h2>
            <p className="mt-4 leading-relaxed text-navy-600">
              Am pornit CarEval pentru că prea mulți șoferi pierd bani după un accident — pur și
              simplu pentru că nu au un document oficial cu care să se apere. Noi le punem la
              dispoziție expertiza tehnică de care au nevoie, rapid și complet online.
            </p>
            <p className="mt-3 leading-relaxed text-navy-600">
              Fiecare raport este întocmit și semnat de <strong className="text-navy-800">{COMPANY.expert}</strong>,
              cu valoare legală recunoscută.
            </p>
            <div className="mt-7">
              <Link href="/produse" className={btnPrimary}>Vezi serviciile <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </Reveal>

          <Reveal>
            <div className="mx-auto w-fit">
              <div className="relative overflow-hidden rounded-3xl shadow-[0_30px_60px_-30px_rgba(11,25,48,0.5)]">
                <Image
                  src="/images/fondator.jpg"
                  alt="Dr. Ing. Kulcsar Raul-Miklos — fondator CarEval, expert tehnic judiciar"
                  width={300}
                  height={400}
                  className="block h-[400px] w-[300px] object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/80 to-transparent p-4">
                  <p className="font-heading text-sm font-semibold text-white">{COMPANY.expert}</p>
                  <p className="text-xs text-navy-300">Fondator CarEval · Expert Tehnic Judiciar</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal stagger className="mt-12 grid gap-4 md:grid-cols-3">
          {values.map((v) => (
            <div data-reveal key={v.t} className="flex gap-4 rounded-2xl border border-mist bg-white p-5 shadow-[0_2px_10px_rgba(11,25,48,0.03)]">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy-800 text-lime-300">{v.icon}</span>
              <div>
                <h3 className="font-heading text-lg font-semibold text-navy-800">{v.t}</h3>
                <p className="mt-1 text-sm text-navy-500">{v.d}</p>
              </div>
            </div>
          ))}
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <Eyebrow>Autorizație oficială</Eyebrow>
            <h2 className="mt-4 font-heading text-2xl font-bold text-navy-800">
              Expert tehnic judiciar autorizat de Ministerul Justiției
            </h2>
            <p className="mt-4 leading-relaxed text-navy-600">
              Expertizele noastre sunt întocmite de un expert tehnic judiciar autorizat, cu drept de
              practică recunoscut de Ministerul Justiției din România. Autorizația garantează că
              rapoartele au valoare legală deplină — pot fi depuse în instanță și acceptate de
              asigurători.
            </p>
            <ul className="mt-5 space-y-2">
              {["Autorizat Ministerul Justiției", "Specialitatea: evaluare autovehicule", "Valoare legală recunoscută în instanță"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-navy-700">
                  <Check className="h-4 w-4 shrink-0 text-lime-600" />{item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <div className="relative flex justify-center">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(143,208,47,0.08)_0%,transparent_70%)]" />
              <div className="relative rotate-1 rounded-2xl border border-mist bg-white p-3 shadow-[0_20px_60px_-20px_rgba(11,25,48,0.25)]">
                <Image
                  src="/images/autorizatie-fara-cnp-9841.webp"
                  alt="Autorizație expert tehnic judiciar — Ministerul Justiției România"
                  width={480}
                  height={680}
                  className="rounded-xl object-contain"
                  sizes="(max-width: 1024px) 90vw, 45vw"
                />
                <div className="mt-2 flex items-center gap-2 px-1 pb-1">
                  <Award className="h-4 w-4 shrink-0 text-lime-600" />
                  <p className="text-xs font-medium text-navy-500">Autorizație expert tehnic judiciar — Ministerul Justiției</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-navy-gradient relative overflow-hidden text-white">
        {/* trophy-cut.png — floating award */}
        <div className="pointer-events-none absolute right-[4%] top-1/2 hidden w-[130px] -translate-y-1/2 lg:block">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(143,208,47,0.18)_0%,transparent_65%)] blur-lg" />
          <Image
            src="/images/generated/trophy-cut.png"
            alt=""
            width={260}
            height={300}
            className="h-auto w-full object-contain"
            style={{ filter: "drop-shadow(0 20px 34px rgba(0,0,0,0.45))" }}
            aria-hidden
          />
        </div>
        <Reveal stagger className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
          {[
            ["500+", "evaluări realizate"],
            ["24–48h", "timp mediu de livrare"],
            ["2", "premii Targetare.ro"],
            ["100%", "online"],
          ].map(([v, l]) => (
            <div data-reveal key={l}>
              <p className="font-heading text-4xl font-bold text-lime-300">{v}</p>
              <p className="mt-1 text-sm text-navy-200">{l}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      <Section className="bg-white">
        <Reveal className="rounded-3xl bg-mesh-light p-8 sm:p-12">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Eyebrow>Date de contact</Eyebrow>
              <h2 className="mt-4 font-heading text-2xl font-bold text-navy-800">{COMPANY.legal}</h2>
              <ul className="mt-4 space-y-2 text-navy-600">
                <li><strong className="text-navy-800">Adresă:</strong> {COMPANY.address}</li>
                <li><strong className="text-navy-800">Telefon:</strong> <a href={COMPANY.phoneHref} className="text-lime-600 hover:underline">{COMPANY.phone}</a></li>
                <li><strong className="text-navy-800">Email:</strong> <a href={`mailto:${COMPANY.email}`} className="text-lime-600 hover:underline">{COMPANY.email}</a></li>
                <li><strong className="text-navy-800">Program:</strong> {COMPANY.hours}</li>
              </ul>
            </div>
            <ul className="space-y-3">
              {["Expert tehnic judiciar autorizat", "Sisteme oficiale AUDATEX & DAT", "Rapoarte cu valoare legală", "Premiat Targetare.ro 2023 & 2024"].map((c) => (
                <li key={c} className="flex items-center gap-3 rounded-xl bg-white p-4 text-navy-700 shadow-[0_2px_8px_rgba(11,25,48,0.04)]">
                  <Check className="h-5 w-5 shrink-0 text-lime-600" /> {c}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
