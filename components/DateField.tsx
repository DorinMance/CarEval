"use client";

import { useState } from "react";
import { Check } from "./icons";
import { cn } from "./ui";

function AlertCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 8v4" /><path d="M12 16h.01" />
    </svg>
  );
}

const MONTHS_RO = [
  "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
  "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie",
];
const CY = new Date().getFullYear();
const YEARS = Array.from({ length: CY - 1980 + 1 }, (_, i) => CY - i); // de la anul curent înapoi la 1980

interface Seg { d: string; m: string; y: string }

function parse(v: string): Seg {
  if (!v) return { d: "", m: "", y: "" };
  if (v.includes("-")) { const [y = "", m = "", d = ""] = v.split("-"); return { d, m, y }; } // ISO
  const [d = "", m = "", y = ""] = v.split(".");
  return { d, m, y };
}

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

  const complete = Boolean(seg.d && seg.m && seg.y);

  function update(field: keyof Seg, raw: string) {
    const next: Seg = { ...seg, [field]: raw };
    setSeg(next);
    if (next.d && next.m && next.y) onChange(`${next.d}.${next.m}.${next.y}`);
    else onChange("");
  }

  const status = externalError ? "error" : touched && required && !complete ? "error" : complete ? "success" : "idle";
  const errMsg = externalErrorMsg ?? "Câmp obligatoriu.";

  const boxCls = (val: string) =>
    cn(
      "w-full rounded-xl border px-3 py-2.5 text-sm text-navy-800 outline-none transition-all",
      status === "error" ? "border-red-400 bg-red-50/60" : "border-navy-200 bg-white focus:border-lime-400 focus:shadow-[0_0_0_3px_rgba(143,208,47,0.18)]",
      !val && "text-navy-300"
    );

  return (
    <div className={className} data-anim={dataAnim ? "" : undefined} onBlur={() => setTouched(true)}>
      <label className="mb-1.5 block text-sm font-medium text-navy-700">
        {label}{required && <span className="ml-0.5 text-lime-600">*</span>}
      </label>

      {/* 3 căsuțe separate: Zi · Lună · An */}
      <div className="grid grid-cols-3 gap-2">
        <select aria-label="Zi" disabled={disabled} value={seg.d} onChange={(e) => update("d", e.target.value)} className={boxCls(seg.d)}>
          <option value="">Zi</option>
          {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0")).map((d) => (
            <option key={d} value={d} className="text-navy-800">{+d}</option>
          ))}
        </select>

        <select aria-label="Lună" disabled={disabled} value={seg.m} onChange={(e) => update("m", e.target.value)} className={boxCls(seg.m)}>
          <option value="">Lună</option>
          {MONTHS_RO.map((name, i) => {
            const val = String(i + 1).padStart(2, "0");
            return <option key={val} value={val} className="text-navy-800">{name}</option>;
          })}
        </select>

        <select aria-label="An" disabled={disabled} value={seg.y} onChange={(e) => update("y", e.target.value)} className={boxCls(seg.y)}>
          <option value="">An</option>
          {YEARS.map((y) => (
            <option key={y} value={String(y)} className="text-navy-800">{y}</option>
          ))}
        </select>
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
