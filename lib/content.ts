"use client";

// Strat de conținut editabil (produse + articole blog), „Firebase-ready".
//
// DEMO: datele stau în localStorage, pornind de la datele statice ca seed inițial.
// Adminul scrie aici; paginile publice citesc de aici → modificările apar live.
// LA GO-LIVE: se rescrie doar implementarea read/write cu Firestore.

import { useEffect, useState } from "react";
import { products as seedProducts, type Product } from "./products";
import { posts as seedPosts, type Post } from "./blog";

// Bump versiunea când se schimbă seed-ul (produse/articole) → forțează reîncărcarea.
const PRODUCTS_KEY = "careval_products_v2";
const POSTS_KEY = "careval_posts_v2";
const PRODUCTS_EVENT = "careval:products-updated";
const POSTS_EVENT = "careval:posts-updated";

/* ─────────────────────────── PRODUSE ─────────────────────────── */

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

/** Creează sau actualizează un produs. Identitate după `id`. */
export function saveProduct(product: Product): void {
  const list = readProducts();
  const idx = list.findIndex((p) => p.id === product.id);
  if (idx >= 0) list[idx] = product;
  else list.push(product);
  writeProducts(list);
}

export function deleteProduct(id: number): void {
  writeProducts(readProducts().filter((p) => p.id !== id));
}

export function resetProducts(): void {
  writeProducts(seedProducts);
}

/* ─────────────────────────── ARTICOLE ─────────────────────────── */

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
  return readPosts().slice().sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostStore(slug: string): Post | undefined {
  return readPosts().find((p) => p.slug === slug);
}

/**
 * Creează sau actualizează un articol.
 * `originalSlug` permite editarea slug-ului fără a crea duplicat.
 */
export function savePost(post: Post, originalSlug?: string): void {
  const key = originalSlug ?? post.slug;
  const list = readPosts();
  const idx = list.findIndex((p) => p.slug === key);
  if (idx >= 0) list[idx] = post;
  else list.unshift(post);
  writePosts(list);
}

export function deletePost(slug: string): void {
  writePosts(readPosts().filter((p) => p.slug !== slug));
}

export function resetPosts(): void {
  writePosts(seedPosts);
}

/* ─────────────────────────── HOOKS ─────────────────────────── */

/**
 * Listă reactivă. Randează seed-ul la SSR/primul paint (fără hydration mismatch),
 * apoi se sincronizează din localStorage și la fiecare update.
 */
export function useProducts(): Product[] {
  const [list, setList] = useState<Product[]>(seedProducts);
  useEffect(() => {
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
