"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronRight } from "./icons";
import { cn } from "./ui";

function AlertCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 8v4" /><path d="M12 16h.01" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

const MONTHS_RO = [
  "Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie",
  "Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie",
];
const DAYS_SHORT = ["L","Ma","Mi","J","V","S","D"];

const TODAY = new Date();
const CY = TODAY.getFullYear();

interface Seg { d: string; m: string; y: string }

function parseSeg(v: string): Seg {
  if (!v) return { d: "", m: "", y: "" };
  const [d = "", m = "", y = ""] = v.split(".");
  return { d, m, y };
}

function isValidDate(d: string, m: string, y: string): boolean {
  if (d.length !== 2 || m.length !== 2 || y.length !== 4) return false;
  const di = +d, mi = +m, yi = +y;
  if (!di || !mi || !yi || mi > 12 || yi < 1900 || yi > 2100) return false;
  return di >= 1 && di <= new Date(yi, mi, 0).getDate();
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
  const [seg, setSeg] = useState<Seg>(() => parseSeg(value));
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [calYear, setCalYear] = useState<number>(() => {
    const s = parseSeg(value); return s.y ? +s.y : CY;
  });
  const [calMonth, setCalMonth] = useState<number>(() => {
    const s = parseSeg(value); return s.m ? +s.m - 1 : TODAY.getMonth();
  });
  // position:fixed coordinates — escapes the GSAP transform stacking context
  const [calPos, setCalPos] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dRef   = useRef<HTMLInputElement>(null);
  const mRef   = useRef<HTMLInputElement>(null);
  const yRef   = useRef<HTMLInputElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);

  /* ── close on outside mousedown ── */
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (!rowRef.current?.contains(t) && !calRef.current?.contains(t)) {
        setOpen(false); setFocused(false); setTouched(true);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  /* ── close on ESC ── */
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); yRef.current?.focus(); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function openCalendar() {
    const row = rowRef.current;
    if (!row) return;
    const rect = row.getBoundingClientRect();
    const CAL_W = 288, CAL_H = 310;
    let top  = rect.bottom + 6;
    let left = rect.left;
    if (left + CAL_W > window.innerWidth  - 8) left = Math.max(8, window.innerWidth  - CAL_W - 8);
    if (top  + CAL_H > window.innerHeight - 8) top  = Math.max(8, rect.top - CAL_H - 6);
    setCalPos({ top, left });
    setOpen(true);
    setFocused(true);
  }

  function updateSeg(field: keyof Seg, raw: string) {
    const max = field === "y" ? 4 : 2;
    const digits = raw.replace(/\D/g, "").slice(0, max);
    const next: Seg = { ...seg, [field]: digits };
    setSeg(next);
    if (field === "d" && digits.length === 2) mRef.current?.focus();
    if (field === "m" && digits.length === 2) yRef.current?.focus();
    if (isValidDate(next.d, next.m, next.y)) {
      onChange(`${next.d}.${next.m}.${next.y}`);
      setCalMonth(+next.m - 1);
      setCalYear(+next.y);
    } else if (!next.d && !next.m && !next.y) {
      onChange("");
    }
  }

  function handleBlur(e: React.FocusEvent) {
    if (open) return;
    const to = e.relatedTarget as Node | null;
    if (!rowRef.current?.contains(to)) {
      setFocused(false); setTouched(true);
    }
  }

  function selectDay(day: number) {
    const d = String(day).padStart(2, "0");
    const m = String(calMonth + 1).padStart(2, "0");
    const y = String(calYear);
    setSeg({ d, m, y }); setTouched(true);
    onChange(`${d}.${m}.${y}`);
    setOpen(false); setFocused(false);
  }

  function goToday() {
    const d = String(TODAY.getDate()).padStart(2, "0");
    const m = String(TODAY.getMonth() + 1).padStart(2, "0");
    const y = String(CY);
    setSeg({ d, m, y });
    setCalMonth(TODAY.getMonth()); setCalYear(CY);
    setTouched(true); onChange(`${d}.${m}.${y}`);
    setOpen(false); setFocused(false);
  }

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  }

  /* ── status ── */
  const hasInput = seg.d || seg.m || seg.y;
  const ok = isValidDate(seg.d, seg.m, seg.y);
  const selfErr = touched
    ? ok ? "" : hasInput ? "Dată invalidă." : required ? "Câmp obligatoriu." : ""
    : "";
  const status = externalError ? "error" : selfErr ? "error" : (touched && ok) ? "success" : "idle";
  const errMsg = externalError ? (externalErrorMsg ?? "Câmp obligatoriu.") : selfErr;

  const borderCls =
    status === "error"   ? "border-red-400" :
    status === "success" ? "border-lime-400" :
    focused              ? "border-lime-400" : "border-navy-200";
  const shadowCls =
    status === "error"                ? "shadow-[0_0_0_3px_rgba(239,68,68,0.12)]" :
    (status === "success" || focused) ? "shadow-[0_0_0_3px_rgba(143,208,47,0.18)]" : "";
  const bgCls =
    status === "error"   ? "bg-red-50/70" :
    status === "success" ? "bg-lime-50/50" : "bg-white";

  /* ── calendar grid ── */
  const firstDow = (() => { const d = new Date(calYear, calMonth, 1).getDay(); return d === 0 ? 6 : d - 1; })();
  const dimMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const selDay   = seg.y && +seg.y === calYear && +seg.m - 1 === calMonth ? +seg.d : null;
  const todayDay = TODAY.getFullYear() === calYear && TODAY.getMonth() === calMonth ? TODAY.getDate() : null;
  const todayStr = `${String(TODAY.getDate()).padStart(2,"0")}.${String(TODAY.getMonth()+1).padStart(2,"0")}.${CY}`;

  return (
    <div className={className} data-anim={dataAnim ? "" : undefined}>
      <label className="mb-1.5 block text-sm font-medium text-navy-700">
        {label}{required && <span className="ml-0.5 text-lime-600">*</span>}
      </label>

      {/* segmented input row */}
      <div
        ref={rowRef}
        className={cn("flex items-center rounded-xl border px-4 py-2.5 transition-all duration-200", borderCls, bgCls, shadowCls)}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
      >
        <input ref={dRef} type="text" inputMode="numeric" maxLength={2}
          value={seg.d} placeholder="ZZ" disabled={disabled} aria-label="Zi"
          onChange={(e) => updateSeg("d", e.target.value)}
          className="w-7 bg-transparent text-center text-sm text-navy-800 placeholder:text-navy-300 outline-none tabular-nums" />
        <span className="mx-0.5 select-none text-sm text-navy-300">.</span>
        <input ref={mRef} type="text" inputMode="numeric" maxLength={2}
          value={seg.m} placeholder="LL" disabled={disabled} aria-label="Lună"
          onChange={(e) => updateSeg("m", e.target.value)}
          onKeyDown={(e) => { if (e.key === "Backspace" && !seg.m) dRef.current?.focus(); }}
          className="w-7 bg-transparent text-center text-sm text-navy-800 placeholder:text-navy-300 outline-none tabular-nums" />
        <span className="mx-0.5 select-none text-sm text-navy-300">.</span>
        <input ref={yRef} type="text" inputMode="numeric" maxLength={4}
          value={seg.y} placeholder="AAAA" disabled={disabled} aria-label="An"
          onChange={(e) => updateSeg("y", e.target.value)}
          onKeyDown={(e) => { if (e.key === "Backspace" && !seg.y) mRef.current?.focus(); }}
          className="w-12 bg-transparent text-center text-sm text-navy-800 placeholder:text-navy-300 outline-none tabular-nums" />
        <span className="flex-1" />
        {status === "error"   && <AlertCircle className="mr-2 h-4 w-4 shrink-0 text-red-500" />}
        {status === "success" && <Check       className="mr-2 h-4 w-4 shrink-0 text-lime-500" />}
        <button type="button" aria-label="Deschide calendar" onClick={openCalendar} disabled={disabled}
          className="text-navy-400 transition-colors hover:text-lime-600">
          <CalendarIcon className="h-4 w-4" />
        </button>
      </div>

      {/* calendar — portal into body so GSAP transform on wizard panel doesn't offset position:fixed */}
      {open && mounted && createPortal(
        <div
          ref={calRef}
          style={{ position: "fixed", top: calPos.top, left: calPos.left, zIndex: 9999, width: 288 }}
          className="overflow-hidden rounded-2xl border border-mist bg-white shadow-[0_12px_48px_rgba(11,25,48,0.16)]"
        >
          {/* header */}
          <div className="flex items-center gap-1 border-b border-mist px-3 py-2.5">
            <button type="button" onClick={prevMonth}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-navy-400 transition-colors hover:bg-cloud hover:text-navy-700">
              <ChevronRight className="h-4 w-4 rotate-180" />
            </button>
            <span className="flex-1 text-center font-heading text-sm font-semibold text-navy-800">
              {MONTHS_RO[calMonth]}
            </span>
            <button type="button" onClick={() => setCalYear(y => y - 1)}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-navy-400 transition-colors hover:bg-cloud hover:text-navy-700">
              <ChevronRight className="h-3.5 w-3.5 rotate-180" />
            </button>
            <span className="min-w-[2.75rem] text-center text-sm font-semibold text-navy-800 tabular-nums">
              {calYear}
            </span>
            <button type="button" onClick={() => setCalYear(y => y + 1)}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-navy-400 transition-colors hover:bg-cloud hover:text-navy-700">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={nextMonth}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-navy-400 transition-colors hover:bg-cloud hover:text-navy-700">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* day-of-week labels */}
          <div className="grid grid-cols-7 px-3 pt-3">
            {DAYS_SHORT.map((d, i) => (
              <span key={i} className="py-1 text-center text-[10px] font-semibold uppercase tracking-widest text-navy-400">{d}</span>
            ))}
          </div>

          {/* day grid */}
          <div className="grid grid-cols-7 gap-y-0.5 px-3 pb-3 pt-1">
            {Array.from({ length: firstDow }).map((_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: dimMonth }).map((_, i) => {
              const day = i + 1;
              const isSel   = selDay === day;
              const isToday = todayDay === day;
              return (
                <button key={day} type="button" onClick={() => selectDay(day)}
                  className={cn(
                    "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition-all",
                    isSel    && "bg-lime-500 font-bold text-navy-900 shadow-[0_2px_10px_rgba(143,208,47,0.45)]",
                    !isSel && isToday && "border border-lime-400 font-semibold text-lime-700",
                    !isSel && !isToday && "font-medium text-navy-700 hover:bg-lime-50 hover:text-lime-700",
                  )}>
                  {day}
                </button>
              );
            })}
          </div>

          {/* today shortcut */}
          <div className="border-t border-mist px-3 py-2">
            <button type="button" onClick={goToday}
              className="w-full rounded-lg py-1.5 text-xs font-medium text-navy-500 transition-colors hover:bg-cloud hover:text-navy-700">
              Astăzi — {todayStr}
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* messages */}
      {status === "error" && errMsg && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />{errMsg}
        </p>
      )}
      {status === "success" && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-lime-700">
          <Check className="h-3.5 w-3.5 shrink-0" />Dată validă.
        </p>
      )}
      {status === "idle" && help && <p className="mt-1 text-xs text-navy-400">{help}</p>}
    </div>
  );
}
