import "server-only";

/**
 * Registru de plăți — DOAR PENTRU FAZA DE TEST.
 *
 * De ce nu Firestore: regulile permit scrierea în `leads` doar unui admin
 * autentificat, iar IPN-ul vine de la serverele NETOPIA, fără sesiune. Scrierea
 * corectă din server cere Firebase Admin SDK cu cont de serviciu — o lucrare de
 * go-live, nu de sandbox.
 *
 * Limitare acceptată conștient: memoria se pierde la repornirea serverului și nu
 * e partajată între instanțe. Suficient ca să vedem fluxul complet funcționând
 * local; NU suficient pentru producție.
 *
 * LA GO-LIVE: înlocuiește implementarea cu scriere în Firestore prin Admin SDK.
 */

export type PaymentState = "in_asteptare" | "platit" | "esuat";

export interface PaymentRecord {
  orderID: string;
  state: PaymentState;
  ntpID?: string;
  amount?: number;
  currency?: string;
  netopiaStatus?: number;
  updatedAt: number;
  /** Datele necesare facturii, reținute de la inițierea plății. */
  contact?: { nume: string; email: string; telefon: string; localitate?: string };
  description?: string;
}

// `globalThis` ca să supraviețuiască hot-reload-ului din dev.
const store: Map<string, PaymentRecord> =
  (globalThis as unknown as { __carevalPayments?: Map<string, PaymentRecord> }).__carevalPayments ??
  ((globalThis as unknown as { __carevalPayments?: Map<string, PaymentRecord> }).__carevalPayments = new Map());

export function putPayment(rec: PaymentRecord): void {
  store.set(rec.orderID, rec);
}

export function updatePayment(orderID: string, patch: Partial<PaymentRecord>): PaymentRecord | null {
  const cur = store.get(orderID);
  const next: PaymentRecord = { ...(cur ?? { orderID, state: "in_asteptare", updatedAt: 0 }), ...patch, orderID, updatedAt: Date.now() };
  store.set(orderID, next);
  return next;
}

export function getPayment(orderID: string): PaymentRecord | null {
  return store.get(orderID) ?? null;
}
