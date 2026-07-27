import { NextResponse } from "next/server";
import {
  isPaidStatus, verifyIpn, isIpnVerificationConfigured, isNetopiaSandbox,
  type NetopiaNotification,
} from "@/lib/netopia";
import { updatePayment, getPayment } from "@/lib/payment-store";
import { adminDb } from "@/lib/firebase-admin";

/**
 * Confirmarea plății, trimisă de NETOPIA server-la-server pe `notifyUrl`.
 *
 * Aceasta e SINGURA sursă de adevăr pentru „s-a încasat”: endpointul de status
 * (`/operation/status`) e marcat în specificație drept indisponibil încă, iar
 * revenirea browserului nu garantează nimic (utilizatorul poate închide fereastra).
 *
 * NETOPIA nu poate apela `localhost`, deci în dezvoltare se simulează cu
 * `scripts/simulate-ipn.mjs`.
 */
export async function POST(req: Request) {
  // Corpul se citește BRUT: hash-ul din semnătură se calculează pe octeții
  // exacți, iar un JSON.parse/stringify intermediar l-ar schimba.
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return NextResponse.json({ errorCode: 1, message: "payload ilizibil" }, { status: 400 });
  }

  // ── Autenticitatea notificării ──
  // Fără ea, oricine poate trimite un POST cu „status: 3" și marca o comandă
  // drept plătită. În producție respingem ferm; în sandbox, dacă certificatul nu
  // e configurat, lăsăm să treacă (scripts/simulate-ipn.mjs nu poate semna).
  if (isIpnVerificationConfigured) {
    const token = req.headers.get("verification-token");
    const v = verifyIpn(token, raw);
    if (!v.ok) {
      // Detalii pentru diagnostic rapid: dacă NETOPIA trimite alt format decât
      // cel documentat, aici se vede imediat de ce a picat. Nu logăm semnătura.
      let detalii = "";
      try {
        const [h, p] = (token ?? "").split(".");
        const alg = JSON.parse(Buffer.from(h, "base64url").toString("utf8"))?.alg;
        const iss = JSON.parse(Buffer.from(p, "base64url").toString("utf8"))?.iss;
        detalii = ` (alg=${alg}, iss=${iss})`;
      } catch { /* token indescifrabil — motivul e deja în v.reason */ }
      console.warn(`[NETOPIA IPN] notificare RESPINSĂ: ${v.reason}${detalii}`);
      // Răspuns non-200 → NETOPIA reia notificarea mai târziu. Dacă se dovedește
      // o nepotrivire de format, o reparăm și reluarea trece de la sine.
      return NextResponse.json({ errorCode: 1, message: "semnătură invalidă" }, { status: 400 });
    }
  } else if (!isNetopiaSandbox) {
    console.error("[NETOPIA IPN] RESPINS: NETOPIA_PUBLIC_KEY lipsește în producție.");
    return NextResponse.json({ errorCode: 1, message: "verificare neconfigurată" }, { status: 500 });
  } else {
    console.warn("[NETOPIA IPN] sandbox fără certificat — notificare acceptată NEVERIFICATĂ.");
  }

  let body: NetopiaNotification;
  try {
    body = JSON.parse(raw) as NetopiaNotification;
  } catch {
    return NextResponse.json({ errorCode: 1, message: "payload invalid" }, { status: 400 });
  }

  const orderID = body.order?.orderID;
  const status = Number(body.payment?.status ?? 0);
  const ntpID = body.payment?.ntpID;

  if (!orderID) {
    return NextResponse.json({ errorCode: 1, message: "orderID lipsă" }, { status: 400 });
  }

  const paid = isPaidStatus(status);
  const inainte = getPayment(orderID);
  const sumaNotificata = body.payment?.amount;

  // Nu suprascriem orbește suma inițiată. O diferență între cât am cerut și cât
  // raportează NETOPIA e fie o eroare, fie o încercare de manipulare — în ambele
  // cazuri trebuie văzută, nu îngropată.
  const sumaDiferita =
    inainte?.amount != null && sumaNotificata != null && Math.abs(inainte.amount - sumaNotificata) > 0.01;
  if (sumaDiferita) {
    console.warn(
      `[NETOPIA IPN] ATENȚIE sumă diferită la ${orderID}: inițiat ${inainte?.amount}, notificat ${sumaNotificata}`
    );
  }

  const rec = updatePayment(orderID, {
    state: paid ? "platit" : "esuat",
    ntpID,
    netopiaStatus: status,
    // Păstrăm suma inițiată ca referință; o luăm pe cea notificată doar dacă nu aveam una.
    amount: inainte?.amount ?? sumaNotificata,
    currency: body.payment?.currency ?? inainte?.currency,
  });

  console.log(`[NETOPIA IPN] ${orderID} status=${status} → ${paid ? "PLĂTIT" : "eșuat"} (ntpID ${ntpID})`);
  void rec;

  // Scriem starea plății PERMANENT pe comanda din Firestore, ca badge-ul
  // „Plătit / Plată eșuată" din admin să nu depindă de memoria (efemeră) a
  // funcției serverless. Documentul comenzii e cheiat pe orderID. Dacă Admin SDK
  // nu e configurat (fără cheie de service account), degradăm la registrul din
  // memorie — nu blocăm răspunsul către NETOPIA.
  try {
    const db = adminDb();
    if (db) {
      await db.collection("leads").doc(orderID).set(
        {
          plataStare: paid ? "platit" : "esuat",
          plataNtpID: ntpID ?? null,
          plataData: Date.now(),
        },
        { merge: true }
      );
    }
  } catch (e) {
    console.error("[NETOPIA IPN] nu am putut scrie starea plății în Firestore:", e);
  }

  // Factura NU se emite automat aici. Am ales cu clientul facturare manuală:
  // proprietarul apasă „Facturează" în admin (vezi app/api/factura), verifică
  // factura în SmartBill și o trimite el.

  // NETOPIA așteaptă 200 cu errorCode 0; altfel reia notificarea.
  return NextResponse.json({ errorCode: 0 });
}
