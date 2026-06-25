"use client";
import { useState } from "react";

export function FAQAccordion({ faqs }: { faqs: [string, string][] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mx-auto mt-10 max-w-3xl space-y-3">
      {faqs.map(([q, a], i) => (
        <div
          key={q}
          className={`rounded-2xl border bg-white transition-colors duration-200 ${
            open === i ? "border-lime-400/40 shadow-[0_4px_24px_rgba(143,208,47,0.07)]" : "border-mist"
          }`}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between p-5 text-left"
            aria-expanded={open === i}
          >
            <span className="font-heading font-semibold text-navy-800">{q}</span>
            <span
              className="ml-4 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cloud text-navy-500 transition-transform duration-300"
              style={{ transform: open === i ? "rotate(45deg)" : "none" }}
            >
              +
            </span>
          </button>
          <div
            className="grid"
            style={{
              gridTemplateRows: open === i ? "1fr" : "0fr",
              transition: "grid-template-rows 320ms cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          >
            <div className="overflow-hidden">
              <p className="px-5 pb-5 text-sm leading-relaxed text-navy-500">{a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
