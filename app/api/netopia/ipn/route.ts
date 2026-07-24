import { NextResponse } from "next/server";
import { isPaidStatus, type NetopiaNotification } from "@/lib/netopia";
import { updatePayment, getPayment } from "@/lib/payment-store";
import { issueInvoice } from "@/lib/smartbill";

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

  // Factura se emite doar la încasare confirmată și doar dacă e pornit
  // întrerupătorul. Nu blocăm răspunsul către NETOPIA dacă facturarea pică.
  if (paid) {
    try {
      const current = rec ?? getPayment(orderID);
      await issueInvoice({
        orderID,
        amount: current?.amount ?? body.payment?.amount ?? 0,
        description: current?.description ?? "Servicii de evaluare tehnică auto",
        contact: current?.contact,
      });
    } catch (e) {
      console.error("[SMARTBILL] emitere eșuată:", e);
    }
  }

  // NETOPIA așteaptă 200 cu errorCode 0; altfel reia notificarea.
  return NextResponse.json({ errorCode: 0 });
}
