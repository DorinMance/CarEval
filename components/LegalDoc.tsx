import type { ReactNode } from "react";
import { PageHero } from "./PageHero";
import { Section } from "./ui";

/* Layout + tipografie comună pentru paginile legale (confidențialitate, termeni, cookies). */

export function LegalDoc({
  eyebrow = "Informații legale",
  title,
  subtitle,
  updated,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <Section className="bg-white">
        <div className="mx-auto max-w-3xl">
          <p className="mb-8 text-sm text-navy-400">Ultima actualizare: {updated}</p>
          <div className="text-[15px] leading-relaxed text-navy-600">{children}</div>
        </div>
      </Section>
    </>
  );
}

export function LH2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mt-10 scroll-mt-24 font-heading text-xl font-bold text-navy-800">
      {children}
    </h2>
  );
}

export function LH3({ children }: { children: ReactNode }) {
  return <h3 className="mt-6 font-heading text-base font-semibold text-navy-800">{children}</h3>;
}

export function LP({ children }: { children: ReactNode }) {
  return <p className="mt-3">{children}</p>;
}

export function LUl({ children }: { children: ReactNode }) {
  return <ul className="mt-3 list-disc space-y-1.5 pl-5">{children}</ul>;
}

export function B({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-navy-800">{children}</strong>;
}
