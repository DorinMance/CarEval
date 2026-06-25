import Link from "next/link";
import type { ReactNode } from "react";

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 btn-shimmer rounded-xl bg-lime-500 px-6 py-3 text-sm font-semibold text-navy-900 shadow-[0_10px_30px_-10px_rgba(143,208,47,0.6)] transition-all hover:bg-lime-400 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2";

export const btnDark =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-navy-800 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-navy-700 hover:-translate-y-0.5 active:translate-y-0";

export const btnOutline =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-navy-200 bg-white px-6 py-3 text-sm font-semibold text-navy-800 transition-all hover:border-navy-300 hover:bg-cloud";

export const btnGhostLight =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10";

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
        light ? "bg-white/10 text-lime-300" : "bg-lime-100 text-lime-700"
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
      {children}
    </span>
  );
}

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function PriceTag({
  price,
  note,
  className,
}: {
  price: number | null;
  note?: string;
  className?: string;
}) {
  if (price == null) {
    return (
      <span className={cn("font-heading text-navy-800", className)}>
        {note ? `${note}` : "La cerere"}
      </span>
    );
  }
  return (
    <span className={cn("font-heading tabular-nums text-navy-800", className)}>
      {price.toLocaleString("ro-RO")}
      <span className="ml-1 text-sm font-medium text-navy-400">Lei</span>
    </span>
  );
}

export function LinkButton({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
