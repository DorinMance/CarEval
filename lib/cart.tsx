"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { LeadItem } from "./types";

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
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "careval_cart_v1";

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

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((item: LeadItem) => {
    const uid = `${item.productSlug}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setItems((prev) => [...prev, { ...item, uid }]);
  }, []);

  const removeItem = useCallback((uid: string) => {
    setItems((prev) => prev.filter((i) => i.uid !== uid));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const total = items.reduce((s, i) => s + (i.price ?? 0), 0);

  return (
    <Ctx.Provider value={{ items, count: items.length, total, addItem, removeItem, clear, ready }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
