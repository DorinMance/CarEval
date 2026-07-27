import "server-only";
import { products as seedProducts, defaultProductSteps, type Product } from "./products";
import { findFreshByField, listCollection } from "./firestore-rest";

/**
 * Citirea produselor pe SERVER.
 *
 * De ce e necesar: pagina `/produs/[slug]` se randează pe server. Fără asta,
 * serverul se uita doar în `lib/products.ts` și returna 404 pentru orice produs
 * adăugat din panoul de admin — deși în lista de produse apărea, iar clientul
 * l-ar fi găsit în Firestore. Practic, produsele noi erau imposibil de comandat.
 *
 * Firestore e sursa de adevăr (la fel ca în browser, `useProducts`, și ca la
 * calculul sumei de plată). Datele din cod rămân rezerva: completează câmpurile
 * lipsă și țin site-ul viu dacă Firestore e indisponibil.
 */

/** Cât timp e considerat proaspăt un produs citit din Firestore (secunde). */
const REVALIDATE = 300;

/** Minimul fără de care pagina nu are ce randa. */
function isValidProduct(o: Record<string, unknown>): boolean {
  return typeof o.slug === "string" && !!o.slug && typeof o.name === "string" && !!o.name;
}

/** Un produs din panou poate avea câmpuri lipsă; le completăm cu ce e rezonabil. */
function toProduct(o: Record<string, unknown>): Product {
  const seed = seedProducts.find((p) => p.slug === o.slug);
  const arr = (v: unknown, fallback: string[]) =>
    Array.isArray(v) && v.length ? (v as string[]) : fallback;

  return {
    ...(seed ?? {}),
    id: typeof o.id === "number" ? o.id : (seed?.id ?? 0),
    slug: o.slug as string,
    code: (o.code as string) ?? seed?.code ?? "",
    name: o.name as string,
    tagline: (o.tagline as string) ?? seed?.tagline ?? "",
    // `price` poate fi legitim `null` („la cerere"), deci nu folosim `??` pe el
    // ca pe celelalte: verificăm explicit tipul.
    price: typeof o.price === "number" ? o.price : o.price === null ? null : (seed?.price ?? null),
    priceNote: (o.priceNote as string) ?? seed?.priceNote,
    delivery: (o.delivery as string) ?? seed?.delivery ?? "24–48h",
    image: (o.image as string) ?? seed?.image ?? "/images/evaluare-autovehicul-440687.png",
    category: (o.category as Product["category"]) ?? seed?.category ?? "Evaluare",
    shortDescription: (o.shortDescription as string) ?? seed?.shortDescription ?? "",
    description: arr(o.description, seed?.description ?? []),
    benefits: arr(o.benefits, seed?.benefits ?? []),
    // Fără pași, formularul de comandă ar fi gol — de aceea cădem pe cei impliciți.
    steps: Array.isArray(o.steps) && o.steps.length
      ? (o.steps as Product["steps"])
      : (seed?.steps ?? defaultProductSteps()),
  } as Product;
}

/** Toate produsele: cele din cod + cele adăugate din panou (panoul are prioritate). */
export async function getAllProducts(): Promise<Product[]> {
  const docs = await listCollection("products", REVALIDATE);
  if (!docs) return seedProducts;

  const bySlug = new Map(seedProducts.map((p) => [p.slug, p]));
  for (const o of docs) {
    if (isValidProduct(o)) bySlug.set(o.slug as string, toProduct(o));
  }
  return [...bySlug.values()].sort((a, b) => a.id - b.id);
}

/** Un singur produs după slug. `null` dacă nu există nici în panou, nici în cod. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getAllProducts();
  const gasit = all.find((p) => p.slug === slug);
  if (gasit) return gasit;

  // A doua șansă, FĂRĂ cache: lista de mai sus stă în cache-ul de date Next
  // (revalidate) — care se persistă și pe disc — deci un produs abia adăugat din
  // panou ar da 404 până la 5 minute. Înainte să declarăm 404, întrebăm Firestore
  // direct. Costul apare doar pe slug-uri necunoscute (rar), nu pe traficul normal.
  const o = await findFreshByField("products", "slug", slug);
  return o && isValidProduct(o) ? toProduct(o) : null;
}
