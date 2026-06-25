import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { Eyebrow } from "./ui";

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
}) {
  return (
    <section className="bg-navy-gradient text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight sm:text-5xl">
            {title}
          </h1>
          {subtitle && <p className="mt-4 max-w-2xl text-lg text-navy-200">{subtitle}</p>}
        </Reveal>
      </div>
    </section>
  );
}
