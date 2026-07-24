"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { WizardStep } from "@/lib/products";
import { CONTACT_STEPS, MOTIV_RETRAGERE } from "@/lib/contact-form";
import { FieldInput, RoadProgress } from "./Wizard";
import { runValidation } from "./FormField";
import type { InputType } from "./FormField";
import { Lottie } from "./Lottie";
import { btnPrimary, btnOutline, cn } from "./ui";
import { ArrowRight, Check, Phone } from "./icons";
import { COMPANY } from "@/lib/products";

type Values = Record<string, string | boolean>;

/**
 * Formularul de contact, construit pe aceleași componente ca wizardul de comandă
 * (aceeași bară cu mașina, aceleași câmpuri și validări) — nu o a doua
 * implementare care ar diverge în timp.
 */
export function ContactWizard() {
  const steps: WizardStep[] = CONTACT_STEPS;
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [faza, setFaza] = useState<"form" | "trimit" | "gata">("form");
  const [eroare, setEroare] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const dirRef = useRef(1);

  const current = steps[step];
  const isSummary = current.id === "sumar";
  const esteRetragere = values.motiv === MOTIV_RETRAGERE;

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const panel = panelRef.current;
      if (!panel) return;
      const tl = gsap.timeline();
      tl.fromTo(panel, { opacity: 0, x: dirRef.current * 48 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" });
      const f = panel.querySelectorAll("[data-anim]");
      if (f.length) tl.fromTo(f, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" }, "-=0.32");
    },
    { dependencies: [step], scope: panelRef }
  );

  function setValue(name: string, v: string | boolean) {
    setValues((s) => ({ ...s, [name]: v }));
    setErrors((e) => ({ ...e, [name]: false }));
  }

  function validateStep(s: WizardStep): Record<string, boolean> {
    const errs: Record<string, boolean> = {};
    (s.fields ?? []).forEach((f) => {
      const v = values[f.name];
      const gol = v === undefined || v === null || v === "" || v === false;
      if (f.required && gol) { errs[f.name] = true; return; }
      if (typeof v === "string" && v.trim() && runValidation(f.type as InputType, v, f.required)) errs[f.name] = true;
    });
    return errs;
  }

  function primulInvalid(from: number, to: number): number {
    for (let i = from; i < to; i++) if (Object.keys(validateStep(steps[i])).length > 0) return i;
    return -1;
  }

  function marcheaza(i: number) {
    setErrors((e) => ({ ...e, ...validateStep(steps[i]) }));
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function next() {
    const errs = validateStep(current);
    if (Object.keys(errs).length) { setErrors((e) => ({ ...e, ...errs })); panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    dirRef.current = 1;
    setStep((s) => Math.min(s + 1, steps.length - 1));
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function back() { dirRef.current = -1; setStep((s) => Math.max(s - 1, 0)); }

  function jumpTo(i: number) {
    if (i === step) return;
    if (i > step) {
      const rau = primulInvalid(step, i);
      if (rau !== -1) { marcheaza(rau); dirRef.current = rau > step ? 1 : -1; setStep(rau); return; }
    }
    dirRef.current = i > step ? 1 : -1;
    setStep(i);
  }

  async function submit() {
    const rau = primulInvalid(0, steps.length - 1);
    if (rau !== -1) { marcheaza(rau); dirRef.current = -1; setStep(rau); return; }
    if (!consent) { setConsentError(true); return; }

    setFaza("trimit");
    setEroare("");
    try {
      const p = new URLSearchParams();
      p.append("form-name", "contact");
      p.append("motiv", String(values.motiv ?? ""));
      p.append("nume", String(values.nume ?? ""));
      p.append("telefon", String(values.telefon ?? ""));
      p.append("email", String(values.email ?? ""));
      p.append("localitate", String(values.localitate ?? ""));
      p.append("mesaj", String(values.mesaj ?? ""));
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: p.toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      setFaza("gata");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFaza("form");
      setEroare("Nu am putut trimite mesajul. Încearcă din nou sau sună-ne direct.");
    }
  }

  if (faza === "gata") {
    return (
      <div className="rounded-2xl border border-mist bg-white p-8 text-center shadow-[0_2px_16px_rgba(11,25,48,0.05)]">
        <Lottie src="/lottie/success-check.lottie" size={140} loop={false} className="mx-auto" />
        <h2 className="mt-2 font-heading text-2xl font-bold text-navy-800">Mesajul a fost trimis</h2>
        <p className="mt-3 leading-relaxed text-navy-600">
          {esteRetragere
            ? "Am înregistrat cererea de retragere. Te contactăm în cel mult 24 de ore lucrătoare pentru confirmare și pentru pașii de restituire."
            : "Îți răspundem în cel mult 24 de ore lucrătoare. Dacă e urgent, sună-ne."}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className={btnPrimary}>Înapoi la prima pagină <ArrowRight className="h-4 w-4" /></Link>
          <a href={COMPANY.phoneHref} className={btnOutline}><Phone className="h-4 w-4" /> {COMPANY.phone}</a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-mist bg-white shadow-[0_2px_16px_rgba(11,25,48,0.05)]">
      <RoadProgress steps={steps} step={step} onJump={jumpTo} />

      <div ref={panelRef} className="p-5 sm:p-7">
        <h3 className="font-heading text-xl font-bold text-navy-800">{current.title}</h3>
        {current.subtitle && <p className="mt-1 text-sm text-navy-500">{current.subtitle}</p>}

        {(current.fields ?? []).some((f) => errors[f.name]) && (
          <div role="alert" className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <span aria-hidden="true" className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-500 text-xs font-bold text-white">!</span>
            Verifică datele marcate cu roșu ca să poți continua.
          </div>
        )}

        {/* Lămurire pentru dreptul de retragere, exact unde e nevoie de ea. */}
        {esteRetragere && step === 0 && (
          <div data-anim className="mt-4 rounded-xl border border-lime-300 bg-lime-50 p-4 text-sm leading-relaxed text-navy-700">
            Ai <strong>14 zile</strong> pentru a te retrage din contract, conform OUG 34/2014.
            Dacă lucrarea a început deja la cererea ta expresă, se reține contravaloarea
            serviciilor prestate până la momentul retragerii. Detalii în{" "}
            <Link href="/politica-anulare" className="font-semibold text-lime-700 underline underline-offset-2">
              politica de anulare
            </Link>.
          </div>
        )}

        {!isSummary ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {(current.fields ?? []).map((f) => (
              <FieldInput key={f.name} field={f} value={values[f.name]} error={errors[f.name]} onChange={(v) => setValue(f.name, v)} />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <dl className="divide-y divide-mist rounded-xl border border-mist">
              {steps.flatMap((s) => s.fields ?? []).map((f) => {
                const v = values[f.name];
                if (v === undefined || v === "" || v === false) return null;
                return (
                  <div key={f.name} data-anim className="flex gap-4 px-4 py-3 text-sm">
                    <dt className="w-2/5 shrink-0 text-navy-500">{f.label}</dt>
                    <dd className="flex-1 font-medium text-navy-800 break-words">{String(v)}</dd>
                  </div>
                );
              })}
            </dl>

            <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-navy-600">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => { setConsent(e.target.checked); setConsentError(false); }}
                className="mt-0.5 h-4 w-4 shrink-0 accent-lime-500"
              />
              <span>
                Sunt de acord cu{" "}
                <Link href="/politica-confidentialitate" className="font-medium text-lime-700 underline-offset-2 hover:underline">Politica de confidențialitate</Link>{" "}
                și cu prelucrarea datelor în scopul soluționării cererii mele.
              </span>
            </label>
            {consentError && <p role="alert" className="mt-1.5 text-xs text-danger">Trebuie să accepți pentru a trimite mesajul.</p>}
            {eroare && <p role="alert" className="mt-2 text-xs text-danger">{eroare}</p>}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button type="button" onClick={back} disabled={step === 0} className={cn(btnOutline, step === 0 && "invisible")}>
            Înapoi
          </button>
          {isSummary ? (
            <button type="button" onClick={submit} disabled={faza === "trimit"} className={cn(btnPrimary, faza === "trimit" && "opacity-70")}>
              {faza === "trimit" ? "Se trimite…" : (<>Trimite mesajul <Check className="h-4 w-4" /></>)}
            </button>
          ) : (
            <button type="button" onClick={next} className={btnPrimary}>
              Continuă <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
