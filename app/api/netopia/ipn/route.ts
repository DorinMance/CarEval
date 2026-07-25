import { NextResponse } from "next/server";
import { isPaidStatus, type NetopiaNotification } from "@/lib/netopia";
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
  let body: NetopiaNotification;
  try {
    body = (await req.json()) as NetopiaNotification;
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
