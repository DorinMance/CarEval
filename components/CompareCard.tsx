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
      className="absolute bottom-0 left-1/2 w-[320px] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0a1626]/90 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl"
      style={{ transform: "perspective(1000px) rotateX(6deg)" }}
    >
      <p data-c className="mb-3 text-[10px] font-bold uppercase tracking-wider text-lime-400/75">
        Diferența pe care o recuperezi
      </p>
      <div data-c className="flex items-center gap-3">
        <div className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] p-2.5 text-center">
          <p className="text-[10px] text-white/35">Ofertă asig.</p>
          <p className="font-heading text-base font-bold text-white">14.200 lei</p>
        </div>
        <div className="text-white/25">→</div>
        <div className="flex-1 rounded-xl border border-lime-400/25 bg-lime-400/[0.1] p-2.5 text-center">
          <p className="text-[10px] text-lime-400/75">Valoare reală</p>
          <p className="font-heading text-base font-bold text-lime-400">18.400 lei</p>
        </div>
      </div>
      <div data-c className="mt-3 flex items-center gap-2 rounded-xl border border-lime-400/15 bg-lime-400/[0.08] px-3.5 py-2">
        <Check className="h-4 w-4 shrink-0 text-lime-400" />
        <span className="text-[13px] font-semibold text-white">
          cifre AUDATEX — imposibil de contestat
        </span>
      </div>
    </div>
  );
}
