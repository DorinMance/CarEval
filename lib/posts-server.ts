import "server-only";
import type { Post } from "./blog";
import { posts as seedPosts } from "./blog";

/**
 * Citirea articolelor pe SERVER, direct din Firestore prin REST.
 *
 * De ce REST și nu SDK-ul: articolele sunt conținut public, deci nu e nevoie de
 * Firebase Admin SDK și de un cont de serviciu — ajunge cheia publică pe care
 * site-ul o folosește oricum în browser. Fără secrete noi în Netlify.
 *
 * De ce e necesar: paginile de blog sunt prerandate pe server. Fără asta, serverul
 * se uita doar în `lib/blog.ts` și returna 404 pentru orice articol scris din
 * panoul de admin, deși clientul l-ar fi găsit în Firestore.
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

/** Cât timp e considerat proaspăt un articol citit din Firestore (secunde). */
const REVALIDATE = 300;

type FsValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: null;
  arrayValue?: { values?: FsValue[] };
  mapValue?: { fields?: Record<string, FsValue> };
};

/** Firestore REST întoarce valorile împachetate pe tip; le despachetăm. */
function decode(v: FsValue): unknown {
  if (v.stringValue !== undefined) return v.stringValue;
  if (v.booleanValue !== undefined) return v.booleanValue;
  if (v.integerValue !== undefined) return Number(v.integerValue);
  if (v.doubleValue !== undefined) return v.doubleValue;
  if (v.nullValue !== undefined) return null;
  if (v.arrayValue) return (v.arrayValue.values ?? []).map(decode);
  if (v.mapValue) return decodeFields(v.mapValue.fields ?? {});
  return undefined;
}

function decodeFields(fields: Record<string, FsValue>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) out[k] = decode(v);
  return out;
}

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
  if (!PROJECT_ID || !API_KEY) return seedPosts;

  const url =
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
    `/databases/(default)/documents/posts?pageSize=300&key=${API_KEY}`;

  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return seedPosts;
    const data = (await res.json()) as { documents?: { fields?: Record<string, FsValue> }[] };
    const bySlug = new Map(seedPosts.map((p) => [p.slug, p]));
    for (const d of data.documents ?? []) {
      if (!d.fields) continue;
      const o = decodeFields(d.fields);
      if (isValidPost(o)) bySlug.set(o.slug as string, toPost(o)); // panoul are ultimul cuvânt
    }
    return [...bySlug.values()];
  } catch {
    return seedPosts;
  }
}

/** Un singur articol după slug. `null` dacă nu există nicăieri. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const seed = seedPosts.find((p) => p.slug === slug) ?? null;

  // Firestore e sursa de adevăr — la fel ca în browser (`usePosts`). Dacă serverul
  // ar prefera codul, pagina s-ar randa cu textul vechi și apoi ar sări la cel din
  // panou. Articolele din cod rămân rezerva: prima intrare în admin le copiază
  // oricum în Firestore (`seedPostsIfEmpty`).
  if (!PROJECT_ID || !API_KEY) return seed;

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
