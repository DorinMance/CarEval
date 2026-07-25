import "server-only";
import { initializeApp, getApps, getApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Firebase Admin SDK — folosit DOAR pe server (rute API), ca IPN-ul NETOPIA să
 * scrie starea plății direct pe comanda din Firestore. Astfel „Plătit / Plată
 * eșuată" e permanent, nu ține de memoria (efemeră) a funcției serverless.
 *
 * Cheia vine din env `FIREBASE_SERVICE_ACCOUNT` (JSON-ul de service account,
 * generat din Firebase → Setări proiect → Conturi de serviciu → Generează cheie).
 * Se acceptă și varianta codificată base64 (mai comodă în Netlify). NU se comite
 * niciodată în cod — se pune în Netlify → Environment variables.
 *
 * Dacă env-ul lipsește, funcțiile întorc `null` și apelantul degradează elegant
 * (nu crapă) — utile în dezvoltare fără cheie.
 */

function parseServiceAccount(): Record<string, string> | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;
  try {
    const text = raw.trim().startsWith("{")
      ? raw
      : Buffer.from(raw, "base64").toString("utf8");
    const json = JSON.parse(text) as Record<string, string>;
    // Netlify scapă adesea newline-urile din cheia privată — le refacem.
    if (json.private_key) json.private_key = json.private_key.replace(/\\n/g, "\n");
    return json;
  } catch {
    console.error("[firebase-admin] FIREBASE_SERVICE_ACCOUNT invalid (nu e JSON valid).");
    return null;
  }
}

let cachedApp: App | null = null;

function adminApp(): App | null {
  if (cachedApp) return cachedApp;
  if (getApps().length) {
    cachedApp = getApp();
    return cachedApp;
  }
  const sa = parseServiceAccount();
  if (!sa) return null;
  cachedApp = initializeApp({
    credential: cert({
      projectId: sa.project_id,
      clientEmail: sa.client_email,
      privateKey: sa.private_key,
    }),
  });
  return cachedApp;
}

/** Firestore prin Admin SDK. `null` dacă nu e configurată cheia de service account. */
export function adminDb(): Firestore | null {
  const app = adminApp();
  return app ? getFirestore(app) : null;
}
