import { NextResponse } from "next/server";
import { getPayment } from "@/lib/payment-store";
import { adminDb } from "@/lib/firebase-admin";
import { getPaymentStatus, isPaidStatus } from "@/lib/netopia";

/** Starea unei comenzi, interogată de pagina de rezultat cât timp NETOPIA încă nu a confirmat. */
export async function GET(req: Request) {
  const orderID = new URL(req.url).searchParams.get("orderID");
  if (!orderID) return NextResponse.json({ ok: false, message: "orderID lipsă" }, { status: 400 });

  // Sursa rapidă: registrul din memorie (dacă IPN-ul a nimerit aceeași instanță).
  const rec = getPayment(orderID);
  if (rec && rec.state !== "in_asteptare") {
    return NextResponse.json({
      ok: true,
      state: rec.state,
      amount: rec.amount,
      currency: rec.currency,
      ntpID: rec.ntpID,
    });
  }

  // Sursa PERMANENTĂ: comanda din Firestore, unde IPN-ul scrie starea (prin Admin
  // SDK). Pe serverless, GET-ul de status și IPN-ul pot nimeri instanțe diferite.
  type LeadPlata = { plataStare?: string; plataNtpID?: string; total?: number; plataSumaInitiata?: number };
  const db = adminDb();
  let doc: LeadPlata | null = null;
  try {
    if (db) {
      const snap = await db.collection("leads").doc(orderID).get();
      doc = snap.exists ? ((snap.data() ?? null) as LeadPlata | null) : null;
      if (doc?.plataStare) {
        return NextResponse.json({
          ok: true,
          state: doc.plataStare,
          amount: doc.plataSumaInitiata ?? doc.total,
          currency: "RON",
          ntpID: doc.plataNtpID,
        });
      }
    }
  } catch (e) {
    console.error("[plata/status] citire Firestore eșuată:", e);
  }

  // Ultima plasă: întrebăm NETOPIA direct. Dacă notificarea IPN întârzie, se pierde
  // sau e respinsă, comanda ar rămâne altfel „în așteptare" deși banii au fost
  // încasați. Aici sursa e autoritară, deci confirmarea nu depinde de un singur canal.
  const ntpID = doc?.plataNtpID ?? rec?.ntpID;
  if (ntpID) {
    const st = await getPaymentStatus(ntpID, orderID);
    if (st.ok && st.status != null) {
      const platit = isPaidStatus(st.status);
      // Persistăm rezultatul, ca panoul de admin să-l vadă și el, nu doar clientul.
      // Suma rămâne cea inițiată de noi — nu o luăm de la NETOPIA fără verificare.
      try {
        if (db && platit) {
          await db.collection("leads").doc(orderID).set(
            { plataStare: "platit", plataNtpID: ntpID, plataData: Date.now(), plataConfirmatPrin: "status" },
            { merge: true }
          );
          console.warn(`[plata/status] ${orderID} confirmat prin interogare directă (IPN-ul nu a ajuns).`);
        }
      } catch (e) {
        console.error("[plata/status] nu am putut salva starea:", e);
      }
      if (platit) {
        return NextResponse.json({
          ok: true,
          state: "platit",
          amount: doc?.plataSumaInitiata ?? doc?.total,
          currency: "RON",
          ntpID,
        });
      }
    }
  }

  return NextResponse.json({ ok: true, state: rec?.state ?? "necunoscut", ntpID });
}
