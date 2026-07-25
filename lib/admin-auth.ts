import "server-only";

/**
 * Verifică server-side că o cerere vine de la contul de admin.
 *
 * Clientul trimite ID-token-ul Firebase al utilizatorului logat (Authorization:
 * Bearer <idToken>). Îl validăm la Google (identitytoolkit) și cerem ca UID-ul
 * să fie exact cel din `ADMIN_UID`. Fără asta, oricine ar putea apela ruta de
 * facturare și genera facturi reale (care pleacă la ANAF prin e-Factura).
 *
 * Nu depindem de firebase-admin: folosim endpointul public `accounts:lookup` cu
 * cheia web (aceeași NEXT_PUBLIC_FIREBASE_API_KEY). Cheia web nu e secretă;
 * autorizarea reală o dă potrivirea UID-ului.
 */

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "";
const ADMIN_UID = process.env.ADMIN_UID ?? "";

export async function isAdminRequest(req: Request): Promise<boolean> {
  if (!API_KEY || !ADMIN_UID) return false;

  const header = req.headers.get("authorization") ?? "";
  const idToken = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!idToken) return false;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!res.ok) return false;
    const data = (await res.json()) as { users?: { localId?: string }[] };
    const uid = data.users?.[0]?.localId;
    return !!uid && uid === ADMIN_UID;
  } catch {
    return false;
  }
}
