"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Check, Shield, Car, FileText, Scale } from "./icons";

gsap.registerPlugin(useGSAP);

const situations = [
  { label: "Asigurătorul mi-a oferit prea puțin", href: "/produs/evaluare-despagubiri-cuvenite", Icon: Scale },
  { label: "Mașina e daună totală sau epavă", href: "/produs/evaluare-autovehicul-la-data-accidentului", Icon: Car },
  { label: "Am reparat-o, dar valorează mai puțin acum", href: "/produs/evaluare-devalorizare-autovehicul-dupa-accident", Icon: FileText },
];

/* Floating value tags positioned around the car (real HTML — crisp, not AI). */
const valueTags = [
  { v: "18.400 lei", l: "valoare reală", top: "16%", left: "6%", accent: true },
  { v: "14.200 lei", l: "ofertă asig.", top: "60%", left: "2%", accent: false },
  { v: "AUDATEX", l: "sistem oficial", top: "78%", left: "44%", accent: false },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        "[data-h='car']",
        { opacity: 0, x: 70, y: 10 },
        { opacity: 1, x: 0, y: 0, duration: 1.4, ease: "power3.out", delay: 0.1 }
      );
      gsap.fromTo(
        "[data-h='tag']",
        { opacity: 0, y: 18, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.5)", stagger: 0.13, delay: 0.95 }
      );
      gsap.fromTo(
        "[data-h='calc']",
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.4)", delay: 1.05 }
      );
      gsap.to("[data-h='car']", {
        y: -14,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.5,
      });

      // Count-up: +4.200 → cifra crește de la 0
      const valEl = root.current?.querySelector<HTMLElement>("[data-count-val]");
      if (valEl) {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: 4200,
          duration: 1.6,
          delay: 1.3,
          ease: "power2.out",
          onUpdate() {
            valEl.textContent = "+" + Math.round(obj.v).toLocaleString("ro-RO");
          },
        });
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 });
      tl.fromTo("[data-h='badge']", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo("[data-h='title']", { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 1.0 }, "-=0.3")
        .fromTo("[data-h='sub']", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.55")
        .fromTo("[data-h='cta']", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.45")
        .fromTo("[data-h='chips']", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35");
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative min-h-dvh overflow-hidden bg-surface">

      {/* ── Background glows ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[700px] w-[700px] bg-[radial-gradient(ellipse_at_top_right,rgba(143,208,47,0.08)_0%,transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-surface to-transparent" />
      </div>

      {/* ═══════════════════════════════════════════
          RIGHT: transparent car (true cutout) floats
      ═══════════════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] lg:block">
        {/* Lime ground glow under the car */}
        <div className="absolute bottom-[18%] left-1/2 h-24 w-[70%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(143,208,47,0.28)_0%,transparent_70%)] blur-xl" />
        {/* Ambient halo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_45%,rgba(143,208,47,0.07)_0%,transparent_55%)]" />

        <div className="absolute inset-0 flex items-center justify-center px-8">
          <div data-h="car" className="relative w-full max-w-[760px]">
            <Image
              src="/images/generated/car-cutout.png"
              alt="Evaluare auto CarEval — autovehicul expertizat"
              width={980}
              height={560}
              className="h-auto w-full object-contain"
              style={{ filter: "drop-shadow(0 30px 45px rgba(0,0,0,0.55))" }}
              priority
            />

            {/* Floating value tags around the car */}
            {valueTags.map((t) => (
              <div
                key={t.v}
                data-h="tag"
                className={`absolute flex flex-col rounded-xl border px-3 py-2 backdrop-blur-md ${
                  t.accent
                    ? "border-lime-400/30 bg-lime-400/[0.12] shadow-[0_8px_24px_rgba(143,208,47,0.18)]"
                    : "border-white/10 bg-surface-soft/80 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
                }`}
                style={{ top: t.top, left: t.left }}
              >
                <span
                  className={`font-heading text-base font-bold leading-none ${
                    t.accent ? "text-lime-400" : "text-white"
                  }`}
                >
                  {t.v}
                </span>
                <span className="mt-1 text-[9px] uppercase tracking-wider text-white/40">{t.l}</span>
                {/* connector dot */}
                <span
                  className={`absolute -bottom-1 left-4 h-2 w-2 rounded-full ${
                    t.accent ? "bg-lime-400" : "bg-white/30"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FLOATING CALC CARD — top right ── */}
      <div
        data-h="calc"
        className="absolute right-[3%] top-[20%] z-30 hidden w-[212px] overflow-hidden rounded-2xl border border-white/10 bg-surface-soft/95 shadow-[0_24px_60px_rgba(0,0,0,0.75)] backdrop-blur-xl lg:block"
        style={{ transform: "perspective(900px) rotateY(-9deg) rotateX(4deg)" }}
      >
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-lime-400" />
            <p className="text-[9px] font-bold uppercase tracking-widest text-lime-400/75">
              Calcul despăgubire
            </p>
          </div>
          <p className="mt-2.5 font-heading text-[1.7rem] font-bold leading-none text-white">
            <span data-count-val>+4.200</span>
            <span className="ml-1 text-xs font-normal text-white/30">lei</span>
          </p>
          <p className="mt-0.5 text-[10px] text-white/30">față de oferta inițială</p>
          <div className="my-3 h-px bg-white/[0.06]" />
          {(
            [
              ["Ofertă asigurător", "14.200 lei", false],
              ["Valoare reală", "18.400 lei", false],
              ["Recuperat", "+4.200 lei", true],
            ] as const
          ).map(([k, v, accent]) => (
            <div key={k} className="mt-1.5 flex justify-between text-[11px]">
              <span className="text-white/30">{k}</span>
              <span className={`font-semibold ${accent ? "text-lime-400" : "text-white"}`}>{v}</span>
            </div>
          ))}
          <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-lime-400/10 px-2.5 py-2">
            <Check className="h-3.5 w-3.5 shrink-0 text-lime-400" />
            <span className="text-[10px] font-semibold text-lime-400">cu raport CarEval</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          LEFT: Marketing copy
      ═══════════════════════════════════════════ */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-dvh flex-col justify-start pt-8 pb-16 lg:pt-12 lg:max-w-[46%]">

          <div
            data-h="badge"
            className="mb-7 inline-flex w-fit items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-400" />
            <span className="text-xs font-medium text-white/55">
              Expert tehnic judiciar autorizat · Giroc, Timiș
            </span>
          </div>

          <h1
            data-h="title"
            className="font-heading text-[clamp(2.35rem,8vw,5.4rem)] font-bold leading-[1.03] tracking-tight text-white"
          >
            Nu lăsa
            <br />
            asigurătorul
            <br />
            să decidă{" "}
            <em className="not-italic italic text-lime-400">cât</em>
            <br />
            <em className="not-italic italic text-lime-400">valorează</em>
            <br />
            mașina ta.
          </h1>

          <p data-h="sub" className="mt-6 max-w-[390px] text-[1.05rem] leading-relaxed text-white/55">
            Evaluare auto &amp; expertiză judiciară în{" "}
            <strong className="text-white/85">24–48h, 100% online</strong>. Cifre
            din AUDATEX &amp; DAT — argumentul solid față de orice asigurător.
          </p>

          <div data-h="cta" className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/#situatii"
              className="inline-flex items-center gap-2 rounded-xl bg-lime-500 px-8 py-4 text-sm font-bold text-[#07101f] transition-all hover:bg-lime-400 hover:shadow-[0_0_44px_rgba(143,208,47,0.55)]"
            >
              Cere evaluarea acum <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/cum-functioneaza"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/[0.10]"
            >
              Cum funcționează
            </Link>
          </div>

          {/* Mobile / tabletă: mașina 3D + card calcul + tag-uri (pe desktop sunt pe dreapta) */}
          <div className="mt-10 lg:hidden">
            {/* Card calcul despăgubire */}
            <div
              data-h="calc"
              className="mx-auto mb-6 w-full max-w-[300px] overflow-hidden rounded-2xl border border-white/10 bg-surface-soft/95 shadow-[0_24px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl"
            >
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-lime-400" />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-lime-400/75">Calcul despăgubire</p>
                </div>
                <p className="mt-2.5 font-heading text-[1.7rem] font-bold leading-none text-white">
                  +4.200<span className="ml-1 text-xs font-normal text-white/30">lei</span>
                </p>
                <p className="mt-0.5 text-[10px] text-white/30">față de oferta inițială</p>
                <div className="my-3 h-px bg-white/[0.06]" />
                {(
                  [
                    ["Ofertă asigurător", "14.200 lei", false],
                    ["Valoare reală", "18.400 lei", false],
                    ["Recuperat", "+4.200 lei", true],
                  ] as const
                ).map(([k, v, accent]) => (
                  <div key={k} className="mt-1.5 flex justify-between text-[11px]">
                    <span className="text-white/30">{k}</span>
                    <span className={`font-semibold ${accent ? "text-lime-400" : "text-white"}`}>{v}</span>
                  </div>
                ))}
                <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-lime-400/10 px-2.5 py-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-lime-400" />
                  <span className="text-[10px] font-semibold text-lime-400">cu raport CarEval</span>
                </div>
              </div>
            </div>

            {/* Mașina cu tag-urile de valoare în jur */}
            <div className="relative mx-auto w-full max-w-[460px]">
              <div className="absolute bottom-3 left-1/2 h-16 w-[68%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(143,208,47,0.30)_0%,transparent_70%)] blur-xl" />
              <Image
                src="/images/generated/car-cutout.png"
                alt="Evaluare auto CarEval — autovehicul expertizat"
                width={980}
                height={560}
                className="relative h-auto w-full object-contain"
                style={{ filter: "drop-shadow(0 26px 40px rgba(0,0,0,0.55))" }}
              />
              {valueTags.map((t) => (
                <div
                  key={t.v}
                  data-h="tag"
                  className={`absolute flex flex-col rounded-xl border px-3 py-2 backdrop-blur-md ${
                    t.accent
                      ? "border-lime-400/30 bg-lime-400/[0.12] shadow-[0_8px_24px_rgba(143,208,47,0.18)]"
                      : "border-white/10 bg-surface-soft/85 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
                  }`}
                  style={{ top: t.top, left: t.left }}
                >
                  <span className={`font-heading text-sm font-bold leading-none ${t.accent ? "text-lime-400" : "text-white"}`}>
                    {t.v}
                  </span>
                  <span className="mt-1 text-[8px] uppercase tracking-wider text-white/40">{t.l}</span>
                  <span className={`absolute -bottom-1 left-4 h-2 w-2 rounded-full ${t.accent ? "bg-lime-400" : "bg-white/30"}`} />
                </div>
              ))}
            </div>
          </div>

          <div data-h="chips" className="mt-10 border-t border-white/[0.07] pt-7">
            <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.22em] text-white/30">
              Alege situația ta
            </p>
            <div className="grid grid-cols-1 gap-3 max-w-2xl sm:grid-cols-3 sm:gap-4">
              {situations.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  className="group flex flex-col gap-4 rounded-2xl border border-white/[0.14] bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-5 backdrop-blur-sm transition-all duration-200 hover:border-lime-400/50 hover:from-lime-400/[0.12] hover:to-lime-400/[0.05] hover:shadow-[0_0_40px_rgba(143,208,47,0.12)]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/15 transition-colors group-hover:bg-lime-400/30">
                    <s.Icon className="h-5 w-5 text-lime-400" />
                  </span>
                  <div className="flex flex-1 flex-col justify-between gap-3">
                    <span className="text-sm font-semibold leading-snug text-white/75 transition-colors group-hover:text-white">{s.label}</span>
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] text-lime-400/50 transition-colors group-hover:text-lime-400">
                      <span>Vezi</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
