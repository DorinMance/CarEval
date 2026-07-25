"use client";

import { useEffect, useMemo, useState } from "react";
import { subscribeLeads, updateLeadStatus, deleteLead, seedIfEmpty, resolveImageUrl, setLeadInvoice } from "@/lib/db";
import type { Lead, LeadStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import { PRINT_FEE } from "@/lib/products";
import { fbAuth } from "@/lib/firebase";
import { fieldLabel, imageLabel } from "@/lib/labels";
import { cn } from "@/components/ui";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Lottie } from "@/components/Lottie";
import { Check, Clock, FileText, Phone, Mail, MapPin, X, Search, Trash, ImagePlus, ChevronRight, Banknote, Spinner } from "@/components/icons";

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
    seedIfEmpty(); // no-op cu Firebase; încarcă demo doar în modul local
    const unsub = subscribeLeads(setLeads);
    return unsub;
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
          // Numărul de comandă e primul lucru pe care îl spune un client la telefon.
          l.orderID ?? "",
          l.contact.nume, l.contact.email, l.contact.telefon, l.contact.localitate ?? "",
          ...l.items.map((i) => i.productName),
          ...l.items.flatMap((i) => Object.values(i.data).map(String)),
        ].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [leads, filter, product, query]);

  // `selected` = comanda aleasă efectiv (null dacă niciuna). Pe mobil, ea decide
  // dacă vezi lista sau detaliul — de aceea NU trebuie să cadă pe filtered[0],
  // altfel lista ar fi mereu ascunsă și butonul „Înapoi" ar părea mort.
  const selected = leads.find((l) => l.id === selectedId) ?? null;
  // `detailLead` = ce se afișează în panoul de detaliu. Pe desktop arată automat
  // prima comandă când nu e nimic ales; pe mobil e relevant doar când `selected`.
  const detailLead = selected ?? filtered[0] ?? null;

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
          { l: "Valoare estimată", v: `${stats.value.toLocaleString("ro-RO")} Lei`, icon: <Banknote className="h-5 w-5" /> },
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
            className="w-full min-w-0 max-w-full truncate rounded-xl border border-navy-200 bg-white px-3 py-2.5 text-sm text-navy-700 outline-none focus:border-lime-400 sm:w-auto sm:max-w-[16rem]"
          >
            <option value="all">Toate serviciile</option>
            {productNames.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          {(["all", "nou", "in_lucru", "finalizat"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-medium transition-all sm:min-h-0 sm:py-1.5",
                filter === f
                  ? "bg-navy-800 text-white shadow-sm"
                  : "border border-mist bg-white text-navy-500 hover:border-navy-300 hover:bg-mist hover:text-navy-800 hover:shadow-sm"
              )}
            >
              {f === "all" ? "Toate" : STATUS_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-navy-400">{filtered.length} din {leads.length} comenzi</p>

      {/* Pe desktop, fiecare coloană are propriul scroll (bară separată), ca
          detaliul din dreapta să rămână vizibil când derulezi lista din stânga.
          Pe mobil rămâne fluxul normal, una sub alta. */}
      <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        {/* List — pe mobil se ascunde când e deschisă o comandă (vezi doar detaliul);
            pe desktop rămâne mereu vizibilă lângă detaliu. */}
        <div className={cn(
          "space-y-3 lg:sticky lg:top-[6.5rem] lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:self-start lg:pr-1",
          selected && "hidden lg:block"
        )}>
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
                detailLead?.id === lead.id ? "border-lime-400 ring-2 ring-lime-100" : "border-mist hover:border-navy-200"
              )}
            >
              <div className="flex items-center justify-between">
                <p className="font-heading font-semibold text-navy-800">{lead.contact.nume}</p>
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLES[lead.status])}>
                  {STATUS_LABELS[lead.status]}
                </span>
              </div>
              <p className="mt-1 text-sm text-navy-500">{lead.items.map((i) => i.productName).join(", ")}</p>
              {lead.orderID && (
                <p className="mt-1 font-mono text-[11px] text-navy-400">{lead.orderID}</p>
              )}
              <div className="mt-2 flex items-center justify-between text-xs text-navy-400">
                <span>{new Date(lead.createdAt).toLocaleString("ro-RO", { dateStyle: "medium", timeStyle: "short" })}</span>
                <span className="font-semibold text-navy-600">{lead.total != null ? `${lead.total.toLocaleString("ro-RO")} Lei` : "La cerere"}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail — pe mobil apare doar când e selectată o comandă, cu buton de întoarcere;
            scroll propriu pe desktop, lipit sub bara admin. */}
        <div className={cn(
          "lg:sticky lg:top-[6.5rem] lg:max-h-[calc(100dvh-8rem)] lg:self-start lg:overflow-y-auto lg:pr-1",
          !selected && "hidden lg:block"
        )}>
          {detailLead ? (
            <>
              {/* Butonul de întoarcere apare doar pe mobil și doar dacă utilizatorul
                  a ales efectiv o comandă (nu la auto-afișarea de pe desktop). */}
              {selected && (
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="mb-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-800 lg:hidden"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" /> Înapoi la comenzi
                </button>
              )}
              <LeadDetail key={detailLead.id} lead={detailLead} />
            </>
          ) : (
            <div className="hidden rounded-2xl border border-dashed border-navy-200 p-10 text-center text-navy-400 lg:grid lg:place-items-center">
              Selectează o comandă pentru istoricul complet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Starea plății pentru o comandă, ca operatorul să vadă dacă s-a încasat fără
 * să deschidă panoul NETOPIA.
 *
 * Sursa permanentă e chiar comanda din Firestore: IPN-ul NETOPIA scrie
 * `plataStare` / `plataNtpID` pe document (prin Admin SDK), deci badge-ul supra-
 * viețuiește repornirilor funcției serverless. Doar dacă lipsește (comenzi vechi,
 * dinainte de persistare) cădem pe registrul din memoria serverului.
 */
function StarePlata({ lead }: { lead: Lead }) {
  const [info, setInfo] = useState<{ state?: string; ntpID?: string } | null>(null);

  useEffect(() => {
    // Dacă starea e deja pe comandă (Firestore), nu mai interogăm memoria.
    if (lead.plataStare || !lead.orderID) return;
    let viu = true;
    fetch(`/api/plata/status?orderID=${encodeURIComponent(lead.orderID)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { if (viu) setInfo(d); })
      .catch(() => { if (viu) setInfo(null); });
    return () => { viu = false; };
  }, [lead.orderID, lead.plataStare]);

  const orderID = lead.orderID!;
  const state = lead.plataStare ?? info?.state;
  const ntpID = lead.plataNtpID ?? info?.ntpID;
  const eticheta =
    state === "platit" ? { txt: "Plătit", cls: "bg-lime-100 text-lime-700" } :
    state === "esuat" ? { txt: "Plată eșuată", cls: "bg-red-100 text-red-700" } :
    state === "in_asteptare" ? { txt: "Plată în așteptare", cls: "bg-amber-100 text-amber-700" } :
    null;

  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-2">
      <span className="rounded-md bg-cloud px-2 py-1 font-mono text-xs text-navy-600">
        Comandă: {orderID}
      </span>
      {eticheta && (
        <span className={cn("rounded-md px-2 py-1 text-xs font-semibold", eticheta.cls)}>
          {eticheta.txt}
        </span>
      )}
      {ntpID && (
        <span className="rounded-md bg-cloud px-2 py-1 font-mono text-xs text-navy-500">
          ID plată: {ntpID}
        </span>
      )}
    </div>
  );
}

/**
 * Buton de facturare manuală în SmartBill.
 *
 * Construiește liniile facturii din comandă (prețurile sunt cu TVA inclus) și
 * apelează ruta protejată `/api/factura`, semnată cu ID-token-ul de admin.
 * NU trimite factura pe mail — doar o generează în SmartBill, pentru ca
 * proprietarul s-o verifice și s-o trimită el. La succes, comanda rămâne
 * marcată „Facturat · <serie+număr>".
 */
function buildInvoiceItems(lead: Lead): { name: string; price: number }[] {
  const items = lead.items
    .filter((i) => i.price != null && i.price > 0)
    .map((i) => ({ name: i.productName, price: i.price as number }));
  const printCount = lead.items.filter((i) => i.data?.raportTiparit === true).length;
  if (printCount > 0) {
    items.push({
      name: printCount > 1 ? `Raport tipărit (expediere) × ${printCount}` : "Raport tipărit (expediere prin curier)",
      price: PRINT_FEE * printCount,
    });
  }
  return items;
}

function FacturaSmartBill({ lead }: { lead: Lead }) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [msg, setMsg] = useState<string | null>(null);
  const [nr, setNr] = useState<string | null>(lead.facturaNr ?? null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const items = buildInvoiceItems(lead);
  const facturabil = items.length > 0;

  async function factureaza() {
    if (state === "loading") return;
    setConfirmOpen(false);
    setState("loading");
    setMsg(null);
    try {
      const token = await fbAuth()?.currentUser?.getIdToken();
      if (!token) {
        setState("error");
        setMsg("Trebuie să fii autentificat pentru a factura.");
        return;
      }
      const res = await fetch("/api/factura", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderID: lead.orderID ?? lead.id, items, contact: lead.contact }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setState("error");
        setMsg(data?.message ? `SmartBill: ${data.message}` : "Emiterea facturii a eșuat.");
        return;
      }
      const numarComplet = `${data.series ?? ""}${data.number ?? ""}`;
      setNr(numarComplet);
      setState("idle");
      try {
        await setLeadInvoice(lead.id, numarComplet);
      } catch {
        /* factura e emisă; doar marcajul în CRM a eșuat — nu blocăm */
      }
    } catch {
      setState("error");
      setMsg("Eroare de rețea la emiterea facturii.");
    }
  }

  if (!facturabil) return null;

  return (
    <div className="mt-4 rounded-xl border border-mist bg-cloud/40 p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-navy-700">
            <FileText className="h-4 w-4 text-lime-600" /> Facturare SmartBill
          </p>
          {nr ? (
            <p className="mt-0.5 text-xs text-navy-500">
              Factură emisă: <span className="font-mono font-semibold text-navy-800">{nr}</span>
              {lead.facturaData ? ` · ${new Date(lead.facturaData).toLocaleDateString("ro-RO")}` : ""}
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-navy-400">Generează factura în SmartBill (nu se trimite pe mail).</p>
          )}
        </div>

        {nr ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-lime-100 px-3 py-2 text-xs font-semibold text-lime-700">
            <Check className="h-3.5 w-3.5" /> Facturat
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={state === "loading"}
            className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg bg-navy-800 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-navy-700 hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm sm:min-h-0"
          >
            {state === "loading" ? <Spinner className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
            {state === "loading" ? "Se emite…" : "Facturează"}
          </button>
        )}
      </div>

      {nr && (
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={state === "loading"}
          className="mt-2 text-[11px] font-medium text-navy-400 underline-offset-2 hover:text-navy-700 hover:underline disabled:opacity-60"
        >
          {state === "loading" ? "Se emite…" : "Emite din nou o factură"}
        </button>
      )}

      {state === "error" && msg && <p className="mt-2 text-xs font-medium text-danger">{msg}</p>}

      <ConfirmDialog
        open={confirmOpen}
        title="Emiți factura în SmartBill?"
        message={`Factura pentru ${lead.contact.nume} se creează în contul SmartBill, dar NU se trimite pe mail — o verifici și o trimiți tu.`}
        confirmLabel="Emite factura"
        busy={state === "loading"}
        onConfirm={factureaza}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

function LeadDetail({ lead }: { lead: Lead }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [statusBusy, setStatusBusy] = useState<LeadStatus | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function schimbaStatus(s: LeadStatus) {
    if (statusBusy || lead.status === s) return;
    setStatusBusy(s);
    try { await updateLeadStatus(lead.id, s); } finally { setStatusBusy(null); }
  }
  async function stergeComanda() {
    setDeleting(true);
    try { await deleteLead(lead.id); } finally { setDeleting(false); setConfirmDel(false); }
  }

  return (
    <div className="rounded-2xl border border-mist bg-white">
      <div className="border-b border-mist p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-navy-800">{lead.contact.nume}</h2>
            <p className="text-sm text-navy-400">
              {new Date(lead.createdAt).toLocaleString("ro-RO", { dateStyle: "full", timeStyle: "short" })}
            </p>
            {lead.orderID && <StarePlata lead={lead} />}
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

        {/* Datele de facturare — ce trebuie să apară pe factură. */}
        {(lead.contact.adresa || lead.contact.facturaFirma) && (
          <div className="mt-3 rounded-xl border border-mist bg-cloud/60 p-3.5 text-sm">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-navy-400">Date facturare</p>
            {lead.contact.facturaFirma ? (
              <div className="space-y-0.5 text-navy-700">
                <p><span className="font-semibold">Factură pe firmă:</span> {lead.contact.firmaNume}</p>
                <p><span className="font-semibold">CIF:</span> {lead.contact.firmaCui}
                  {lead.contact.firmaRegCom ? <> · <span className="font-semibold">Reg. Com.:</span> {lead.contact.firmaRegCom}</> : null}</p>
                {(lead.contact.adresa || lead.contact.judet) && (
                  <p className="text-navy-600">{[lead.contact.adresa, lead.contact.localitate, lead.contact.judet].filter(Boolean).join(", ")}</p>
                )}
              </div>
            ) : (
              <p className="text-navy-700">
                <span className="font-semibold">Persoană fizică</span> · {[lead.contact.adresa, lead.contact.localitate, lead.contact.judet].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
        )}

        <FacturaSmartBill lead={lead} />

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-navy-500">Status:</span>
          {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => schimbaStatus(s)}
              disabled={!!statusBusy}
              className={cn(
                "inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-0 sm:py-1",
                lead.status === s
                  ? STATUS_STYLES[s] + " ring-2 ring-offset-1 ring-navy-200"
                  : "bg-cloud text-navy-500 hover:bg-mist hover:text-navy-800 hover:shadow-sm"
              )}
            >
              {statusBusy === s && <Spinner className="h-3 w-3 animate-spin" />}
              {STATUS_LABELS[s]}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setConfirmDel(true)}
            className="ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs font-semibold text-danger transition-all hover:border-danger/50 hover:bg-danger/10 hover:shadow-sm active:scale-[0.98] sm:min-h-0"
          >
            <Trash className="h-3.5 w-3.5" /> Șterge comanda
          </button>
        </div>

        <ConfirmDialog
          open={confirmDel}
          title="Ștergi comanda?"
          message={`Comanda de la ${lead.contact.nume} se șterge definitiv — datele și pozele se pierd.`}
          confirmLabel="Șterge definitiv"
          danger
          busy={deleting}
          onConfirm={stergeComanda}
          onCancel={() => setConfirmDel(false)}
        />
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
                            <LeadImage key={i} src={src} alt={`${imageLabel(group)} ${i + 1}`} onZoom={setLightbox} />
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
          <button onClick={() => setLightbox(null)} className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20" aria-label="Închide">
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="Previzualizare" className="max-h-[85vh] max-w-full rounded-xl" />
        </div>
      )}
    </div>
  );
}

/** Miniatură care rezolvă calea Storage → URL de download (doar în admin, logat). */
function LeadImage({ src, alt, onZoom }: { src: string; alt: string; onZoom: (url: string) => void }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    resolveImageUrl(src).then((u) => alive && setUrl(u));
    return () => {
      alive = false;
    };
  }, [src]);

  if (!url) return <div className="h-16 w-16 animate-pulse rounded-lg border border-mist bg-cloud" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      onClick={() => onZoom(url)}
      className="h-16 w-16 cursor-zoom-in rounded-lg border border-mist object-cover transition-transform hover:scale-105"
    />
  );
}
