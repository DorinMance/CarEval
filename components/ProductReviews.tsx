"use client";

import { useMemo, useRef, useState } from "react";
import { useApprovedReviews, submitReview } from "@/lib/reviews";
import { Section, Eyebrow, cn } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { Star, Check, Quote, Spinner } from "@/components/icons";

/** Rând de stele. `value` = câte pline (1..5). Interactiv dacă `onPick` e dat. */
function Stars({
  value,
  onPick,
  size = "h-5 w-5",
}: {
  value: number;
  onPick?: (n: number) => void;
  size?: string;
}) {
  const [hover, setHover] = useState(0);
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = (hover || value) >= n;
        return onPick ? (
          <button
            key={n}
            type="button"
            aria-label={`${n} ${n === 1 ? "stea" : "stele"}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            onClick={() => onPick(n)}
            className="grid min-h-11 min-w-11 place-items-center rounded-lg p-1.5 transition-transform hover:scale-110 focus-visible:scale-110"
          >
            <Star className={cn(size, active ? "text-amber-400" : "text-navy-200")} />
          </button>
        ) : (
          <Star key={n} className={cn(size, active ? "text-amber-400" : "text-navy-200")} />
        );
      })}
    </span>
  );
}

export function ProductReviews({ slug, productName }: { slug: string; productName: string }) {
  const reviews = useApprovedReviews(slug);

  const { avg, count } = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, count: 0 };
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    return { avg: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
  }, [reviews]);

  // Formular
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);
  // Anti-spam ușor: câmp-capcană (honeypot) + momentul montării formularului.
  const [hp, setHp] = useState("");
  const mountedAt = useRef(Date.now());
  const THROTTLE_MS = 30_000; // o recenzie la 30s de pe același dispozitiv

  async function trimite() {
    if (state === "sending") return;
    // Boți: capcana completată SAU formular trimis suspect de repede → ieșim
    // tăcut (le arătăm „succes", dar nu salvăm nimic).
    if (hp || Date.now() - mountedAt.current < 2000) {
      setState("sent");
      return;
    }
    if (author.trim().length < 2) return setErr("Te rugăm să-ți scrii numele.");
    if (rating < 1) return setErr("Alege un punctaj (1–5 stele).");
    if (text.trim().length < 10) return setErr("Scrie câteva cuvinte despre experiența ta (minim 10 caractere).");
    try {
      const last = Number(localStorage.getItem("careval_review_last") || 0);
      if (Date.now() - last < THROTTLE_MS) {
        return setErr("Ai trimis deja o recenzie recent. Mai încearcă în câteva momente.");
      }
    } catch { /* localStorage indisponibil — continuăm */ }
    setErr(null);
    setState("sending");
    try {
      await submitReview({ productSlug: slug, author, rating, text });
      try { localStorage.setItem("careval_review_last", String(Date.now())); } catch { /* ok */ }
      setState("sent");
      setAuthor("");
      setRating(0);
      setText("");
    } catch {
      setState("error");
      setErr("Nu am putut trimite recenzia. Încearcă din nou.");
    }
  }

  return (
    <Section className="bg-cloud">
      <Reveal className="mx-auto mb-8 max-w-3xl text-center">
        <Eyebrow>Recenzii</Eyebrow>
        <h2 className="mt-4 font-heading text-3xl font-bold text-navy-800">Ce spun clienții</h2>
        {count > 0 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <Stars value={Math.round(avg)} />
            <span className="font-heading text-lg font-bold text-navy-800">{avg.toFixed(1)}</span>
            <span className="text-sm text-navy-400">
              ({count} {count === 1 ? "recenzie" : "recenzii"})
            </span>
          </div>
        )}
      </Reveal>

      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.3fr_1fr]">
        {/* Lista recenziilor aprobate */}
        <div className="space-y-4">
          {reviews.length === 0 && (
            <div className="grid place-items-center rounded-2xl border border-dashed border-navy-200 bg-white p-10 text-center text-navy-400">
              Încă nu sunt recenzii publicate. Fii primul care lasă una!
            </div>
          )}
          {reviews.map((r) => (
            <article key={r.id} className="rounded-2xl border border-mist bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy-800 font-heading text-sm font-bold text-lime-300">
                    {r.author.trim().charAt(0).toUpperCase() || "?"}
                  </span>
                  <div>
                    <p className="font-heading font-semibold text-navy-800">{r.author}</p>
                    <Stars value={r.rating} size="h-4 w-4" />
                  </div>
                </div>
                <time className="shrink-0 text-xs text-navy-400">
                  {new Date(r.createdAt).toLocaleDateString("ro-RO", { dateStyle: "medium" })}
                </time>
              </div>
              <div className="mt-3 flex gap-2 text-navy-600">
                <Quote className="h-4 w-4 shrink-0 text-lime-500" />
                <p className="text-sm leading-relaxed">{r.text}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Formular de recenzie */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-mist bg-white p-6">
            {state === "sent" ? (
              <div className="flex flex-col items-center py-6 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-lime-100 text-lime-600">
                  <Check className="h-7 w-7" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-navy-800">Mulțumim!</h3>
                <p className="mt-1 text-sm text-navy-500">
                  Recenzia ta a fost trimisă și va apărea pe site după ce este verificată.
                </p>
                <button
                  type="button"
                  onClick={() => setState("idle")}
                  className="mt-4 text-sm font-semibold text-lime-600 hover:text-lime-700"
                >
                  Scrie altă recenzie
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-heading text-lg font-bold text-navy-800">Lasă o recenzie</h3>
                <p className="mt-1 text-sm text-navy-400">Pentru „{productName}". Nu ai nevoie de cont.</p>

                <div className="mt-4 space-y-3">
                  {/* Capcană anti-spam: invizibilă pentru oameni, completată doar de boți. */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  />
                  <div>
                    <label htmlFor="rev-nume" className="mb-1 block text-xs font-medium text-navy-500">Numele tău</label>
                    <input
                      id="rev-nume"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      maxLength={80}
                      className="w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-lime-400"
                      placeholder="ex. Andrei M."
                    />
                  </div>

                  <div>
                    <span className="mb-1 block text-xs font-medium text-navy-500">Punctaj</span>
                    <Stars value={rating} onPick={setRating} size="h-7 w-7" />
                  </div>

                  <div>
                    <label htmlFor="rev-text" className="mb-1 block text-xs font-medium text-navy-500">Recenzia ta</label>
                    <textarea
                      id="rev-text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      maxLength={1500}
                      rows={4}
                      className="w-full resize-none rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-lime-400"
                      placeholder="Cum a fost experiența ta cu acest serviciu?"
                    />
                  </div>

                  {err && <p className="text-sm font-medium text-danger">{err}</p>}

                  <button
                    type="button"
                    onClick={trimite}
                    disabled={state === "sending"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-lime-500 px-4 py-3 text-sm font-semibold text-navy-900 transition-colors hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {state === "sending" && <Spinner className="h-4 w-4 animate-spin" />}
                    {state === "sending" ? "Se trimite…" : "Trimite recenzia"}
                  </button>
                  <p className="text-center text-[11px] text-navy-400">
                    Recenziile sunt verificate înainte de publicare.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
