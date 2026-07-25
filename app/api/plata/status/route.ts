import { NextResponse } from "next/server";
import { getPayment } from "@/lib/payment-store";
import { adminDb } from "@/lib/firebase-admin";

/** Starea unei comenzi, interogată de pagina de rezultat cât timp NETOPIA încă nu a confirmat. */
export async function GET(req: Request) {
  const orderID = new URL(req.url).searchParams.get("orderID");
  if (!orderID) return NextResponse.json({ ok: false, message: "orderID lipsă" }, { status: 400 });

  // Sursa rapidă: registrul din memorie (dacă IPN-ul a nimerit aceeași instanță).
  const rec = getPayment(orderID);
  if (rec) {
    return NextResponse.json({
      ok: true,
      state: rec.state,
      amount: rec.amount,
      currency: rec.currency,
      ntpID: rec.ntpID,
    });
  }

  // Fallback PERMANENT: pe serverless (Netlify) GET-ul de status și IPN-ul pot
  // nimeri instanțe diferite, iar memoria e goală. IPN-ul scrie însă starea pe
  // comanda din Firestore (prin Admin SDK), deci o citim de acolo — altfel o plată
  // reușită ar rămâne „neconfirmată", iar coșul nu s-ar goli niciodată.
  try {
    const db = adminDb();
    if (db) {
      const snap = await db.collection("leads").doc(orderID).get();
      const data = snap.exists ? (snap.data() as { plataStare?: string; plataNtpID?: string; total?: number }) : null;
      if (data?.plataStare) {
        return NextResponse.json({
          ok: true,
          state: data.plataStare,
          amount: data.total,
          currency: "RON",
          ntpID: data.plataNtpID,
        });
      }
    }
  } catch (e) {
    console.error("[plata/status] citire Firestore eșuată:", e);
  }

  return NextResponse.json({ ok: true, state: "necunoscut" });
}
