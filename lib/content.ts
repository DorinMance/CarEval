"use client";

// Strat de conținut editabil (produse + articole blog).
//
// - Cu Firebase: produsele stau în colecția Firestore `products`, articolele în `posts`.
//   Adminul (logat) scrie; paginile publice citesc live (onSnapshot). Dacă o colecție e goală,
//   se afișează datele-seed (site-ul merge mereu). Adminul „însămânțează" colecția la prima vizită.
// - Fără Firebase (demo): totul în localStorage, cu datele statice ca seed.

import { useEffect, useState } from "react";
import { products as seedProducts, type Product } from "./products";
import { posts as seedPosts, type Post } from "./blog";
import { isFirebaseEnabled, fbDb } from "./firebase";
import { collection, doc, setDoc, deleteDoc, getDocs, onSnapshot, writeBatch } from "firebase/firestore";

const PRODUCTS_COL = "products";
const POSTS_COL = "posts";

// Fallback demo (localStorage)
const PRODUCTS_KEY = "careval_products_v2";
const POSTS_KEY = "careval_posts_v2";
const PRODUCTS_EVENT = "careval:products-updated";
const POSTS_EVENT = "careval:posts-updated";

const sortProducts = (a: Product[]) => a.slice().sort((x, y) => x.id - y.id);
const sortPosts = (a: Post[]) => a.slice().sort((x, y) => (x.date < y.date ? 1 : -1));

/* ═══════════════════════ PRODUSE ═══════════════════════ */

function readProducts(): Product[] {
  if (typeof window === "undefined") return seedProducts;
  try {
    const raw = window.localStorage.getItem(PRODUCTS_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : seedProducts;
  } catch {
    return seedProducts;
  }
}
function writeProducts(list: Product[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(PRODUCTS_EVENT));
}

export function listProducts(): Product[] {
  return readProducts();
}
export function getProductStore(slug: string): Product | undefined {
  return readProducts().find((p) => p.slug === slug);
}

export async function saveProduct(product: Product): Promise<void> {
  if (isFirebaseEnabled) {
    await setDoc(doc(fbDb()!, PRODUCTS_COL, String(product.id)), product);
    return;
  }
  const list = readProducts();
  const idx = list.findIndex((p) => p.id === product.id);
  if (idx >= 0) list[idx] = product;
  else list.push(product);
  writeProducts(list);
}

export async function deleteProduct(id: number): Promise<void> {
  if (isFirebaseEnabled) {
    await deleteDoc(doc(fbDb()!, PRODUCTS_COL, String(id)));
    return;
  }
  writeProducts(readProducts().filter((p) => p.id !== id));
}

export async function resetProducts(): Promise<void> {
  if (isFirebaseEnabled) {
    const db = fbDb()!;
    const snap = await getDocs(collection(db, PRODUCTS_COL));
    const batch = writeBatch(db);
    snap.forEach((d) => batch.delete(d.ref));
    seedProducts.forEach((p) => batch.set(doc(db, PRODUCTS_COL, String(p.id)), p));
    await batch.commit();
    return;
  }
  writeProducts(seedProducts);
}

/** Populează Firestore cu produsele-seed dacă colecția e goală (rulează din admin, logat). */
export async function seedProductsIfEmpty(): Promise<void> {
  if (!isFirebaseEnabled) return;
  const db = fbDb()!;
  const snap = await getDocs(collection(db, PRODUCTS_COL));
  if (!snap.empty) return;
  const batch = writeBatch(db);
  seedProducts.forEach((p) => batch.set(doc(db, PRODUCTS_COL, String(p.id)), p));
  await batch.commit();
}

/* ═══════════════════════ ARTICOLE ═══════════════════════ */

function readPosts(): Post[] {
  if (typeof window === "undefined") return seedPosts;
  try {
    const raw = window.localStorage.getItem(POSTS_KEY);
    return raw ? (JSON.parse(raw) as Post[]) : seedPosts;
  } catch {
    return seedPosts;
  }
}
function writePosts(list: Post[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(POSTS_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(POSTS_EVENT));
}

export function listPosts(): Post[] {
  return sortPosts(readPosts());
}
export function getPostStore(slug: string): Post | undefined {
  return readPosts().find((p) => p.slug === slug);
}

export async function savePost(post: Post, originalSlug?: string): Promise<void> {
  if (isFirebaseEnabled) {
    const db = fbDb()!;
    if (originalSlug && originalSlug !== post.slug) {
      await deleteDoc(doc(db, POSTS_COL, originalSlug)); // slug schimbat → mută documentul
    }
    await setDoc(doc(db, POSTS_COL, post.slug), post);
    return;
  }
  const key = originalSlug ?? post.slug;
  const list = readPosts();
  const idx = list.findIndex((p) => p.slug === key);
  if (idx >= 0) list[idx] = post;
  else list.unshift(post);
  writePosts(list);
}

export async function deletePost(slug: string): Promise<void> {
  if (isFirebaseEnabled) {
    await deleteDoc(doc(fbDb()!, POSTS_COL, slug));
    return;
  }
  writePosts(readPosts().filter((p) => p.slug !== slug));
}

export async function resetPosts(): Promise<void> {
  if (isFirebaseEnabled) {
    const db = fbDb()!;
    const snap = await getDocs(collection(db, POSTS_COL));
    const batch = writeBatch(db);
    snap.forEach((d) => batch.delete(d.ref));
    seedPosts.forEach((p) => batch.set(doc(db, POSTS_COL, p.slug), p));
    await batch.commit();
    return;
  }
  writePosts(seedPosts);
}

export async function seedPostsIfEmpty(): Promise<void> {
  if (!isFirebaseEnabled) return;
  const db = fbDb()!;
  const snap = await getDocs(collection(db, POSTS_COL));
  if (!snap.empty) return;
  const batch = writeBatch(db);
  seedPosts.forEach((p) => batch.set(doc(db, POSTS_COL, p.slug), p));
  await batch.commit();
}

/* ═══════════════════════ HOOKS reactive ═══════════════════════ */

export function useProducts(): Product[] {
  const [list, setList] = useState<Product[]>(seedProducts);
  useEffect(() => {
    if (isFirebaseEnabled) {
      return onSnapshot(
        collection(fbDb()!, PRODUCTS_COL),
        (snap) => {
          if (snap.empty) setList(seedProducts); // fallback până când adminul însămânțează
          else setList(sortProducts(snap.docs.map((d) => d.data() as Product)));
        },
        () => setList(seedProducts)
      );
    }
    const refresh = () => setList(readProducts());
    refresh();
    window.addEventListener(PRODUCTS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(PRODUCTS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return list;
}

export function usePosts(): Post[] {
  const [list, setList] = useState<Post[]>(seedPosts);
  useEffect(() => {
    if (isFirebaseEnabled) {
      return onSnapshot(
        collection(fbDb()!, POSTS_COL),
        (snap) => {
          if (snap.empty) setList(sortPosts(seedPosts));
          else setList(sortPosts(snap.docs.map((d) => d.data() as Post)));
        },
        () => setList(sortPosts(seedPosts))
      );
    }
    const refresh = () => setList(listPosts());
    refresh();
    window.addEventListener(POSTS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(POSTS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return list;
}
