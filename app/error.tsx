"use client";

import Link from "next/link";
import { COMPANY } from "@/lib/products";
import { btnPrimary, btnOutline } from "@/components/ui";
import { Phone, ArrowRight } from "@/components/icons";

/**
 * Plasa de siguranță pentru orice eroare de randare. Fără ea, utilizatorul vedea
 * ecranul default Next („Application error”) — zero branding, zero cale de contact,
 * iar pentru un site de lead-gen fiecare astfel de ecran e un lead pierdut.
 */
export default function Error({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  // `reset` doar golește starea boundary-ului; `unstable_retry` chiar re-cere și
  // re-randează conținutul (docs Next 16, error.md). Cu `reset`, butonul părea inert.
  unstable_retry: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-surface text-3xl font-bold text-lime-300">
        !
      </span>
      <h1 className="mt-6 font-heading text-2xl font-bold text-navy-800 sm:text-3xl">
        Ceva n-a mers cum trebuie
      </h1>
      <p className="mt-3 leading-relaxed text-navy-600">
        A apărut o problemă tehnică la afișarea acestei pagini. Datele tale nu s-au pierdut.
        Încearcă din nou — dacă se repetă, sună-ne și rezolvăm pe loc.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button onClick={() => unstable_retry()} className={btnPrimary}>
          Încearcă din nou <ArrowRight className="h-4 w-4" />
        </button>
        <Link href="/" className={btnOutline}>Mergi la prima pagină</Link>
      </div>

      <a
        href={COMPANY.phoneHref}
        className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-xl bg-surface px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-surface-soft"
      >
        <Phone className="h-4 w-4 text-lime-400" /> {COMPANY.phone}
      </a>
      <p className="mt-3 text-xs text-navy-400">{COMPANY.hours}</p>
    </div>
  );
}
