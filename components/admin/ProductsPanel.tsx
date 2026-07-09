"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useProducts, saveProduct, deleteProduct, resetProducts, seedProductsIfEmpty } from "@/lib/content";
import { blankProduct, slugify, formatPrice, type Product } from "@/lib/products";
import { Plus, Pencil, Trash, Search, RefreshCw } from "@/components/icons";

const CATEGORIES: Product["category"][] = ["Evaluare", "Accident", "Consultanță"];

export function ProductsPanel() {
  const products = useProducts();
  const [editing, setEditing] = useState<Product | null>(null);
  const [query, setQuery] = useState("");

  // La deschiderea panoului (admin logat), populăm Firestore cu produsele-seed dacă e gol.
  useEffect(() => { seedProductsIfEmpty(); }, []);

  const filtered = products.filter((p) =>
    (p.name + p.category + p.code).toLowerCase().includes(query.trim().toLowerCase())
  );

  if (editing) {
    return <ProductForm product={editing} onClose={() => setEditing(null)} />;
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-navy-800">Produse & servicii</h2>
          <p className="text-sm text-navy-400">{products.length} produse · modificările apar live pe site</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { if (confirm("Revii la produsele originale? Modificările se pierd.")) resetProducts(); }}
            className="flex items-center gap-1.5 rounded-xl border border-mist bg-white px-3 py-2.5 text-sm font-medium text-navy-500 hover:bg-cloud"
            title="Resetează la datele originale"
          >
            <RefreshCw className="h-4 w-4" /> Reset
          </button>
          <button
            onClick={() => setEditing(blankProduct())}
            className="flex items-center gap-1.5 rounded-xl bg-lime-500 px-4 py-2.5 text-sm font-semibold text-navy-900 hover:bg-lime-400"
          >
            <Plus className="h-4 w-4" /> Adaugă produs
          </button>
        </div>
      </div>

      <div className="relative mt-5 w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Caută produs…"
          className="w-full rounded-xl border border-navy-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-lime-400"
        />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="flex flex-col overflow-hidden rounded-2xl border border-mist bg-white">
            <div className="relative aspect-[5/3] bg-mesh-light">
              {p.image && (
                <Image src={p.image} alt={p.name} fill sizes="33vw" className="object-contain p-4" />
              )}
              {p.popular && (
                <span className="absolute left-3 top-3 rounded-full bg-lime-500 px-2 py-0.5 text-[10px] font-bold uppercase text-navy-900">Popular</span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-center gap-2 text-xs text-navy-400">
                <span className="rounded bg-cloud px-2 py-0.5">{p.category}</span>
                <span>Cod {p.code || "—"}</span>
              </div>
              <h3 className="mt-2 font-heading font-semibold leading-snug text-navy-800">{p.name || "(fără nume)"}</h3>
              <p className="mt-1 flex-1 text-sm text-navy-500 line-clamp-2">{p.tagline}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-heading font-bold text-navy-800">{formatPrice(p)}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditing(p)} title="Editează" className="grid h-8 w-8 place-items-center rounded-lg text-navy-500 hover:bg-mist"><Pencil className="h-4 w-4" /></button>
                  <button
                    onClick={() => { if (confirm(`Ștergi „${p.name}"?`)) deleteProduct(p.id); }}
                    title="Șterge"
                    className="grid h-8 w-8 place-items-center rounded-lg text-navy-500 hover:bg-danger/10 hover:text-danger"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── Formular produs ─────────────── */

function Labeled({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-navy-600">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-navy-400">{hint}</span>}
    </label>
  );
}

const inputCls = "w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-lime-400";

function ProductForm({ product, onClose }: { product: Product; onClose: () => void }) {
  const [p, setP] = useState<Product>({ ...product });
  const isNew = !product.slug;

  function set<K extends keyof Product>(key: K, val: Product[K]) {
    setP((prev) => ({ ...prev, [key]: val }));
  }

  function onImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") set("image", reader.result); };
    reader.readAsDataURL(file);
  }

  function save() {
    if (!p.name.trim()) { alert("Numele produsului e obligatoriu."); return; }
    const finalSlug = p.slug || slugify(p.name);
    saveProduct({
      ...p,
      slug: finalSlug,
      description: p.description.map((d) => d.trim()).filter(Boolean),
      benefits: p.benefits.map((b) => b.trim()).filter(Boolean),
    });
    onClose();
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button onClick={onClose} className="text-sm text-navy-400 hover:text-navy-700">← Înapoi la produse</button>
          <h2 className="mt-1 font-heading text-xl font-bold text-navy-800">{isNew ? "Adaugă produs" : "Editează produs"}</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="rounded-xl border border-mist bg-white px-4 py-2.5 text-sm font-medium text-navy-500 hover:bg-cloud">Anulează</button>
          <button onClick={save} className="rounded-xl bg-lime-500 px-5 py-2.5 text-sm font-semibold text-navy-900 hover:bg-lime-400">Salvează</button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4 rounded-2xl border border-mist bg-white p-5">
          <Labeled label="Nume produs"><input className={inputCls} value={p.name} onChange={(e) => set("name", e.target.value)} placeholder="ex. Evaluare Despăgubiri Cuvenite" /></Labeled>
          <div className="grid gap-4 sm:grid-cols-2">
            <Labeled label="Slug (URL)" hint="Gol = generat automat din nume">
              <input className={inputCls} value={p.slug} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="auto" />
            </Labeled>
            <Labeled label="Cod"><input className={inputCls} value={p.code} onChange={(e) => set("code", e.target.value)} placeholder="ex. EV4" /></Labeled>
          </div>
          <Labeled label="Tagline (beneficiu într-o frază)"><input className={inputCls} value={p.tagline} onChange={(e) => set("tagline", e.target.value)} /></Labeled>
          <Labeled label="Descriere scurtă (pe card)"><textarea rows={2} className={inputCls} value={p.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} /></Labeled>
          <Labeled label="Descriere completă" hint="Câte un paragraf pe rând">
            <textarea rows={4} className={inputCls} value={p.description.join("\n")} onChange={(e) => set("description", e.target.value.split("\n"))} />
          </Labeled>
          <Labeled label="Beneficii" hint="Câte un beneficiu pe rând">
            <textarea rows={3} className={inputCls} value={p.benefits.join("\n")} onChange={(e) => set("benefits", e.target.value.split("\n"))} />
          </Labeled>
        </div>

        <div className="space-y-4">
          <div className="space-y-4 rounded-2xl border border-mist bg-white p-5">
            <Labeled label="Categorie">
              <select className={inputCls} value={p.category} onChange={(e) => set("category", e.target.value as Product["category"])}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Labeled>
            <Labeled label="Preț (Lei)" hint="Gol = „La cerere”">
              <input type="number" className={inputCls} value={p.price ?? ""} onChange={(e) => set("price", e.target.value === "" ? null : Number(e.target.value))} />
            </Labeled>
            <Labeled label="Notă preț (opțional)" hint="ex. 200 Lei / oră">
              <input className={inputCls} value={p.priceNote ?? ""} onChange={(e) => set("priceNote", e.target.value || undefined)} />
            </Labeled>
            <Labeled label="Livrare"><input className={inputCls} value={p.delivery} onChange={(e) => set("delivery", e.target.value)} /></Labeled>
            <label className="flex items-center gap-2 text-sm text-navy-700">
              <input type="checkbox" checked={!!p.popular} onChange={(e) => set("popular", e.target.checked)} className="h-4 w-4 accent-lime-500" />
              Marchează ca „Popular"
            </label>
          </div>

          <div className="space-y-3 rounded-2xl border border-mist bg-white p-5">
            <span className="block text-xs font-semibold text-navy-600">Imagine</span>
            <div className="relative aspect-[5/3] overflow-hidden rounded-xl bg-mesh-light">
              {p.image && <Image src={p.image} alt="" fill sizes="300px" className="object-contain p-3" />}
            </div>
            <input className={inputCls} value={p.image.startsWith("data:") ? "(imagine încărcată)" : p.image} onChange={(e) => set("image", e.target.value)} placeholder="/images/..." />
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-navy-200 py-2.5 text-sm font-medium text-navy-500 hover:bg-cloud">
              <Plus className="h-4 w-4" /> Încarcă imagine
              <input type="file" accept="image/*" hidden onChange={onImage} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
