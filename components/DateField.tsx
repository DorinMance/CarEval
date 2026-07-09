"use client";

import { useState, useRef } from "react";
import { Check } from "./icons";
import { cn } from "./ui";

function AlertCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 8v4" /><path d="M12 16h.01" />
    </svg>
  );
}

const CY = new Date().getFullYear();

interface Seg { d: string; m: string; y: string }

function parse(v: string): Seg {
  if (!v) return { d: "", m: "", y: "" };
  if (v.includes("-")) { const [y = "", m = "", d = ""] = v.split("-"); return { d, m, y }; } // ISO
  const [d = "", m = "", y = ""] = v.split(".");
  return { d, m, y };
}
const pad2 = (s: string) => (s.length === 1 ? "0" + s : s);

export interface DateFormFieldProps {
  label: string;
  value: string;
  help?: string;
  required?: boolean;
  externalError?: boolean;
  externalErrorMsg?: string;
  onChange: (v: string) => void;
  className?: string;
  disabled?: boolean;
  dataAnim?: boolean;
}

export function DateFormField({
  label, value, help, required,
  externalError, externalErrorMsg,
  onChange, className, disabled, dataAnim,
}: DateFormFieldProps) {
  const [seg, setSeg] = useState<Seg>(() => parse(value));
  const [touched, setTouched] = useState(false);

  const dRef = useRef<HTMLInputElement>(null);
  const mRef = useRef<HTMLInputElement>(null);
  const yRef = useRef<HTMLInputElement>(null);

  const di = +seg.d, mi = +seg.m, yi = +seg.y;
  const valid =
    !!seg.d && !!seg.m && seg.y.length === 4 &&
    di >= 1 && di <= 31 && mi >= 1 && mi <= 12 && yi >= 1900 && yi <= CY + 1;

  function update(field: keyof Seg, raw: string) {
    const max = field === "y" ? 4 : 2;
    const digits = raw.replace(/\D/g, "").slice(0, max);
    const next: Seg = { ...seg, [field]: digits };
    setSeg(next);
    // salt automat la câmpul următor
    if (field === "d" && digits.length === 2) mRef.current?.focus();
    if (field === "m" && digits.length === 2) yRef.current?.focus();
    // emite doar când e complet
    if (next.d && next.m && next.y.length === 4) onChange(`${pad2(next.d)}.${pad2(next.m)}.${next.y}`);
    else onChange("");
  }

  function onBackspace(field: keyof Seg, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !seg[field]) {
      if (field === "m") dRef.current?.focus();
      if (field === "y") mRef.current?.focus();
    }
  }

  const status = externalError ? "error" : touched && required && !valid ? "error" : valid ? "success" : "idle";
  const errMsg = externalErrorMsg ?? "Câmp obligatoriu.";

  const inputCls =
    cn(
      "w-full rounded-xl border px-3 py-2.5 text-center text-sm tabular-nums text-navy-800 placeholder:text-navy-300 outline-none transition-all",
      status === "error"
        ? "border-red-400 bg-red-50/60"
        : "border-navy-200 bg-white focus:border-lime-400 focus:shadow-[0_0_0_3px_rgba(143,208,47,0.18)]"
    );

  return (
    <div className={className} data-anim={dataAnim ? "" : undefined} onBlur={() => setTouched(true)}>
      <label className="mb-1.5 block text-sm font-medium text-navy-700">
        {label}{required && <span className="ml-0.5 text-lime-600">*</span>}
      </label>

      {/* 3 căsuțe separate în care scrii: Zi · Lună · An */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <span className="mb-1 block text-[11px] font-medium text-navy-400">Zi</span>
          <input
            ref={dRef} inputMode="numeric" maxLength={2} placeholder="ZZ" aria-label="Zi"
            value={seg.d} disabled={disabled}
            onChange={(e) => update("d", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <span className="mb-1 block text-[11px] font-medium text-navy-400">Lună</span>
          <input
            ref={mRef} inputMode="numeric" maxLength={2} placeholder="LL" aria-label="Lună"
            value={seg.m} disabled={disabled}
            onChange={(e) => update("m", e.target.value)}
            onKeyDown={(e) => onBackspace("m", e)}
            className={inputCls}
          />
        </div>
        <div>
          <span className="mb-1 block text-[11px] font-medium text-navy-400">An</span>
          <input
            ref={yRef} inputMode="numeric" maxLength={4} placeholder="AAAA" aria-label="An"
            value={seg.y} disabled={disabled}
            onChange={(e) => update("y", e.target.value)}
            onKeyDown={(e) => onBackspace("y", e)}
            className={inputCls}
          />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />{externalError ? errMsg : "Completează ziua, luna și anul."}
        </p>
      )}
      {status === "success" && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-lime-700">
          <Check className="h-3.5 w-3.5 shrink-0" />Dată completă.
        </p>
      )}
      {status === "idle" && help && <p className="mt-1 text-xs text-navy-400">{help}</p>}
    </div>
  );
}
