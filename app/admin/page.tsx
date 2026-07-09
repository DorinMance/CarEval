"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ADMIN_CREDENTIALS, login, logout, subscribeAuth } from "@/lib/auth";
import { isFirebaseEnabled } from "@/lib/firebase";
import { Logo } from "@/components/Logo";
import { cn } from "@/components/ui";
import { Lock, Shield, LogOut, FileText, Car, ClipboardList } from "@/components/icons";
import { OrdersPanel } from "@/components/admin/OrdersPanel";
import { ProductsPanel } from "@/components/admin/ProductsPanel";
import { BlogPanel } from "@/components/admin/BlogPanel";

type Tab = "comenzi" | "produse" | "blog";

const TABS: { id: Tab; label: string; Icon: typeof FileText }[] = [
  { id: "comenzi", label: "Comenzi (CRM)", Icon: ClipboardList },
  { id: "produse", label: "Produse", Icon: Car },
  { id: "blog", label: "Blog", Icon: FileText },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("comenzi");

  // Precompletate doar în modul demo (fără Firebase). Cu Firebase, câmpurile sunt goale.
  const [email, setEmail] = useState(isFirebaseEnabled ? "" : ADMIN_CREDENTIALS.email);
  const [password, setPassword] = useState(isFirebaseEnabled ? "" : ADMIN_CREDENTIALS.password);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsub = subscribeAuth((a) => {
      setAuthed(a);
      setReady(true);
    });
    return unsub;
  }, []);

  async function submit() {
    if (busy) return;
    setBusy(true);
    const ok = await login(email, password);
    setBusy(false);
    if (ok) {
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (!ready) return null;

  if (!authed) {
    return (
      <div className="bg-navy-gradient grid min-h-[85vh] place-items-center px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-800 text-lime-300">
              <Lock className="h-6 w-6" />
            </span>
            <h1 className="mt-4 font-heading text-2xl font-bold text-navy-800">Panou Administrare</h1>
            <p className="mt-1 text-sm text-navy-500">Autentifică-te pentru a gestiona site-ul.</p>
          </div>

          <div className="mt-6 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-navy-500">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-lime-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-navy-500">Parolă</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className="w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm outline-none focus:border-lime-400"
              />
            </div>
            {error && <p className="text-sm text-danger">Email sau parolă greșite.</p>}
            <button
              onClick={submit}
              disabled={busy}
              className="w-full rounded-xl bg-lime-500 px-4 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-lime-400 disabled:opacity-60"
            >
              {busy ? "Se conectează…" : "Autentificare"}
            </button>
          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-cloud py-2 text-xs text-navy-400">
            <Shield className="h-3.5 w-3.5" />
            {isFirebaseEnabled ? "Autentificare securizată prin Firebase." : "Demo: datele sunt deja completate."}
          </p>
          <Link href="/" className="mt-4 block text-center text-xs text-navy-400 hover:text-navy-700">← Înapoi pe site</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cloud">
      {/* Bara admin */}
      <div className="sticky top-0 z-30 border-b border-mist bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden rounded-full bg-navy-800 px-2.5 py-1 text-xs font-semibold text-white sm:inline">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hidden text-sm font-medium text-navy-500 hover:text-navy-800 sm:inline">Vezi site-ul ↗</Link>
            <button
              onClick={async () => { await logout(); setAuthed(false); }}
              className="flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-danger"
            >
              <LogOut className="h-4 w-4" /> Ieși
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6 lg:px-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
                tab === t.id
                  ? "border-lime-500 text-navy-800"
                  : "border-transparent text-navy-400 hover:text-navy-700"
              )}
            >
              <t.Icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {tab === "comenzi" && <OrdersPanel />}
        {tab === "produse" && <ProductsPanel />}
        {tab === "blog" && <BlogPanel />}
      </div>
    </div>
  );
}
