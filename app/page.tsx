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
    title: "Vreau să verific suma din dosar",
    desc: "Recalculăm paguba în AUDATEX/DAT și o comparăm cu suma din dosar. Dacă cifrele coincid, raportul o confirmă. Dacă apar diferențe, le documentează — cu metodă și surse.",
    href: "/produs/evaluare-despagubiri-cuvenite",
    stat: "Cifre verificabile",
    statLabel: "",
  },
  {
    Icon: Scale,
    label: "Daună totală",
    title: "Mașina e declarată daună totală",
    desc: "Stabilim valoarea mașinii la data exactă a accidentului — cifra de la care pornește întregul calcul.",
    href: "/produs/evaluare-autovehicul-la-data-accidentului",
    stat: "Esențial",
    statLabel: "la daună totală",
  },
  {
    Icon: FileText,
    label: "Devalorizare",
    title: "Am reparat-o — cât mai valorează?",
    desc: "O mașină accidentată pierde din valoare chiar și după reparație completă. Documentăm această diferență, cu cifre.",
    href: "/produs/evaluare-devalorizare-autovehicul-dupa-accident",
    stat: "Documentat",
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
    text: "Raport PDF autorizat de expert tehnic, pe email, în 24–48h. Fără deplasări.",
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
    text: "Rapoartele sunt semnate de Dr. Ing. Kulcsar Raul Miklos, expert tehnic autorizat de Ministerul Justiției, cu peste 1.500 de expertize realizate în 11 ani de practică.",
  },
  {
    Icon: Scale,
    title: "Cifre, nu estimări",
    text: "Calculăm în AUDATEX și DAT, sistemele folosite de întreaga industrie. Fiecare valoare din raport are o sursă, o metodă și o dată de referință.",
  },
  {
    Icon: Zap,
    title: "Rapid & online",
    text: "Încarci documentele și fotografiile de pe telefon. Raportul vine în 24–48h. Când un caz necesită inspecție fizică, îți spunem din start.",
  },
  {
    Icon: Scale,
    title: "Independență",
    text: (
      <>
        Realizăm expertize pentru persoane fizice, flote, service-uri, asigurători
        și instanțe. Metodologia este aceeași, indiferent cine solicită raportul.{" "}
        <strong className="font-semibold text-white/70">
          Onorariul este fix și nu depinde de rezultatul obținut.
        </strong>
      </>
    ),
  },
];

// Recenzii reale, publice, de pe Google (nume prescurtat, fără dată).
const testimonials = [
  {
    name: "Anca M.",
    city: "Recenzie Google",
    saved: "Raport complet",
    stars: 5,
    text: "Evaluarea autovehiculului prin CarEval a fost o experiență eficientă și benefică. Raportul complet mi-a furnizat toate detaliile necesare, economisindu-mi timp.",
  },
  {
    name: "Andrei V.",
    city: "Recenzie Google",
    saved: "Experiență pozitivă",
    stars: 5,
    text: "Am avut recent o experiență extrem de pozitivă cu CarEval și doresc să împărtășesc impresiile mele cu voi.",
  },
  {
    name: "Corina M.",
    city: "Recenzie Google",
    saved: "Ajutor la nevoie",
    stars: 5,
    text: "Recomand CarEval! Pachetul de evaluare costuri reparații și evaluare auto la data accidentului m-au ajutat atunci când am avut nevoie! Mulțumesc!",
  },
  {
    name: "Iulian L.",
    city: "Recenzie Google",
    saved: "Profesionalism",
    stars: 5,
    text: "Profesioniști în evaluarea mașinii. Personal foarte calificat! Recomand.",
  },
];

const stats = [
  { v: "24–48h", l: "livrare raport" },
  { v: "100%", l: "online, fără deplasare" },
  { v: "AUDATEX & DAT", l: "sisteme oficiale" },
  { v: "AUTORIZAT", l: "Expert Tehnic Judiciar" },
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
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-surface">
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
                fiecare cifră{" "}
                <em className="not-italic italic text-lime-400">contează.</em>
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/50">
                Valoarea unei mașini avariate nu este o chestiune de opinie. Se
                calculează: an de fabricație, kilometraj, dotări, starea de dinaintea
                evenimentului, costul real al reparației la data accidentului,
                valoarea reziduală.
              </p>
              <p className="mt-3 max-w-lg text-lg leading-relaxed text-white/50">
                Fără acest calcul, discuția rămâne între estimări — iar o estimare nu
                se susține nici în negociere, nici în instanță.
              </p>
              <p className="mt-3 max-w-lg text-lg leading-relaxed text-white/50">
                CarEval îți pune la dispoziție o{" "}
                <strong className="text-white/80">expertiză tehnică extrajudiciară</strong>{" "}
                — cifre calculate în sistemele oficiale ale industriei, cu metodologia
                atașată, verificabile de oricine — de tine, de asigurător, de instanță.
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
                  src="/images/generated/accident-cut.png?v=4"
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
                de expert autorizat.
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/50">
                Lucrăm în AUDATEX și DAT — aceleași sisteme folosite de asigurători,
                de service-urile autorizate și de experții numiți de instanță. Când
                toată lumea vorbește aceeași limbă tehnică, discuția e despre cifre,
                nu despre păreri.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["AUDATEX", "DAT", "Expert autorizat", "100% online"].map((tag) => (
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
              Evaluare și expertiză tehnică extrajudiciară, cu raport autorizat și preț transparent.
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

          {/* Distincție verificabilă — link către profilul public Targetare.ro */}
          <Reveal className="mt-12 flex justify-center">
            <a
              href="https://targetare.ro/41683750/vast-expertise-srl"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex max-w-md items-center gap-4 rounded-2xl border border-lime-400/20 bg-white/[0.04] px-5 py-4 transition-colors hover:border-lime-400/45 hover:bg-white/[0.07]"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-lime-400/20 bg-lime-400/[0.10]">
                <Award className="h-5 w-5 text-lime-400" />
              </span>
              <span className="text-left">
                <span className="block text-sm font-semibold text-white">
                  Locul 3 · Targetare.ro AWARDS 2024
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-white/45">
                  {COMPANY.legal}, Timiș — și Locul 9 în 2023. Vezi profilul public.
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-lime-400/60 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════
          INDEPENDENȚĂ — strip on-brand
      ════════════════════════════════════ */}
      <Section className="bg-surface pt-0">
        <Reveal className="overflow-hidden rounded-3xl border border-lime-400/15 bg-white/[0.03] px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl border-l-2 border-lime-400/50 pl-5">
              <p className="text-base leading-relaxed text-white/60">
                Realizăm expertize tehnice atât pentru persoane fizice, cât și pentru
                asigurători, flote, service-uri și instanțe. Metodologia, sistemele de
                calcul și standardul raportului sunt identice, indiferent de beneficiar.
              </p>
              <p className="mt-3 text-base leading-relaxed text-white/80">
                Onorariile sunt fixe și nu depind de rezultatul obținut. Nu garantăm
                sume și nu reprezentăm juridic nicio parte.
              </p>
            </div>
            <Link
              href="/independenta"
              className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-lime-400 hover:text-lime-300"
            >
              Vezi cum lucrăm independent <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </Section>

      {/* ════════════════════════════════════
          TESTIMONIALE
      ════════════════════════════════════ */}
      <Section className="bg-white">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Ce spun clienții</Eyebrow>
          <h2 className="mt-4 font-heading text-3xl font-bold text-navy-800 sm:text-4xl">
            Ce spun clienții
          </h2>
        </Reveal>

        <Reveal stagger className="mt-12 grid gap-6 sm:grid-cols-2">
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
          <div className="relative">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-lime-400/60">
              Acționează acum
            </p>
            <h2 className="mx-auto max-w-2xl font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
              Înainte să accepți o sumă,{" "}
              <em className="not-italic italic text-lime-400">verifică cifrele.</em>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/45">
              Cere raportul. Dacă suma din dosar este corectă, raportul o confirmă — și
              știi că ai luat decizia potrivită. Dacă nu, ai documentul care arată
              diferența.
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
