"use client";

import { useEffect } from "react";
import { cn } from "@/components/ui";
import { X, Spinner } from "@/components/icons";

/**
 * Modal de confirmare în stilul brandului — înlocuiește `confirm()`/`alert()`
 * native. Închidere cu Escape sau clic pe fundal. Pentru acțiuni ireversibile
 * (ștergere) folosește `danger`. Cu `busy` arată că operația e în curs.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmă",
  cancelLabel = "Anulează",
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
      if (e.key === "Enter" && !busy) onConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => !busy && onCancel()}
      className="fixed inset-0 z-[60] grid place-items-center bg-navy-950/70 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-heading text-lg font-bold text-navy-800">{title}</h3>
          <button
            type="button"
            onClick={() => !busy && onCancel()}
            aria-label="Închide"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-navy-400 transition-colors hover:bg-cloud hover:text-navy-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {message && <p className="mt-2 text-sm leading-relaxed text-navy-500">{message}</p>}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => !busy && onCancel()}
            disabled={busy}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-mist bg-white px-4 py-2.5 text-sm font-semibold text-navy-600 transition-all hover:border-navy-300 hover:bg-mist disabled:opacity-60 sm:min-h-0"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={cn(
              "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:min-h-0",
              danger ? "bg-danger text-white hover:bg-danger/90" : "bg-lime-500 text-navy-900 hover:bg-lime-400"
            )}
          >
            {busy && <Spinner className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
