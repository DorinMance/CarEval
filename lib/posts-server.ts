import "server-only";
import type { Post } from "./blog";
import { posts as seedPosts } from "./blog";
import { canReadFirestore, decodeFields, listCollection, type FsValue } from "./firestore-rest";

/**
 * Citirea articolelor pe SERVER, direct din Firestore prin REST
 * (mecanica de citire e în `lib/firestore-rest.ts`, comună cu produsele).
 *
 * De ce e necesar: paginile de blog sunt prerandate pe server. Fără asta, serverul
 * se uita doar în `lib/blog.ts` și returna 404 pentru orice articol scris din
 * panoul de admin, deși clientul l-ar fi găsit în Firestore.
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

/** Cât timp e considerat proaspăt un articol citit din Firestore (secunde). */
const REVALIDATE = 300;

/** Minimul fără de care pagina nu are ce randa. */
function isValidPost(o: Record<string, unknown>): boolean {
  return typeof o.slug === "string" && !!o.slug && typeof o.title === "string" && !!o.title;
}

/** Câmpurile opționale pot lipsi la un articol scris din panou. */
function toPost(o: Record<string, unknown>): Post {
  return {
    slug: o.slug as string,
    title: o.title as string,
    excerpt: (o.excerpt as string) ?? "",
    category: (o.category as string) ?? "Blog",
    date: (o.date as string) ?? "",
    readingTime: (o.readingTime as string) ?? "",
    body: Array.isArray(o.body) ? (o.body as string[]) : [],
    content: typeof o.content === "string" ? o.content : undefined,
  };
}

/**
 * Toate articolele: cele din cod + cele scrise din panou. Folosit de sitemap, ca
 * articolele noi să ajungă în Google, nu doar să fie accesibile.
 */
export async function getAllPosts(): Promise<Post[]> {
  const docs = await listCollection("posts", REVALIDATE);
  if (!docs) return seedPosts;

  const bySlug = new Map(seedPosts.map((p) => [p.slug, p]));
  for (const o of docs) {
    if (isValidPost(o)) bySlug.set(o.slug as string, toPost(o)); // panoul are ultimul cuvânt
  }
  return [...bySlug.values()];
}

/** Un singur articol după slug. `null` dacă nu există nicăieri. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const seed = seedPosts.find((p) => p.slug === slug) ?? null;

  // Firestore e sursa de adevăr — la fel ca în browser (`usePosts`). Dacă serverul
  // ar prefera codul, pagina s-ar randa cu textul vechi și apoi ar sări la cel din
  // panou. Articolele din cod rămân rezerva: prima intrare în admin le copiază
  // oricum în Firestore (`seedPostsIfEmpty`).
  if (!canReadFirestore) return seed;

  const url =
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
    `/databases/(default)/documents/posts/${encodeURIComponent(slug)}?key=${API_KEY}`;

  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE } });
    // 404 de la Firestore: articolul nu e în panou. Poate fi totuși unul din cod,
    // dacă Firestore n-a fost încă populat.
    if (!res.ok) return seed;
    const doc = (await res.json()) as { fields?: Record<string, FsValue> };
    if (!doc.fields) return seed;
    const obj = decodeFields(doc.fields);
    // Documentul e cheiat pe slug, dar nu ne bazăm pe câmpul din interior.
    obj.slug = obj.slug ?? slug;
    return isValidPost(obj) ? toPost(obj) : seed;
  } catch {
    // Firestore indisponibil: cădem pe versiunea din cod, ca site-ul să rămână viu.
    return seed;
  }
}
