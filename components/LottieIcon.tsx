"use client";

import { useEffect, useRef } from "react";
import lottie, { type AnimationItem } from "lottie-web";

/**
 * Iconiță Lottie reală, randată direct cu lottie-web (SVG, pur JS — fiabil cu React 19).
 * JSON-ul este extras din fișierele .lottie în /public/lottie/*.json.
 * Respectă prefers-reduced-motion (afișează primul cadru, fără buclă).
 */
export function LottieIcon({
  src,
  size = 72,
  loop = true,
  className = "",
}: {
  src: string;
  size?: number;
  loop?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: AnimationItem | undefined;
    let alive = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    fetch(src)
      .then((r) => r.json())
      .then((data) => {
        if (!alive || !ref.current) return;
        anim = lottie.loadAnimation({
          container: ref.current,
          renderer: "svg",
          loop: loop && !reduce,
          autoplay: !reduce,
          animationData: data,
        });
        if (reduce) anim.goToAndStop(0, true);
      })
      .catch(() => {});

    return () => {
      alive = false;
      anim?.destroy();
    };
  }, [src, loop]);

  return <div ref={ref} style={{ width: size, height: size }} className={className} aria-hidden="true" />;
}
