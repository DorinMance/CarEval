"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { Section, btnPrimary, btnOutline } from "@/components/ui";
import { COMPANY } from "@/lib/products";
import { Check, Phone, ArrowRight } from "@/components/icons";

type State = "in_asteptare" | "platit" | "esuat" | "necunoscut";

/**
 * Revenirea din pagina de plată NETOPIA.
 *
 * Confirmarea reală vine prin IPN (server-la-server), care poate ajunge cu o
 * fracțiune de secundă mai târziu decât browserul. De aceea pagina interoghează
 * scurt starea în loc să declare din prima că plata a eșuat.
 */
export function RezultatClient({ orderID }: { orderID: string }) {
  const [state, setState] = useState<State>("in_asteptare");
  const [tries, setTries] = useState(0);
  const { clear } = useCart();
  const golit = useRef(false);

  const MAX_TRIES = 20;

  // Coșul se golește AICI, o singură dată, abia când plata e confirmată — nu la
  // pornirea plății. Astfel, cine renunță pe pagina băncii își regăsește coșul.
  useEffect(() => {
    if (state === "platit" && !golit.current) {
      golit.current = true;
      clear();
    }
  }, [state, clear]);

  useEffect(() => {
    if (!orderID || state === "platit" || state === "esuat" || tries > MAX_TRIES) return;
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/plata/status?orderID=${encodeURIComponent(orderID)}`, { cache: "no-store" });
        const d = await r.json();
        if (d?.state && d.state !== "necunoscut") setState(d.state as State);
      } catch { /* reîncercăm */ }
      setTries((n) => n + 1);
    }, tries === 0 ? 400 : 1500);
    return () => clearTimeout(t);
  }, [orderID, state, tries]);

  const asteapta = state === "in_asteptare" && tries <= MAX_TRIES;
  // Expirarea sondării NU înseamnă eșec: confirmarea de la NETOPIA poate întârzia.
  // A-i spune „plata a eșuat" cuiva care tocmai a plătit e cea mai gravă eroare
  // posibilă aici — ar suna la bancă sau ar plăti a doua oară.
  const neconfirmat = state !== "platit" && state !== "esuat" && !asteapta;

  return (
    <Section className="bg-mesh-light min-h-[70vh]">
      <div className="mx-auto max-w-xl text-center">
        {state === "platit" ? (
          <>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-lime-500 text-navy-900">
              <Check className="h-8 w-8" />
            </span>
            <h1 className="mt-6 font-heading text-3xl font-bold text-navy-800">Plata a fost confirmată</h1>
            <p className="mt-3 leading-relaxed text-navy-600">
              Îți mulțumim! Am primit plata și comanda a intrat în lucru. Factura îți va fi trimisă
              pe email, iar un expert te contactează în cel mai scurt timp.
            </p>
          </>
        ) : asteapta ? (
          <>
            <span className="mx-auto grid h-16 w-16 animate-pulse place-items-center rounded-2xl bg-surface text-2xl font-bold text-lime-300">
              …
            </span>
            <h1 className="mt-6 font-heading text-2xl font-bold text-navy-800">Confirmăm plata</h1>
            <p className="mt-3 text-navy-600">Durează câteva secunde. Nu închide pagina.</p>
          </>
        ) : neconfirmat ? (
          <>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-surface text-3xl font-bold text-lime-300">
              ?
            </span>
            <h1 className="mt-6 font-heading text-2xl font-bold text-navy-800 sm:text-3xl">
              Încă așteptăm confirmarea
            </h1>
            <p className="mt-3 leading-relaxed text-navy-600">
              Banca nu ne-a trimis încă rezultatul. <strong className="text-navy-800">Nu relua plata</strong> —
              dacă suma a fost reținută, comanda e înregistrată și primești confirmarea pe email
              în câteva minute. Dacă vrei certitudine acum, sună-ne cu numărul comenzii de mai jos.
            </p>
          </>
        ) : (
          <>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-surface text-3xl font-bold text-lime-300">
              !
            </span>
            <h1 className="mt-6 font-heading text-2xl font-bold text-navy-800 sm:text-3xl">
              Plata nu a fost finalizată
            </h1>
            <p className="mt-3 leading-relaxed text-navy-600">
              Tranzacția a fost anulată sau refuzată de bancă. Nu ți s-a reținut nicio sumă.
              Poți încerca din nou sau ne poți suna și rezolvăm împreună.
            </p>
          </>
        )}

        {orderID && (
          <p className="mt-4 text-xs text-navy-400">
            Număr comandă: <span className="font-mono">{orderID}</span>
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {state === "platit" ? (
            <Link href="/" className={btnPrimary}>Înapoi la prima pagină <ArrowRight className="h-4 w-4" /></Link>
          ) : neconfirmat ? (
            <button type="button" onClick={() => setTries(0)} className={btnPrimary}>
              Verifică din nou <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <>
              <Link href="/cos" className={btnPrimary}>Încearcă din nou <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/" className={btnOutline}>Prima pagină</Link>
            </>
          )}
        </div>

        <a
          href={COMPANY.phoneHref}
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-xl bg-surface px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-surface-soft"
        >
          <Phone className="h-4 w-4 text-lime-400" /> {COMPANY.phone}
        </a>
      </div>
    </Section>
  );
}
