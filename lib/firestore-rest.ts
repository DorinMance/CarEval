import "server-only";

/**
 * Citire din Firestore pe SERVER, prin REST.
 *
 * De ce REST și nu Admin SDK: conținutul public (articole, produse) nu are nevoie
 * de cont de serviciu — ajunge cheia publică pe care site-ul o folosește oricum în
 * browser. Fără secrete în plus, și merge și dacă Admin SDK nu e configurat.
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

/** True dacă se poate citi din Firestore pe server. */
export const canReadFirestore = Boolean(PROJECT_ID && API_KEY);

export type FsValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: null;
  arrayValue?: { values?: FsValue[] };
  mapValue?: { fields?: Record<string, FsValue> };
};

/** Firestore REST întoarce valorile împachetate pe tip; le despachetăm. */
export function decode(v: FsValue): unknown {
  if (v.stringValue !== undefined) return v.stringValue;
  if (v.booleanValue !== undefined) return v.booleanValue;
  if (v.integerValue !== undefined) return Number(v.integerValue);
  if (v.doubleValue !== undefined) return v.doubleValue;
  if (v.nullValue !== undefined) return null;
  if (v.arrayValue) return (v.arrayValue.values ?? []).map(decode);
  if (v.mapValue) return decodeFields(v.mapValue.fields ?? {});
  return undefined;
}

export function decodeFields(fields: Record<string, FsValue>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) out[k] = decode(v);
  return out;
}

/**
 * Un singur document, căutat PROASPĂT (fără cache) după un câmp egal cu o valoare.
 * Folosit ca a doua șansă când lista din cache (revalidate) nu conține documentul:
 * un produs abia adăugat din panou ar da altfel 404 până la expirarea cache-ului.
 * `null` = nu există sau citirea nu e posibilă.
 */
export async function findFreshByField(
  collection: string,
  field: string,
  value: string
): Promise<Record<string, unknown> | null> {
  if (!canReadFirestore) return null;
  const url =
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
    `/databases/(default)/documents:runQuery?key=${API_KEY}`;
  try {
    const res = await fetch(url, {
      method: "POST", // POST nu se cache-uiește de Next — mereu proaspăt
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: collection }],
          where: {
            fieldFilter: { field: { fieldPath: field }, op: "EQUAL", value: { stringValue: value } },
          },
          limit: 1,
        },
      }),
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as { document?: { fields?: Record<string, FsValue> } }[];
    const fields = rows.find((r) => r.document?.fields)?.document?.fields;
    return fields ? decodeFields(fields) : null;
  } catch {
    return null;
  }
}

/**
 * Toate documentele unei colecții, decodate. `null` dacă citirea nu e posibilă —
 * apelantul decide ce face (de regulă: cade pe datele din cod).
 */
export async function listCollection(
  collection: string,
  revalidateSeconds: number,
  pageSize = 300
): Promise<Record<string, unknown>[] | null> {
  if (!canReadFirestore) return null;
  const url =
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
    `/databases/(default)/documents/${collection}?pageSize=${pageSize}&key=${API_KEY}`;
  try {
    const res = await fetch(url, { next: { revalidate: revalidateSeconds } });
    if (!res.ok) return null;
    const data = (await res.json()) as { documents?: { fields?: Record<string, FsValue> }[] };
    return (data.documents ?? []).filter((d) => d.fields).map((d) => decodeFields(d.fields!));
  } catch {
    return null;
  }
}
