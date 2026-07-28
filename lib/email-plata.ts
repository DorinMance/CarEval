import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";
import { sendMail, isMailEnabled } from "./mailer";
import { htmlPlata, textPlata, subiectPlata, type ContinutEmail } from "./email-plata-template";
import type { Contact, LeadItem } from "./types";

/**
 * Trimite confirmarea de plată către client, O SINGURĂ DATĂ per comandă.
 *
 * Idempotența nu e opțională: NETOPIA reia notificarea dacă nu primește 200, iar
 * plata mai poate fi confirmată și din `/api/plata/status` (canalul de rezervă).
 * Fără protecție, clientul ar primi același email de mai multe ori.
 *
 * Mecanism: „rezervăm” dreptul de a trimite printr-o tranzacție Firestore —
 * primul apel care ajunge acolo pune marcajul, restul se opresc. Dacă trimiterea
 * eșuează după rezervare, marcajul se șterge, ca o încercare ulterioară să poată
 * relua.
 *
 * Nu aruncă niciodată: o plată încasată rămâne confirmată chiar dacă serverul de
 * mail e picat. Textul mesajului stă în `email-plata-template.ts`.
 */
export async function trimiteEmailPlataConfirmata(orderID: string): Promise<void> {
  if (!isMailEnabled) {
    console.warn(`[mail] ${orderID}: SMTP neconfigurat — nu trimit confirmarea.`);
    return;
  }
  const db = adminDb();
  if (!db) {
    console.warn(`[mail] ${orderID}: Firestore Admin indisponibil — nu pot verifica dacă am trimis deja.`);
    return;
  }

  const ref = db.collection("leads").doc(orderID);
  let continut: ContinutEmail | null = null;

  try {
    continut = await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) return null;
      const d = snap.data() ?? {};
      if (d.emailPlataTrimis) return null; // deja trimis — ieșim tăcut
      const contact = d.contact as Contact | undefined;
      if (!contact?.email) return null;

      tx.update(ref, { emailPlataTrimis: Date.now() });
      return {
        orderID,
        contact,
        items: (d.items ?? []) as LeadItem[],
        // Suma inițiată de noi, nu cea raportată de altcineva (vezi ruta IPN).
        total: (d.plataSumaInitiata ?? d.total ?? null) as number | null,
      };
    });
  } catch (e) {
    console.error(`[mail] ${orderID}: nu am putut rezerva trimiterea:`, e);
    return;
  }

  if (!continut) return;

  const r = await sendMail({
    to: continut.contact.email,
    subject: subiectPlata(orderID),
    text: textPlata(continut),
    html: htmlPlata(continut),
  });

  if (!r.ok) {
    // Eliberăm rezervarea, ca o confirmare ulterioară (retry NETOPIA sau
    // interogarea de status) să mai poată încerca o dată.
    try {
      await ref.update({ emailPlataTrimis: FieldValue.delete() });
    } catch {
      /* dacă nici asta nu merge, emailul se pierde — dar plata rămâne confirmată */
    }
  }
}
