"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * "Iconiță 3D": glyph pe o placă cu gradient + adâncime, care plutește lent (GSAP).
 * Înlocuibilă ușor cu un <Lottie/> 3D mai târziu — același slot vizual.
 */
export function FloatIcon({
  children,
  className = "",
  delay = 0,
  size = 64,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.to(ref.current, {
        y: -8,
        rotateZ: 1.5,
        duration: 2.6,
        delay,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      className={`relative grid place-items-center rounded-2xl text-lime-300 shadow-[0_18px_40px_-18px_rgba(11,25,48,0.7)] ${className}`}
      style={{
        width: size,
        height: size,
        background:
          "linear-gradient(155deg, #14264a 0%, #0b1930 55%, #081222 100%)",
        border: "1px solid rgba(143,208,47,0.25)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "radial-gradient(120% 80% at 25% 15%, rgba(143,208,47,0.22), transparent 55%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
