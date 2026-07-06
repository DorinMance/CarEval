"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useState } from "react";

/**
 * Animație Lottie (.lottie / optimized dotLottie) din /public/lottie/*.lottie.
 * Respectă prefers-reduced-motion (nu pornește autoplay).
 */
export function Lottie({
  src,
  size = 120,
  loop = true,
  className = "",
  style,
}: {
  src: string;
  size?: number;
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div style={{ width: size, height: size, ...style }} className={className} aria-hidden="true">
      <DotLottieReact src={src} loop={loop && !reduce} autoplay={!reduce} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
