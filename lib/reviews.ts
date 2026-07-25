"use client";

// Recenzii la produse, cu moderare în admin.
//
// Fluxul: oricine (fără cont) poate trimite o recenzie de pe pagina produsului.
// Ea intră cu status „pending" și NU apare pe site până când adminul o aprobă.
// Adminul vede toate recenziile și le aprobă / respinge / șterge.
//
// - Cu Firebase: colecția Firestore `reviews`. Public se citesc DOAR cele
//   aprobate (query pe status == 'approved', ca regulile să permită citirea);
//   filtrarea pe produs + sortarea se fac în client, ca să nu fie nevoie de
//   indecși compuși. Adminul citește toată colecția.
// - Fără Firebase (demo): localStorage.

import { useEffect, useState } from "react";
import { isFirebaseEnabled, fbDb } from "./firebase";
import {
  collection, doc, addDoc, setDoc, deleteDoc, updateDoc, onSnapshot, query, where,
} from "firebase/firestore";

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface Review {
  id: string;
  productSlug: string;
  author: string;
  rating: number; // 1..5
  text: string;
  createdAt: number;
  status: ReviewStatus;
}

export interface ReviewInput {
  productSlug: string;
  author: string;
  rating: number;
  text: string;
}

const COL = "reviews";
const KEY = "careval_reviews_v1";
const EVENT = "careval:reviews-updated";

/* ─────────── localStorage (mod demo) ─────────── */
function read(): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}
function write(list: Review[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(EVENT));
}

/** Curăță și mărginește datele venite din formular (apărare de bază). */
function sanitize(input: ReviewInput) {
  const rating = Math.min(5, Math.max(1, Math.round(Number(input.rating) || 0)));
  return {
    productSlug: String(input.productSlug).slice(0, 120),
    author: input.author.trim().slice(0, 80),
    text: input.text.trim().slice(0, 1500),
    rating,
  };
}

/* ─────────── API public ─────────── */

/** Trimite o recenzie nouă. Intră mereu ca „pending". */
export async function submitReview(input: ReviewInput): Promise<void> {
  const clean = sanitize(input);
  const base = { ...clean, status: "pending" as ReviewStatus, createdAt: Date.now() };
  if (isFirebaseEnabled) {
    await addDoc(collection(fbDb()!, COL), base);
    return;
  }
  const list = read();
  list.unshift({ ...base, id: `local-${Date.now()}` });
  write(list);
}

export async function setReviewStatus(id: string, status: ReviewStatus): Promise<void> {
  if (isFirebaseEnabled) {
    await updateDoc(doc(fbDb()!, COL, id), { status });
    return;
  }
  write(read().map((r) => (r.id === id ? { ...r, status } : r)));
}

export async function deleteReview(id: string): Promise<void> {
  if (isFirebaseEnabled) {
    await deleteDoc(doc(fbDb()!, COL, id));
    return;
  }
  write(read().filter((r) => r.id !== id));
}

/* ─────────── Hooks reactive ─────────── */

/** Recenziile APROBATE pentru un produs (public). Sortate: cele mai noi primele. */
export function useApprovedReviews(productSlug: string): Review[] {
  const [list, setList] = useState<Review[]>([]);
  useEffect(() => {
    if (isFirebaseEnabled) {
      // Query pe status == 'approved' (o singură egalitate → fără index compus).
      // Filtrarea pe produs se face în client.
      const q = query(collection(fbDb()!, COL), where("status", "==", "approved"));
      return onSnapshot(
        q,
        (snap) => {
          const all = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Review, "id">) }));
          setList(all.filter((r) => r.productSlug === productSlug).sort((a, b) => b.createdAt - a.createdAt));
        },
        () => setList([])
      );
    }
    const refresh = () =>
      setList(read().filter((r) => r.productSlug === productSlug && r.status === "approved").sort((a, b) => b.createdAt - a.createdAt));
    refresh();
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [productSlug]);
  return list;
}

/** Toate recenziile (admin). Sortate: cele mai noi primele. */
export function useAllReviews(): Review[] {
  const [list, setList] = useState<Review[]>([]);
  useEffect(() => {
    if (isFirebaseEnabled) {
      return onSnapshot(
        collection(fbDb()!, COL),
        (snap) => setList(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Review, "id">) })).sort((a, b) => b.createdAt - a.createdAt)),
        () => setList([])
      );
    }
    const refresh = () => setList(read().sort((a, b) => b.createdAt - a.createdAt));
    refresh();
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return list;
}
