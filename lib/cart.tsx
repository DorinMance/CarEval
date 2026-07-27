"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import type { LeadItem } from "./types";
import { lineTotal } from "./products";

export interface CartItem extends LeadItem {
  uid: string; // id unic în coș
}

interface CartCtx {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: LeadItem) => void;
  removeItem: (uid: string) => void;
  clear: () => void;
  ready: boolean;
  /** Coșul nu a putut fi salvat local (cotă depășită). Rămâne valid în memorie. */
  storageFull: boolean;
  /**
   * Numărul comenzii curente, STABIL cât timp coșul nu s-a finalizat. Generat o
   * singură dată, la prima încercare de plată, și reutilizat la reîncercări —
   * astfel o comandă reluată de 3 ori nu creează 3 lead-uri, ci suprascrie unul.
   * Se resetează la `clear()` (comandă finalizată sau coș golit).
   */
  getOrderID: () => string;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "careval_cart_v1";
const ORDER_KEY = "careval_order_id_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  const [storageFull, setStorageFull] = useState(false);

  useEffect(() => {
    if (!ready) return;
    // Fără try/catch, QuotaExceededError (poze prea mari) arunca dintr-un efect
    // și rupea randarea → pagină albă și coș pierdut. Acum coșul rămâne funcțional
    // în memorie, doar persistența se pierde, iar utilizatorul e avertizat.
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
      // Actualizăm doar la schimbare, ca să nu declanșăm randări în cascadă.
      setStorageFull((f) => (f ? false : f));
    } catch {
      setStorageFull((f) => (f ? f : true));
    }
  }, [items, ready]);

  // Numărul comenzii curente, ținut într-un ref + localStorage ca să supraviețuiască
  // redirecturilor către banca și revenirilor pe pagină.
  const orderIDRef = useRef<string | null>(null);
  useEffect(() => {
    try { orderIDRef.current = localStorage.getItem(ORDER_KEY); } catch {}
  }, []);

  /**
   * Uită numărul de comandă, ca următoarea plată să primească unul nou.
   *
   * Se apelează ori de câte ori se SCHIMBĂ conținutul coșului. Motivul: documentul
   * comenzii din Firestore e cheiat pe acest număr, iar clientul (nelogat) are voie
   * doar să CREEZE documente, nu să le modifice. Dacă numărul ar fi refolosit pentru
   * un coș diferit, salvarea ar fi respinsă tăcut, iar în panou ar rămâne comanda
   * VECHE — în timp ce emailul de notificare ar conține datele noi. Exact asta s-a
   * întâmplat în producție: mail cu o comandă, CRM cu alta.
   *
   * Reluarea aceleiași plăți (fără a umbla la coș) păstrează numărul, deci o plată
   * reîncercată nu creează comenzi duplicate — comportamentul dorit inițial.
   */
  const resetOrderID = useCallback(() => {
    orderIDRef.current = null;
    try { localStorage.removeItem(ORDER_KEY); } catch {}
  }, []);

  const addItem = useCallback((item: LeadItem) => {
    const uid = `${item.productSlug}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setItems((prev) => [...prev, { ...item, uid }]);
    resetOrderID();
  }, [resetOrderID]);

  const removeItem = useCallback((uid: string) => {
    setItems((prev) => prev.filter((i) => i.uid !== uid));
    resetOrderID();
  }, [resetOrderID]);

  const getOrderID = useCallback(() => {
    if (!orderIDRef.current) {
      orderIDRef.current = `CE-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      try { localStorage.setItem(ORDER_KEY, orderIDRef.current); } catch {}
    }
    return orderIDRef.current;
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    resetOrderID(); // următoarea comandă primește un număr nou
  }, [resetOrderID]);

  // Totalul include opțiunea „raport tipărit" (+65 Lei), altfel cei 65 nu apăreau
  // nicăieri deși bifa se salva.
  const total = items.reduce((s, i) => s + (lineTotal(i) ?? 0), 0);

  return (
    <Ctx.Provider value={{ items, count: items.length, total, addItem, removeItem, clear, ready, storageFull, getOrderID }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
