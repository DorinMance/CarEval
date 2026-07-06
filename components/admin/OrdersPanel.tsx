"use client";

import { useEffect, useMemo, useState } from "react";
import { listLeads, updateLeadStatus, deleteLead, seedIfEmpty } from "@/lib/db";
import type { Lead, LeadStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import { fieldLabel, imageLabel } from "@/lib/labels";
import { cn } from "@/components/ui";
import { Lottie } from "@/components/Lottie";
import { Check, Clock, FileText, Phone, Mail, MapPin, X, Search, Trash, ImagePlus } from "@/components/icons";

const STATUS_STYLES: Record<LeadStatus, string> = {
  nou: "bg-lime-100 text-lime-700",
  in_lucru: "bg-amber-100 text-amber-700",
  finalizat: "bg-navy-100 text-navy-600",
};

export function OrdersPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [product, setProduct] = useState<string>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    seedIfEmpty();
    const refresh = () => setLeads(listLeads());
    refresh();
    window.addEventListener("careval:leads-updated", refresh);
    return () => window.removeEventListener("careval:leads-updated", refresh);
  }, []);

  const productNames = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => l.items.forEach((i) => set.add(i.productName)));
    return Array.from(set).sort();
  }, [leads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (filter !== "all" && l.status !== filter) return false;
      if (product !== "all" && !l.items.some((i) => i.productName === product)) return false;
      if (q) {
        const hay = [
          l.contact.nume, l.contact.email, l.contact.telefon, l.contact.localitate ?? "",
          ...l.items.map((i) => i.productName),
          ...l.items.flatMap((i) => Object.values(i.data).map(String)),
        ].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [leads, filter, product, query]);

  const selected = leads.find((l) => l.id === selectedId) ?? filtered[0] ?? null;

  const stats = useMemo(() => {
    const nou = leads.filter((l) => l.status === "nou").length;
    const inLucru = leads.filter((l) => l.status === "in_lucru").length;
    const value = leads.reduce((s, l) => s + (l.total ?? 0), 0);
    return { total: leads.length, nou, inLucru, value };
  }, [leads]);

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { l: "Comenzi totale", v: stats.total, icon: <FileText className="h-5 w-5" /> },
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

      {/* Search + filters */}
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Caută după nume, email, telefon, mașină…"
            className="w-full rounded-xl border border-navy-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-lime-400"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="rounded-xl border border-navy-200 bg-white px-3 py-2 text-sm text-navy-700 outline-none focus:border-lime-400"
          >
            <option value="all">Toate serviciile</option>
            {productNames.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          {(["all", "nou", "in_lucru", "finalizat"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                filter === f ? "bg-navy-800 text-white" : "bg-white text-navy-500 hover:bg-mist border border-mist"
              )}
            >
              {f === "all" ? "Toate" : STATUS_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-navy-400">{filtered.length} din {leads.length} comenzi</p>

      <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        {/* List */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="grid place-items-center rounded-2xl border border-dashed border-navy-200 p-8 text-center text-navy-400">
              <Lottie src="/lottie/empty-box.lottie" size={130} />
              <p className="mt-1">Nicio comandă pentru aceste criterii.</p>
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
              <p className="mt-1 text-sm text-navy-500">{lead.items.map((i) => i.productName).join(", ")}</p>
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
            Selectează o comandă pentru istoricul complet.
          </div>
        )}
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
        {lead.contact.mesaj && <p className="mt-3 rounded-xl bg-cloud p-3 text-sm text-navy-600">{lead.contact.mesaj}</p>}

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
            onClick={() => { if (confirm(`Ștergi definitiv comanda de la ${lead.contact.nume}? Datele și pozele se pierd.`)) deleteLead(lead.id); }}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs font-semibold text-danger transition-colors hover:bg-danger/10"
          >
            <Trash className="h-3.5 w-3.5" /> Șterge clientul
          </button>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {lead.items.map((item, idx) => {
          const dataEntries = Object.entries(item.data).filter(([, v]) => v !== "" && v !== false);
          const imageGroups = Object.entries(item.images).filter(([, srcs]) => srcs.length > 0);
          const totalImgs = imageGroups.reduce((n, [, srcs]) => n + srcs.length, 0);
          return (
            <div key={idx} className="rounded-2xl border border-mist p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-heading font-semibold text-navy-800">{item.productName}</p>
                <div className="flex items-center gap-2">
                  {item.price != null && (
                    <span className="rounded-md bg-lime-50 px-2 py-0.5 text-xs font-semibold text-lime-700">{item.price.toLocaleString("ro-RO")} Lei</span>
                  )}
                  <span className="rounded-md bg-cloud px-2 py-0.5 text-xs font-medium text-navy-500">Cod {item.code}</span>
                </div>
              </div>

              {/* Toate câmpurile completate de client */}
              {dataEntries.length > 0 ? (
                <dl className="mt-4 grid gap-x-6 gap-y-1 sm:grid-cols-2">
                  {dataEntries.map(([k, v]) => {
                    const val = v === true ? "Da" : String(v);
                    const long = val.length > 40;
                    return (
                      <div
                        key={k}
                        className={cn("border-b border-mist/60 py-1.5 text-sm", long ? "sm:col-span-2" : "flex justify-between gap-3")}
                      >
                        <dt className="shrink-0 text-navy-400">{fieldLabel(k)}</dt>
                        <dd className={cn("font-medium text-navy-800", long ? "mt-0.5 whitespace-pre-wrap break-words" : "min-w-0 break-words text-right")}>{val}</dd>
                      </div>
                    );
                  })}
                </dl>
              ) : (
                <p className="mt-4 text-sm text-navy-400">Clientul nu a completat câmpuri text pentru acest serviciu.</p>
              )}

              {/* Toate pozele încărcate, pe grupuri */}
              {totalImgs > 0 ? (
                <div className="mt-5 border-t border-mist pt-4">
                  <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-navy-500">
                    <ImagePlus className="h-4 w-4 text-lime-600" /> Fotografii încărcate ({totalImgs})
                  </p>
                  <div className="space-y-3">
                    {imageGroups.map(([group, srcs]) => (
                      <div key={group}>
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-navy-400">{imageLabel(group)} ({srcs.length})</p>
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
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-4 flex items-center gap-1.5 text-sm text-navy-400">
                  <ImagePlus className="h-4 w-4" /> Nicio fotografie încărcată.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {lightbox && (
        <div onClick={() => setLightbox(null)} className="fixed inset-0 z-50 grid place-items-center bg-navy-950/80 p-6 backdrop-blur-sm">
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
