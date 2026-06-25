"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** animă copiii [data-reveal] cu stagger în loc de containerul însuși */
  stagger?: boolean;
  delay?: number;
  y?: number;
  /** slide lateral: negativ = din stânga, pozitiv = din dreapta */
  x?: number;
  as?: ElementType;
}

/**
 * Animație de intrare la scroll, GSAP + ScrollTrigger.
 * Respectă prefers-reduced-motion (vezi globals.css + check de mai jos).
 */
export function Reveal({
  children,
  className,
  stagger = false,
  delay = 0,
  y = 28,
  x = 0,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const el = ref.current;
      if (!el) return;

      const targets: Element[] = stagger
        ? Array.from(el.querySelectorAll("[data-reveal]"))
        : [el];
      if (!targets.length) return;

      if (reduce) {
        gsap.set(targets, { opacity: 1, y: 0, x: 0 });
        return;
      }

      gsap.set(targets, { opacity: 0, y, x });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 0.85,
        ease: "power3.out",
        delay,
        stagger: stagger ? 0.09 : 0,
        scrollTrigger: { trigger: el, start: "top 86%", once: true },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
