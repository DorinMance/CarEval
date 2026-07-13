"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";

/* Banner de consimțământ cookie-uri (GDPR + Legea 506/2004).
   Google Analytics se încarcă DOAR după „Accept”. */

const KEY = "careval_cookie_consent"; // "accepted" | "rejected"
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-MXMQZ04NEB";
const PROD = process.env.NODE_ENV === "production";

export function CookieConsent() {
  const [consent, setConsent] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setConsent(localStorage.getItem(KEY));
    } catch {
      /* localStorage indisponibil */
    }
    setReady(true);
  }, []);

  function choose(v: "accepted" | "rejected") {
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* ignore */
    }
    setConsent(v);
  }

  const loadGA = ready && consent === "accepted" && PROD && Boolean(GA_ID);
  const showBanner = ready && consent === null;

  return (
    <>
      {loadGA && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`,
            }}
          />
        </>
      )}

      {showBanner && (
        <div className="fixed inset-x-0 bottom-0 z-[100] px-3 pb-3 sm:px-4 sm:pb-4">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-white/10 bg-surface/95 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:flex-row sm:items-center">
            <p className="flex-1 text-sm text-white/75">
              Folosim cookie-uri strict necesare pentru funcționarea site-ului și, cu acordul tău,
              cookie-uri de analiză pentru a-l îmbunătăți. Detalii în{" "}
              <Link href="/politica-cookies" className="font-semibold text-lime-400 underline-offset-2 hover:underline">
                Politica de cookie-uri
              </Link>
              .
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => choose("rejected")}
                className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/[0.12]"
              >
                Doar necesare
              </button>
              <button
                type="button"
                onClick={() => choose("accepted")}
                className="rounded-xl bg-lime-500 px-5 py-2.5 text-sm font-bold text-navy-900 transition-colors hover:bg-lime-400"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
