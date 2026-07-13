"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Check } from "@/components/icons";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function CompareCard() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      const el = ref.current;
      if (!el) return;

      const items = el.querySelectorAll("[data-c]");
      gsap.set(items, { opacity: 0, y: 16 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.18,
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      className="absolute bottom-0 left-1/2 w-[min(320px,86vw)] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0a1626]/90 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl"
      style={{ transform: "perspective(1000px) rotateX(6deg)" }}
    >
      <p data-c className="mb-3 text-[10px] font-bold uppercase tracking-wider text-lime-400/75">
        Ce conține raportul
      </p>
      <ul className="flex flex-col gap-2">
        {[
          "Valoare de piață la data accidentului",
          "Deviz de reparație AUDATEX / DAT",
          "Valoare reziduală",
          "Metodologie, surse și date de referință",
        ].map((item) => (
          <li key={item} data-c className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime-400" />
            <span className="text-[13px] leading-snug text-white/85">{item}</span>
          </li>
        ))}
      </ul>
      <div data-c className="mt-3 rounded-xl border border-lime-400/15 bg-lime-400/[0.08] px-3.5 py-2">
        <span className="text-[12px] font-medium leading-snug text-white/70">
          Cifre verificabile în aceleași sisteme folosite de industrie.
        </span>
      </div>
    </div>
  );
}
