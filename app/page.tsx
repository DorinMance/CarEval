import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { CompareCard } from "@/components/CompareCard";
import { ProductCard } from "@/components/ProductCard";
import { Section, Eyebrow, btnPrimary, btnDark, btnOutline } from "@/components/ui";
import { products, COMPANY } from "@/lib/products";
import {
  ArrowRight, FileText, Shield, Award, Building, Quote, Star,
  Clock, Car, Scale, Check, Zap, ClipboardList, ImagePlus,
} from "@/components/icons";

/* ── Data ── */

const situations = [
  {
    Icon: Car,
    label: "Despăgubiri",
    title: "Asigurătorul mi-a oferit prea puțin",
    desc: "Calculăm suma reală la care ai dreptul, cu cifre din AUDATEX/DAT — argumentul solid față de orice asigurător.",
    href: "/produs/evaluare-despagubiri-cuvenite",
    stat: "9 din 10",
    statLabel: "oferte sub valoarea reală",
  },
  {
    Icon: Scale,
    label: "Daună totală",
    title: "Mașina e daună totală sau epavă",
    desc: "Stabilim valoarea mașinii la data exactă a accidentului — esențial pentru despăgubirea corectă.",
    href: "/produs/evaluare-autovehicul-la-data-accidentului",
    stat: "Esențial",
    statLabel: "la daună totală",
  },
  {
    Icon: FileText,
    label: "Devalorizare",
    title: "Am reparat-o, dar valorează mai puțin acum",
    desc: "O mașină accidentată pierde din valoare chiar și după reparație completă. Recuperează această diferență.",
    href: "/produs/evaluare-devalorizare-autovehicul-dupa-accident",
    stat: "Recuperabil",
    statLabel: "chiar și după reparație completă",
  },
];

const steps = [
  {
    n: "01",
    Icon: ClipboardList,
    title: "Alege serviciul",
    text: "Spui ce ai nevoie — evaluare, despăgubire, daună totală sau consultanță. Te ghidăm noi.",
  },
  {
    n: "02",
    Icon: ImagePlus,
    title: "Completezi & încarci poze",
    text: "Un formular simplu, pas cu pas: datele mașinii și câteva fotografii. Durează 3 minute.",
  },
  {
    n: "03",
    Icon: FileText,
    title: "Primești raportul",
    text: "Raport PDF autorizat de expert tehnic judiciar, pe email, în 24–48h. Fără deplasări.",
  },
];

const featuredSlugs = [
  "evaluare-despagubiri-cuvenite",
  "evaluare-devalorizare-autovehicul-dupa-accident",
  "evaluare-costuri-reparatie-autovehicul",
];

const whyUs = [
  {
    Icon: Shield,
    title: "Expert autorizat MJ",
    text: "Rapoartele sunt semnate de Dr. Ing. Kulcsar Raul Miklos, expert tehnic judiciar autorizat de Ministerul Justiției — acceptate de asigurători.",
  },
  {
    Icon: Scale,
    title: "Despăgubire corectă",
    text: "Calculăm în sistemele oficiale AUDATEX și DAT. Argumentul cu care negociezi cu asigurătorul.",
  },
  {
    Icon: Zap,
    title: "Rapid & online",
    text: "Totul de pe telefon. Fără programări, fără cozi, fără deplasări. Raportul vine în 24–48h.",
  },
];

const testimonials = [
  {
    name: "Andrei M.",
    city: "Timișoara",
    saved: "+3.850 lei",
    stars: 5,
    text: "Asigurarea îmi oferea cu aproape 4.000 lei mai puțin. Cu raportul CarEval am obținut suma corectă, fără bătăi de cap.",
  },
  {
    name: "Marius T.",
    city: "Oradea",
    saved: "+2.600 lei recuperați",
    stars: 5,
    text: "Mașina a fost reparată dar asigurătorul refuza devalorizarea. Cu raportul CarEval am primit tot ce mi se cuvenea — în mai puțin de o săptămână.",
  },
  {
    name: "Sorin P.",
    city: "Lugoj",
    saved: "Dosar câștigat",
    stars: 5,
    text: "După accident eram pierdut. Consultanța lor mi-a spus exact ce să fac pas cu pas. Fără raportul lor nu știam cu ce să mă apăr.",
  },
];

const stats = [
  { v: "24–48h", l: "livrare raport" },
  { v: "100%", l: "online, fără deplasare" },
  { v: "AUDATEX", l: "& DAT — sisteme oficiale" },
  { v: "2023/24", l: "premii Targetare.ro" },
];

/* ── Page ── */

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ════════════════════════════════════
          STATS TICKER — imediat sub hero
      ════════════════════════════════════ */}
      <div className="border-y border-white/[0.06] bg-surface">
        <Reveal stagger className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div
              data-reveal
              key={s.l}
              className="flex flex-col items-center gap-0.5 py-6 text-center"
            >
              <p className="font-heading text-2xl font-bold text-white sm:text-3xl">{s.v}</p>
              <p className="text-xs text-white/35">{s.l}</p>
            </div>
          ))}
        </Reveal>
      </div>

      {/* ════════════════════════════════════
          SITUAȚII — editorial 3-col
      ════════════════════════════════════ */}
      <Section id="situatii" className="bg-[#f8f9fc]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>În ce situație ești?</Eyebrow>
          <h2 className="mt-4 font-heading text-3xl font-bold text-navy-800 sm:text-4xl">
            Pornim de la problema ta,
            <br className="hidden sm:block" />
            <em className="not-italic italic text-lime-600"> nu de la formulare</em>
          </h2>
        </Reveal>

        <Reveal stagger className="mt-12 grid gap-5 md:grid-cols-3">
          {situations.map((s) => (
            <a
              key={s.title}
              href={s.href}
              data-reveal
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-navy-100 bg-white p-8 shadow-[0_2px_16px_rgba(11,25,48,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(11,25,48,0.12)]"
            >
              {/* Top accent bar */}
              <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-lime-400 to-lime-300 opacity-0 transition-opacity group-hover:opacity-100" />

              {/* Icon + label */}
              <div className="flex items-center justify-between">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-800">
                  <s.Icon className="h-7 w-7 text-lime-400" />
                </div>
                <span className="rounded-full border border-navy-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-400">
                  {s.label}
                </span>
              </div>

              {/* Text */}
              <h3 className="mt-6 font-heading text-xl font-bold text-navy-800">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-500">{s.desc}</p>

              {/* Stat */}
              <div className="mt-6 flex items-end justify-between border-t border-navy-50 pt-5">
                <div>
                  <p className="font-heading text-2xl font-bold text-lime-600">{s.stat}</p>
                  <p className="text-[11px] text-navy-400">{s.statLabel}</p>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-navy-700 transition-all group-hover:gap-2 group-hover:text-lime-600">
                  Află mai mult <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          ))}
        </Reveal>
      </Section>

      {/* ════════════════════════════════════
          PROBLEMA — dark editorial split
      ════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-surface py-20 sm:py-28">
        {/* lime glow */}
        <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(143,208,47,0.08)_0%,transparent_65%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "30px 30px" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            {/* Copy */}
            <Reveal>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lime-400/70">
                De ce contează
              </p>
              <h2 className="mt-4 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                După un accident,{" "}
                <br className="hidden lg:block" />
                fiecare greșeală{" "}
                <em className="not-italic italic text-lime-400">te costă bani.</em>
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/50">
                Asigurătorii calculează în favoarea lor și oferă frecvent mai puțin
                decât ți se cuvine. Fără un document oficial, nu ai cu ce să te aperi.
              </p>
              <p className="mt-3 max-w-lg text-lg leading-relaxed text-white/50">
                CarEval îți pune în mână o{" "}
                <strong className="text-white/80">expertiză tehnică autorizată</strong>{" "}
                — cifre corecte, documentate, pe care le poți susține oriunde.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/produse" className={btnPrimary}>
                  Vezi serviciile <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/model-raport"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10"
                >
                  Model raport
                </Link>
              </div>
            </Reveal>

            {/* accident-cut.png — 3D floating crashed car (transparent cutout) */}
            <Reveal>
              <div className="relative mx-auto max-w-[540px] pb-28 pt-6">
                {/* lime ground glow */}
                <div className="absolute bottom-[26%] left-1/2 h-20 w-[72%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(143,208,47,0.22)_0%,transparent_70%)] blur-xl" />
                <Image
                  src="/images/generated/accident-cut.png"
                  alt="Autovehicul avariat după accident — evaluare despăgubiri"
                  width={1040}
                  height={520}
                  className="relative h-auto w-full object-contain"
                  style={{ filter: "drop-shadow(0 30px 45px rgba(0,0,0,0.6))" }}
                />
                {/* Floating compare card — animated sequential reveal */}
                <CompareCard />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          CUM FUNCȚIONEAZĂ — numbered steps
      ════════════════════════════════════ */}
      <Section className="bg-white">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Simplu ca 1-2-3</Eyebrow>
          <h2 className="mt-4 font-heading text-3xl font-bold text-navy-800 sm:text-4xl">
            Cum funcționează
          </h2>
          <p className="mt-3 text-lg text-navy-500">
            Fără jargon, fără pași inutili. Trei pași și ai raportul.
          </p>
        </Reveal>

        <Reveal stagger className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              data-reveal
              key={s.n}
              className="relative flex flex-col rounded-3xl border border-navy-100 bg-[#f8f9fc] p-8"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute -right-3 top-16 hidden h-px w-6 bg-gradient-to-r from-lime-400 to-transparent md:block" />
              )}
              {/* Step number badge */}
              <div className="mb-6 flex items-center justify-between">
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white shadow-[0_2px_12px_rgba(11,25,48,0.06)]">
                  <s.Icon className="h-9 w-9 text-lime-500" />
                </div>
                <span className="font-heading text-5xl font-black text-navy-100">{s.n}</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-navy-800">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">{s.text}</p>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-10 text-center">
          <Link href="/produse" className={btnPrimary}>
            Începe acum <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </Section>

      {/* ════════════════════════════════════
          EXPERT VISUAL — cinematic full-bleed
      ════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-surface py-16 sm:py-20">
        {/* ambient grid + glow texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="pointer-events-none absolute -right-32 top-1/2 h-[460px] w-[460px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(143,208,47,0.16)_0%,transparent_70%)] blur-2xl" />
        <Reveal>
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-8">
            {/* Text */}
            <div className="lg:max-w-lg">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-lime-400/70">
                Cum lucrăm
              </p>
              <h2 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">
                Fiecare mașină,
                <br />
                evaluată cu{" "}
                <em className="not-italic italic text-lime-400">precizie</em>
                <br />
                de expert judiciar.
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/50">
                Folosim sisteme profesionale AUDATEX &amp; DAT — aceleași pe care
                le folosesc asigurătorii, dar de data aceasta în favoarea ta.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["AUDATEX", "DAT", "Expert judiciar", "100% online"].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Floating 3D inspection cutout */}
            <div className="relative mx-auto w-full max-w-[560px]" data-inspect>
              <div className="absolute bottom-[12%] left-1/2 h-24 w-[78%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(143,208,47,0.28)_0%,transparent_70%)] blur-xl" />
              <Image
                src="/images/generated/inspect-cut.png"
                alt="Mașină inspectată cu lupă — evaluare de precizie CarEval"
                width={1279}
                height={768}
                className="relative h-auto w-full object-contain"
                style={{ filter: "drop-shadow(0 34px 50px rgba(0,0,0,0.65))" }}
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ════════════════════════════════════
          PRODUSE — 3 carduri featured
      ════════════════════════════════════ */}
      <Section id="produse" className="bg-[#f8f9fc]">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <Eyebrow>Serviciile noastre</Eyebrow>
            <h2 className="mt-4 font-heading text-3xl font-bold text-navy-800 sm:text-4xl">
              Alege exact ce ai nevoie
            </h2>
            <p className="mt-3 text-lg text-navy-500">
              Evaluare și expertiză tehnică judiciară, cu raport autorizat și preț transparent.
            </p>
          </div>
          <Link
            href="/produse"
            className="hidden shrink-0 items-center gap-1.5 font-semibold text-lime-600 hover:text-lime-700 sm:inline-flex"
          >
            Toate serviciile <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredSlugs.map((slug, i) => {
            const p = products.find((pr) => pr.slug === slug);
            if (!p) return null;
            return (
              <div data-reveal key={p.slug}>
                <ProductCard product={p} priority={i < 3} />
              </div>
            );
          })}
        </Reveal>
      </Section>

      {/* ════════════════════════════════════
          DE CE CAREVAL — dark lottie cards
      ════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-surface py-20 sm:py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[300px] w-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(143,208,47,0.07)_0%,transparent_65%)]" />

        {/* seal-cut.png — floating authority emblem */}
        <div className="pointer-events-none absolute right-[4%] top-[16%] hidden w-[140px] xl:block">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(143,208,47,0.18)_0%,transparent_65%)] blur-lg" />
          <Image
            src="/images/generated/seal-cut.png"
            alt=""
            width={300}
            height={300}
            className="h-auto w-full object-contain"
            style={{ filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.5))" }}
            aria-hidden
          />
        </div>
        <div className="pointer-events-none absolute left-[4%] bottom-[10%] hidden w-[110px] xl:block">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(143,208,47,0.12)_0%,transparent_65%)] blur-lg" />
          <Image
            src="/images/generated/trophy-cut.png"
            alt=""
            width={220}
            height={260}
            className="h-auto w-full object-contain"
            style={{ filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.5))" }}
            aria-hidden
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lime-400/70">
              De ce CarEval
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold text-white sm:text-4xl">
              Autoritate tehnică în care ai încredere
            </h2>
          </Reveal>

          <Reveal stagger x={-28} className="mt-12 divide-y divide-white/[0.06]">
            {whyUs.map((w, i) => (
              <div
                data-reveal
                key={w.title}
                className="flex items-start gap-6 py-8 first:pt-0 last:pb-0"
              >
                <span className="w-10 shrink-0 font-heading text-3xl font-black leading-none text-lime-400/20 tabular-nums">
                  0{i + 1}
                </span>
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-lime-400/15 bg-lime-400/[0.08]">
                  <w.Icon className="h-5 w-5 text-lime-400" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">{w.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/45">{w.text}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════
          TESTIMONIALE
      ════════════════════════════════════ */}
      <Section className="bg-white">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Ce spun clienții</Eyebrow>
          <h2 className="mt-4 font-heading text-3xl font-bold text-navy-800 sm:text-4xl">
            Rezultate, nu promisiuni
          </h2>
        </Reveal>

        <Reveal stagger className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              data-reveal
              key={t.name}
              className="flex flex-col rounded-3xl border border-navy-100 bg-[#f8f9fc] p-8"
            >
              {/* Saved badge */}
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-lime-50 px-3 py-1.5">
                <Check className="h-3.5 w-3.5 text-lime-600" />
                <span className="text-xs font-bold text-lime-700">{t.saved}</span>
              </div>

              <Quote className="h-7 w-7 text-lime-400" />
              <blockquote className="mt-3 flex-1 text-navy-600 leading-relaxed">
                {t.text}
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-between border-t border-navy-50 pt-5">
                <div>
                  <p className="font-heading font-semibold text-navy-800">{t.name}</p>
                  <p className="text-xs text-navy-400">{t.city}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < t.stars ? "text-lime-400" : "text-navy-200"}`} />
                  ))}
                </div>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </Section>

      {/* ════════════════════════════════════
          B2B TEASER
      ════════════════════════════════════ */}
      <Section className="bg-surface">
        <Reveal className="overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.04] p-8 sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <Eyebrow>Pentru companii</Eyebrow>
              <h2 className="mt-4 font-heading text-2xl font-bold text-white sm:text-3xl">
                Flote, leasing, service-uri
                <br />și firme de asigurări
              </h2>
              <p className="mt-3 text-white/50">
                Volume de evaluări, facturare lunară și un expert dedicat. Construim un
                flux de lucru pe nevoile companiei tale.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/companii" className={btnDark}>
                  <Building className="h-4 w-4" /> Soluții pentru companii
                </Link>
                <a href={COMPANY.phoneHref} className={btnOutline}>
                  {COMPANY.phone}
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                [<Award key="a" className="h-6 w-6" />, "Expert dedicat"],
                [<FileText key="f" className="h-6 w-6" />, "Facturare lunară"],
                [<Clock key="c" className="h-6 w-6" />, "Prioritate la livrare"],
                [<Shield key="s" className="h-6 w-6" />, "Rapoarte autorizate"],
              ].map(([icon, label]) => (
                <div
                  key={label as string}
                  className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-800 text-lime-400">
                    {icon}
                  </span>
                  <span className="text-sm font-semibold text-white/75">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ════════════════════════════════════
          FINAL CTA — dark dramatic
      ════════════════════════════════════ */}
      <Section className="bg-[#f8f9fc] pt-0">
        <Reveal className="relative overflow-hidden rounded-3xl bg-surface px-6 py-16 text-center text-white sm:px-12 sm:py-24">
          {/* Glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-48 w-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(143,208,47,0.12)_0%,transparent_65%)]" />

          {/* money-cut.png — floating savings stack */}
          <div className="pointer-events-none absolute -bottom-4 right-[3%] hidden w-[180px] lg:block">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(143,208,47,0.18)_0%,transparent_65%)] blur-lg" />
            <Image
              src="/images/generated/money-cut.png"
              alt=""
              width={360}
              height={400}
              className="h-auto w-full object-contain"
              style={{ filter: "drop-shadow(0 22px 36px rgba(0,0,0,0.55))" }}
              aria-hidden
            />
          </div>
          <div className="pointer-events-none absolute -bottom-2 left-[3%] hidden w-[150px] lg:block">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(143,208,47,0.12)_0%,transparent_65%)] blur-lg" />
            <Image
              src="/images/generated/seal-cut.png"
              alt=""
              width={300}
              height={300}
              className="h-auto w-full object-contain"
              style={{ filter: "drop-shadow(0 22px 36px rgba(0,0,0,0.55))" }}
              aria-hidden
            />
          </div>

          <div className="relative">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-lime-400/60">
              Acționează acum
            </p>
            <h2 className="mx-auto max-w-2xl font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
              Nu lăsa asigurătorul să decidă{" "}
              <em className="not-italic italic text-lime-400">cât valorează</em>{" "}
              mașina ta.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/45">
              Cere acum evaluarea ta. Un expert te contactează cu oferta în cel mai scurt timp.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/#situatii"
                className="inline-flex items-center gap-2 rounded-xl bg-lime-500 px-8 py-4 text-sm font-bold text-[#07101f] transition-all hover:bg-lime-400 hover:shadow-[0_0_32px_rgba(143,208,47,0.45)]"
              >
                Cere evaluarea ta <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={COMPANY.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10"
              >
                Sună acum: {COMPANY.phone}
              </a>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
