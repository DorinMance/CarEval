"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { listLeads, updateLeadStatus, deleteLead, seedIfEmpty } from "@/lib/db";
import type { Lead, LeadStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import { fieldLabel, imageLabel } from "@/lib/labels";
import { cn } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { Check, Clock, FileText, Phone, Mail, MapPin, X, Shield } from "@/components/icons";

const STATUS_STYLES: Record<LeadStatus, string> = {
  nou: "bg-lime-100 text-lime-700",
  in_lucru: "bg-amber-100 text-amber-700",
  finalizat: "bg-navy-100 text-navy-600",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [code, setCode] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<LeadStatus | "all">("all");

  useEffect(() => {
    if (!authed) return;
    seedIfEmpty();
    const refresh = () => setLeads(listLeads());
    refresh();
    window.addEventListener("careval:leads-updated", refresh);
    return () => window.removeEventListener("careval:leads-updated", refresh);
  }, [authed]);

  const filtered = useMemo(
    () => (filter === "all" ? leads : leads.filter((l) => l.status === filter)),
    [leads, filter]
  );
  const selected = leads.find((l) => l.id === selectedId) ?? filtered[0] ?? null;

  const stats = useMemo(() => {
    const nou = leads.filter((l) => l.status === "nou").length;
    const inLucru = leads.filter((l) => l.status === "in_lucru").length;
    const finalizat = leads.filter((l) => l.status === "finalizat").length;
    const value = leads.reduce((s, l) => s + (l.total ?? 0), 0);
    return { total: leads.length, nou, inLucru, finalizat, value };
  }, [leads]);

  if (!authed) {
    return (
      <div className="bg-navy-gradient grid min-h-[80vh] place-items-center px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
          <Logo />
          <h1 className="mt-6 font-heading text-2xl font-bold text-navy-800">Panou Admin · CRM</h1>
          <p className="mt-2 text-sm text-navy-500">Demo. Introdu codul de acces pentru a continua.</p>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setAuthed(true)}
            placeholder="cod acces"
            className="mt-5 w-full rounded-xl border border-navy-200 px-4 py-2.5 text-center text-sm outline-none focus:border-lime-400"
          />
          <button
            onClick={() => setAuthed(true)}
            className="mt-3 w-full rounded-xl bg-lime-500 px-4 py-2.5 text-sm font-semibold text-navy-900 hover:bg-lime-400"
          >
            Intră în panou
          </button>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-navy-400">
            <Shield className="h-3.5 w-3.5" /> Demo: orice cod funcționează.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cloud">
      <div className="border-b border-mist bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-navy-800 px-2.5 py-1 text-xs font-semibold text-white">CRM Demo</span>
          </div>
          <Link href="/" className="text-sm font-medium text-navy-500 hover:text-navy-800">← Înapoi pe site</Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { l: "Lead-uri totale", v: stats.total, icon: <FileText className="h-5 w-5" /> },
            { l: "Noi", v: stats.nou, icon: <Clock className="h-5 w-5" /> },
            { l: "În lucru", v: stats.inLucru, icon: <Clock className="h-5 w-5" /> },
            { l: "Valoare estimată", v: `${stats.value.toLocaleString("ro-RO")} Lei`, icon: <Check className="h-5 w-5" /> },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-mist bg-white p-5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy-800 text-lime-300">{s.icon}</span>
              <p className="mt-3 font-heading text-2xl font-bold text-navy-800">{s.v}</p>
              <p className="text-sm text-navy-400">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          {(["all", "nou", "in_lucru", "finalizat"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                filter === f ? "bg-navy-800 text-white" : "bg-white text-navy-500 hover:bg-mist"
              )}
            >
              {f === "all" ? "Toate" : STATUS_LABELS[f]}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          {/* List */}
          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-navy-200 p-8 text-center text-navy-400">
                Niciun lead pentru acest filtru.
              </div>
            )}
            {filtered.map((lead) => (
              <button
                key={lead.id}
                onClick={() => setSelectedId(lead.id)}
                className={cn(
                  "w-full rounded-2xl border bg-white p-4 text-left transition-all",
                  selected?.id === lead.id ? "border-lime-400 ring-2 ring-lime-100" : "border-mist hover:border-navy-200"
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-heading font-semibold text-navy-800">{lead.contact.nume}</p>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLES[lead.status])}>
                    {STATUS_LABELS[lead.status]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-navy-500">
                  {lead.items.map((i) => i.productName).join(", ")}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-navy-400">
                  <span>{new Date(lead.createdAt).toLocaleString("ro-RO", { dateStyle: "medium", timeStyle: "short" })}</span>
                  <span className="font-semibold text-navy-600">{lead.total != null ? `${lead.total.toLocaleString("ro-RO")} Lei` : "La cerere"}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          {selected ? (
            <LeadDetail key={selected.id} lead={selected} />
          ) : (
            <div className="hidden rounded-2xl border border-dashed border-navy-200 p-10 text-center text-navy-400 lg:grid lg:place-items-center">
              Selectează un lead pentru detalii.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LeadDetail({ lead }: { lead: Lead }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-mist bg-white">
      <div className="border-b border-mist p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-navy-800">{lead.contact.nume}</h2>
            <p className="text-sm text-navy-400">
              {new Date(lead.createdAt).toLocaleString("ro-RO", { dateStyle: "full", timeStyle: "short" })}
            </p>
          </div>
          <span className="font-heading text-lg font-bold text-navy-800">
            {lead.total != null ? `${lead.total.toLocaleString("ro-RO")} Lei` : "La cerere"}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <a href={`tel:${lead.contact.telefon}`} className="flex items-center gap-2 text-navy-600 hover:text-lime-600"><Phone className="h-4 w-4 text-lime-600" /> {lead.contact.telefon}</a>
          <a href={`mailto:${lead.contact.email}`} className="flex items-center gap-2 text-navy-600 hover:text-lime-600"><Mail className="h-4 w-4 text-lime-600" /> {lead.contact.email}</a>
          {lead.contact.localitate && <span className="flex items-center gap-2 text-navy-600"><MapPin className="h-4 w-4 text-lime-600" /> {lead.contact.localitate}</span>}
        </div>
        {lead.contact.mesaj && (
          <p className="mt-3 rounded-xl bg-cloud p-3 text-sm text-navy-600">{lead.contact.mesaj}</p>
        )}

        {/* status control */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-navy-500">Status:</span>
          {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => updateLeadStatus(lead.id, s)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                lead.status === s ? STATUS_STYLES[s] + " ring-2 ring-offset-1 ring-navy-200" : "bg-cloud text-navy-400 hover:bg-mist"
              )}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
          <button
            onClick={() => deleteLead(lead.id)}
            className="ml-auto text-xs font-medium text-navy-400 hover:text-danger"
          >
            Șterge
          </button>
        </div>
      </div>

      {/* items */}
      <div className="space-y-6 p-6">
        {lead.items.map((item, idx) => {
          const dataEntries = Object.entries(item.data).filter(([, v]) => v !== "" && v !== false);
          return (
            <div key={idx} className="rounded-2xl border border-mist p-5">
              <div className="flex items-center justify-between">
                <p className="font-heading font-semibold text-navy-800">{item.productName}</p>
                <span className="rounded-md bg-cloud px-2 py-0.5 text-xs font-medium text-navy-500">Cod {item.code}</span>
              </div>

              {dataEntries.length > 0 && (
                <dl className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {dataEntries.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 border-b border-mist/60 py-1 text-sm">
                      <dt className="text-navy-400">{fieldLabel(k)}</dt>
                      <dd className="text-right font-medium text-navy-800">{v === true ? "Da" : String(v)}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {/* images by group */}
              {Object.entries(item.images).map(([group, srcs]) =>
                srcs.length ? (
                  <div key={group} className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-400">{imageLabel(group)} ({srcs.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {srcs.map((src, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={i}
                          src={src}
                          alt={`${imageLabel(group)} ${i + 1}`}
                          onClick={() => setLightbox(src)}
                          className="h-16 w-16 cursor-zoom-in rounded-lg border border-mist object-cover transition-transform hover:scale-105"
                        />
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          );
        })}
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 grid place-items-center bg-navy-950/80 p-6 backdrop-blur-sm"
        >
          <button className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white" aria-label="Închide">
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="Previzualizare" className="max-h-[85vh] max-w-full rounded-xl" />
        </div>
      )}
    </div>
  );
}
