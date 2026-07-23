"use client";

import { useId, useState } from "react";
import { Check } from "./icons";
import { cn } from "./ui";

// Inline SVG helpers — keeps icons.tsx clean
function AlertCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export type InputType = "text" | "number" | "date" | "select" | "textarea" | "tel" | "email";
export type FieldStatus = "idle" | "error" | "success" | "loading";

export interface FormFieldProps {
  label: string;
  name?: string;
  type?: InputType;
  value: string;
  placeholder?: string;
  help?: string;
  required?: boolean;
  rows?: number;
  options?: string[];
  /** Submit-time error from parent (always wins over self-validation) */
  externalError?: boolean;
  externalErrorMsg?: string;
  /** Fully override status from parent — used for async (loading / success) */
  externalStatus?: FieldStatus;
  successMsg?: string;
  loadingMsg?: string;
  onChange: (v: string) => void;
  onBlurCallback?: () => void;
  className?: string;
  disabled?: boolean;
  dataAnim?: boolean;
  maxLength?: number;
  /** Lasă browserul să completeze automat (name, tel, email…) — câștig real pe mobil. */
  autoComplete?: string;
}

/**
 * Sursa unică de adevăr pentru validare. Exportată ca să o poată refolosi și
 * Wizard-ul la trecerea între pași — altfel câmpul afișa eroarea la blur, dar
 * „Continuă" avansa oricum (se verifica doar dacă e gol, nu și formatul).
 */
export function runValidation(type: InputType, value: string, required?: boolean): string {
  if (required && !value.trim()) return "Câmp obligatoriu.";
  if (type === "email" && value.trim() && !/.+@.+\..+/.test(value))
    return "Format email invalid — verifică simbolul @";
  if (type === "tel" && value.trim() && !/^[+\d\s\-()]{7,}$/.test(value))
    return "Număr de telefon invalid.";
  return "";
}

export function FormField({
  label, name, type = "text", value = "", placeholder, help, required,
  rows = 3, options,
  externalError, externalErrorMsg, externalStatus,
  successMsg, loadingMsg = "Verificare în curs…",
  onChange, onBlurCallback,
  className, disabled, dataAnim, maxLength, autoComplete,
}: FormFieldProps) {
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  // id stabil, ca <label for> să lege eticheta de câmp (screen readers + autofill)
  const uid = useId();
  const fieldId = name ? `f-${name}-${uid}` : `f${uid}`;
  const msgId = `${fieldId}-msg`;

  const selfErr = touched ? runValidation(type, value, required) : "";
  const selfSuccess = touched && !selfErr && value.trim() !== "";

  // Priority: externalError > externalStatus > self-computed
  const status: FieldStatus =
    externalError ? "error" :
    externalStatus ??
    (selfErr ? "error" : selfSuccess ? "success" : "idle");

  const errorMsg = externalError
    ? (externalErrorMsg ?? "Câmp obligatoriu.")
    : selfErr;

  const borderCls =
    status === "error"   ? "border-red-400" :
    status === "success" ? "border-lime-400" :
    focused              ? "border-lime-400" : "border-navy-200";

  const ringShadow =
    status === "error"                  ? "shadow-[0_0_0_3px_rgba(239,68,68,0.12)]" :
    (status === "success" || focused)   ? "shadow-[0_0_0_3px_rgba(143,208,47,0.18)]" : "";

  const bgCls =
    status === "error"   ? "bg-red-50/70" :
    status === "success" ? "bg-lime-50/50" : "bg-white";

  // Icon inside field — not for select (native arrow conflict)
  const showIcon = status !== "idle" && type !== "select";
  const iconPosCls = type === "textarea"
    ? "top-3 right-3"
    : "top-1/2 right-3 -translate-y-1/2";

  const inputCls = cn(
    // 16px pe mobil: sub 16px, iOS Safari face zoom automat la focus și „sare" pagina.
    "w-full rounded-xl border px-4 py-3 text-base sm:text-sm text-navy-800 placeholder:text-navy-300",
    // Inelul de focus vine din :focus-visible (navy + halou lime), nu outline-none.
    "transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-800",
    borderCls, bgCls, ringShadow,
    showIcon && "pr-10",
    (disabled || status === "loading") && "opacity-60 cursor-not-allowed",
  );

  const eventProps = {
    id: fieldId,
    "aria-invalid": status === "error" || undefined,
    "aria-describedby": status === "error" && errorMsg ? msgId : undefined,
    "aria-required": required || undefined,
    onFocus: () => setFocused(true),
    onBlur:  () => { setFocused(false); setTouched(true); onBlurCallback?.(); },
  };

  const fieldEl =
    type === "textarea" ? (
      <textarea
        name={name} value={value} placeholder={placeholder} rows={rows}
        disabled={disabled || status === "loading"}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputCls, "resize-y")}
        {...eventProps}
      />
    ) : type === "select" ? (
      <select
        name={name} value={value}
        disabled={disabled || status === "loading"}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputCls, !value && "text-navy-300")}
        {...eventProps}
      >
        <option value="">Alege…</option>
        {options?.map((o) => (
          <option key={o} value={o} className="text-navy-800">{o}</option>
        ))}
      </select>
    ) : (
      <input
        type={type} name={name} value={value} placeholder={placeholder}
        maxLength={maxLength} autoComplete={autoComplete}
        disabled={disabled || status === "loading"}
        onChange={(e) => onChange(maxLength ? e.target.value.slice(0, maxLength) : e.target.value)}
        className={inputCls}
        {...eventProps}
      />
    );

  return (
    <div className={className} data-anim={dataAnim ? "" : undefined}>
      <label htmlFor={fieldId} className="mb-1.5 flex items-center justify-between gap-2 text-sm font-medium text-navy-700">
        <span>
          {label}
          {required && <span className="ml-0.5 text-lime-600">*</span>}
        </span>
        {maxLength && (
          <span className={cn("shrink-0 text-xs font-semibold tabular-nums", value.length >= maxLength ? "text-lime-600" : "text-navy-400")}>
            {value.length}/{maxLength}
          </span>
        )}
      </label>

      <div className="relative">
        {fieldEl}

        {showIcon && (
          <span className={cn(
            "pointer-events-none absolute",
            iconPosCls,
            status === "error"   && "text-red-500",
            status === "success" && "text-lime-500",
            status === "loading" && "text-navy-400",
          )}>
            {status === "error"   && <AlertCircle className="h-4 w-4" />}
            {status === "success" && <Check className="h-4 w-4" />}
            {status === "loading" && <Spinner className="h-4 w-4" />}
          </span>
        )}
      </div>

      {status === "error" && errorMsg && (
        <p id={msgId} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {errorMsg}
        </p>
      )}
      {status === "success" && successMsg && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-lime-700">
          <Check className="h-3.5 w-3.5 shrink-0" />
          {successMsg}
        </p>
      )}
      {status === "loading" && (
        <p className="mt-1.5 text-xs text-navy-400">{loadingMsg}</p>
      )}
      {status === "idle" && help && (
        <p className="mt-1 text-xs text-navy-400">{help}</p>
      )}
    </div>
  );
}
