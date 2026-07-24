"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { Product, Field, WizardStep } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { ImageUploader } from "./ImageUploader";
import { FormField, runValidation } from "./FormField";
import type { InputType } from "./FormField";
import { DateFormField } from "./DateField";
import { btnPrimary, btnOutline, cn } from "./ui";
import { Check, ArrowRight, Upload, X, Car } from "./icons";

gsap.registerPlugin(useGSAP);

type Values = Record<string, string | boolean>;
type Images = Record<string, string[]>;

const SUMMARY: WizardStep = { id: "sumar", title: "Verifică și trimite", subtitle: "Confirmă datele înainte de a adăuga în coș." };

export function Wizard({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const steps = [...product.steps, SUMMARY];

  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>({});
  const [images, setImages] = useState<Images>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const dirRef = useRef(1);

  const current = steps[step];
  const isSummary = current.id === "sumar";

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const d = dirRef.current;
      const panel = panelRef.current;
      if (!panel) return;
      const tl = gsap.timeline();
      tl.fromTo(panel, { opacity: 0, x: d * 48 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" });
      const fields = panel.querySelectorAll("[data-anim]");
      if (fields.length) {
        tl.fromTo(
          fields,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" },
          "-=0.32"
        );
      }
    },
    { dependencies: [step], scope: panelRef }
  );

  function setValue(name: string, value: string | boolean) {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: false }));
  }

  function addImage(group: string, dataUrl: string) {
    setImages((im) => ({ ...im, [group]: [...(im[group] ?? []), dataUrl] }));
  }

  function removeImage(group: string, idx: number) {
    setImages((im) => ({ ...im, [group]: (im[group] ?? []).filter((_, i) => i !== idx) }));
  }

  // Validează câmpurile obligatorii ale unui pas. Întoarce harta de erori (gol = valid).
  function validateStep(stepObj: WizardStep): Record<string, boolean> {
    const errs: Record<string, boolean> = {};
    (stepObj.fields ?? []).forEach((f) => {
      const v = values[f.name];
      const empty = v === undefined || v === null || v === "" || v === false;
      if (f.required && empty) {
        errs[f.name] = true;
        return;
      }
      // Nu doar „gol” — și formatul, cu aceeași funcție pe care o folosește FormField
      // la blur. Altfel câmpul afișa „Format email invalid” iar „Continuă” avansa oricum.
      if (typeof v === "string" && v.trim() && runValidation(f.type as InputType, v, f.required)) {
        errs[f.name] = true;
      }
    });
    return errs;
  }

  /** Primul pas invalid din intervalul [from, to). -1 dacă toate sunt valide. */
  function firstInvalidStep(from: number, to: number): number {
    for (let i = from; i < to; i++) {
      if (Object.keys(validateStep(steps[i])).length > 0) return i;
    }
    return -1;
  }

  function markStepErrors(i: number) {
    setErrors((e) => ({ ...e, ...validateStep(steps[i]) }));
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function next() {
    const errs = validateStep(current);
    if (Object.keys(errs).length > 0) {
      setErrors((e) => ({ ...e, ...errs })); // marchează câmpurile lipsă
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return; // blochează avansarea
    }
    dirRef.current = 1;
    setStep((s) => Math.min(s + 1, steps.length - 1));
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function back() {
    dirRef.current = -1;
    setStep((s) => Math.max(s - 1, 0));
  }

  function jumpTo(i: number) {
    if (i === step) return;
    // La salt înainte se validează TOȚI pașii dintre cel curent și țintă, nu doar
    // cel curent — altfel se putea sări din pasul 1 direct la sumar, iar comanda
    // pleca fără descrierea avariei sau fără datele de contact.
    if (i > step) {
      const bad = firstInvalidStep(step, i);
      if (bad !== -1) {
        markStepErrors(bad);
        dirRef.current = bad > step ? 1 : -1;
        setStep(bad); // du utilizatorul exact la pasul care lipsește
        return;
      }
    }
    dirRef.current = i > step ? 1 : -1;
    setStep(i);
  }

  function submit() {
    // Plasă de siguranță: revalidează toți pașii înainte de a pune în coș, indiferent
    // cum a ajuns utilizatorul la sumar (jumpTo, back/next, sau o stare veche).
    const bad = firstInvalidStep(0, steps.length - 1);
    if (bad !== -1) {
      markStepErrors(bad);
      dirRef.current = -1;
      setStep(bad);
      return;
    }
    addItem({
      productSlug: product.slug,
      productName: product.name,
      code: product.code,
      price: product.price,
      data: values,
      images,
    });
    router.push("/cos");
  }

  return (
    <div className="rounded-2xl border border-mist bg-white shadow-[0_2px_16px_rgba(11,25,48,0.05)]">
      {/* Progress: drumul cu mașina */}
      <RoadProgress steps={steps} step={step} onJump={jumpTo} />

      {/* Panel */}
      <div ref={panelRef} className="p-5 sm:p-7">
        <h3 className="font-heading text-xl font-bold text-navy-800">{current.title}</h3>
        {current.subtitle && <p className="mt-1 text-sm text-navy-500">{current.subtitle}</p>}

        {(current.fields ?? []).some((f) => errors[f.name]) && (
          <div role="alert" className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <span aria-hidden="true" className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-500 text-xs font-bold text-white">!</span>
            Verifică datele marcate cu roșu ca să poți continua.
          </div>
        )}

        {!isSummary ? (
          <div className="mt-6 space-y-6">
            {current.fields && (
              <div className="grid gap-4 sm:grid-cols-2">
                {current.fields.map((f) => (
                  <FieldInput
                    key={f.name}
                    field={f}
                    value={values[f.name]}
                    error={errors[f.name]}
                    onChange={(v) => setValue(f.name, v)}
                  />
                ))}
              </div>
            )}

            {current.images && (() => {
              const singles = current.images.filter((g) => g.max === 1);
              const multis  = current.images.filter((g) => g.max > 1);
              return (
                <>
                  {singles.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {singles.map((g) => (
                        <ImageUploader
                          key={g.name}
                          group={g}
                          files={images[g.name] ?? []}
                          onAdd={(dataUrl) => addImage(g.name, dataUrl)}
                          onRemove={(idx) => removeImage(g.name, idx)}
                        />
                      ))}
                    </div>
                  )}
                  {multis.map((g) => (
                    <ImageUploader
                      key={g.name}
                      group={g}
                      files={images[g.name] ?? []}
                      onAdd={(dataUrl) => addImage(g.name, dataUrl)}
                      onRemove={(idx) => removeImage(g.name, idx)}
                    />
                  ))}
                </>
              );
            })()}
          </div>
        ) : (
          <Summary product={product} values={values} images={images} />
        )}

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button type="button" onClick={back} className={btnOutline}>
              Înapoi
            </button>
          ) : (
            <span />
          )}

          {!isSummary ? (
            <button type="button" onClick={next} className={btnPrimary}>
              Continuă <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={submit} className={btnPrimary}>
              Adaugă în coș <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Exportate ca să le refolosească și formularul de contact, fără duplicare. */
export function FieldInput({
  field,
  value,
  error,
  onChange,
}: {
  field: Field;
  value: string | boolean | undefined;
  error?: boolean;
  onChange: (v: string | boolean) => void;
}) {
  const wrap = field.full || field.type === "textarea" || field.type === "checkbox" ? "sm:col-span-2" : "";

  if (field.type === "date") {
    return (
      <DateFormField
        label={field.label}
        value={(value as string) ?? ""}
        help={field.help}
        required={field.required}
        externalError={error}
        externalErrorMsg="Câmp obligatoriu."
        onChange={(v) => onChange(v)}
        className={wrap}
        dataAnim
      />
    );
  }

  if (field.type === "checkbox") {
    return (
      <label data-anim className={cn("flex cursor-pointer items-start gap-3 rounded-xl border border-navy-200 p-4", wrap)}>
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-5 w-5 accent-lime-500"
        />
        <span className="text-sm font-medium text-navy-700">{field.label}</span>
      </label>
    );
  }

  return (
    <FormField
      label={field.label}
      type={field.type as InputType}
      value={(value as string) ?? ""}
      placeholder={field.placeholder}
      help={field.help}
      required={field.required}
      options={field.options}
      maxLength={field.maxLength}
      name={field.name}
      autoComplete={AUTOCOMPLETE[field.name]}
      externalError={error}
      // Mesajul trebuie să spună ce e greșit: „obligatoriu” doar când e gol,
      // altfel eroarea concretă de format (email/telefon).
      externalErrorMsg={
        runValidation(field.type as InputType, (value as string) ?? "", field.required) ||
        "Acest câmp este obligatoriu."
      }
      rows={3}
      onChange={(v) => onChange(v)}
      className={wrap}
      dataAnim
    />
  );
}


/** Câmpurile de contact pe care browserul le poate completa singur. */
const AUTOCOMPLETE: Record<string, string> = {
  nume: "name",
  telefon: "tel",
  email: "email",
  localitate: "address-level2",
};

const LABELS: Record<string, string> = {
  marca: "Marca", model: "Model", varianta: "Variantă", vin: "VIN",
  capacitate: "Capacitate [cmc]", putere: "Putere [kW]", transmisie: "Transmisie",
  km: "Km", primaInmatriculare: "Primă înmatriculare", proprietari: "Proprietari",
  dotari: "Dotări", descriereAvarii: "Avarii", dataAccident: "Data accidentului",
  tipPolita: "Tip poliță", sistemCalcul: "Sistem calcul", motiv: "Motiv",
  locAccident: "Loc accident", dataOra: "Data/ora", victime: "Cu victime",
  nume: "Nume", telefon: "Telefon", email: "Email", localitate: "Localitate",
  mesaj: "Mesaj", raportTiparit: "Raport tipărit",
};

function Summary({ product, values, images }: { product: Product; values: Values; images: Images }) {
  const entries = Object.entries(values).filter(([, v]) => v !== "" && v !== false);
  const totalImgs = Object.values(images).reduce((n, a) => n + a.length, 0);

  return (
    <div className="mt-6 space-y-5">
      <div data-anim className="rounded-2xl bg-cloud p-5">
        <div className="flex items-center justify-between">
          <p className="font-heading text-lg font-semibold text-navy-800">{product.name}</p>
          <span className="font-heading font-bold text-navy-800">{formatPrice(product)}</span>
        </div>
        <p className="mt-1 text-sm text-navy-500">Cod {product.code} · livrare {product.delivery}</p>
      </div>

      {entries.length > 0 && (
        <div data-anim className="rounded-2xl border border-mist p-5">
          <p className="mb-3 text-sm font-semibold text-navy-700">Datele completate</p>
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {entries.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 border-b border-mist/60 py-1 text-sm">
                <dt className="text-navy-400">{LABELS[k] ?? k}</dt>
                <dd className="text-right font-medium text-navy-800">{v === true ? "Da" : String(v)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div data-anim className="flex items-center gap-2 rounded-2xl border border-lime-200 bg-lime-50 p-4 text-sm text-navy-700">
        <Check className="h-5 w-5 text-lime-600" />
        {totalImgs > 0 ? `${totalImgs} imagini atașate.` : "Nicio imagine atașată (opțional)."} Verifică și adaugă în coș.
      </div>
    </div>
  );
}

function FlagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 4h12l-2 3 2 3H5z" fill="currentColor" />
    </svg>
  );
}

export function RoadProgress({
  steps,
  step,
  onJump,
}: {
  steps: WizardStep[];
  step: number;
  onJump: (i: number) => void;
}) {
  const carRef = useRef<HTMLDivElement>(null);
  const n = steps.length;
  const f = n > 1 ? step / (n - 1) : 0;
  const atEnd = step === n - 1;

  useGSAP(
    () => {
      const car = carRef.current;
      if (!car) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(car, { left: `${f * 100}%` });
        return;
      }
      gsap.to(car, { left: `${f * 100}%`, duration: 0.7, ease: "power2.inOut" });
      gsap.fromTo(car, { rotate: -3 }, { rotate: 0, duration: 0.5, ease: "power2.out" });
    },
    { dependencies: [step] }
  );

  return (
    <div className="border-b border-mist px-5 pb-7 pt-5 sm:px-7">
      <div className="mb-5 flex items-center justify-between">
        <p className="font-heading text-sm font-semibold text-navy-800">
          Pasul {step + 1} din {n}
        </p>
        <p className="text-sm text-navy-400">{steps[step].title}</p>
      </div>

      <div className="relative h-9">
        <div className="absolute inset-x-4 top-6">
          {/* asfalt */}
          <div className="relative h-2.5 rounded-full bg-navy-800">
            {/* marcaj bandă */}
            <div className="absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.55)_0,rgba(255,255,255,0.55)_7px,transparent_7px,transparent_16px)]" />
            {/* porțiune parcursă */}
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-lime-500 transition-[width] duration-700 ease-out"
              style={{ width: `${f * 100}%` }}
            />
            {/* repere */}
            {steps.map((s, i) => {
              const mi = n > 1 ? i / (n - 1) : 0;
              const done = i < step;
              const activ = i === step;
              const last = i === n - 1;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onJump(i)}
                  aria-label={s.title}
                  className="absolute top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center p-2.5"
                  style={{ left: `${mi * 100}%` }}
                >
                  <span
                    className={cn(
                      "grid h-6 w-6 place-items-center rounded-full border-2 text-[10px] font-bold transition-all",
                      done && "border-lime-500 bg-lime-500 text-navy-900",
                      activ && "border-lime-500 bg-white text-lime-600 ring-4 ring-lime-100",
                      !done && !activ && "border-navy-200 bg-white text-navy-300"
                    )}
                  >
                    {last ? <FlagIcon /> : done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                </button>
              );
            })}
            {/* mașina care merge pe drum */}
            <div
              ref={carRef}
              className="absolute -top-5 z-10 -translate-x-1/2 will-change-transform"
              style={{ left: `${f * 100}%` }}
            >
              <span
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-xl bg-white text-navy-800 shadow-[0_8px_18px_-6px_rgba(11,25,48,0.5)] ring-1 ring-mist",
                  "animate-[bob_1.7s_ease-in-out_infinite]",
                  atEnd && "ring-2 ring-lime-400"
                )}
              >
                <Car className="h-5 w-5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* etichete pași */}
      <div className="mt-2 hidden justify-between px-1 sm:flex">
        {steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onJump(i)}
            className={cn(
              "max-w-[6rem] truncate text-[11px] font-medium transition-colors",
              i === step ? "text-lime-600" : i < step ? "text-navy-500 hover:text-navy-700" : "text-navy-300"
            )}
          >
            {s.title}
          </button>
        ))}
      </div>
    </div>
  );
}
