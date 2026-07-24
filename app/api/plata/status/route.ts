import { NextResponse } from "next/server";
import { getPayment } from "@/lib/payment-store";

/** Starea unei comenzi, interogată de pagina de rezultat cât timp NETOPIA încă nu a confirmat. */
export async function GET(req: Request) {
  const orderID = new URL(req.url).searchParams.get("orderID");
  if (!orderID) return NextResponse.json({ ok: false, message: "orderID lipsă" }, { status: 400 });

  const rec = getPayment(orderID);
  if (!rec) return NextResponse.json({ ok: true, state: "necunoscut" });

  return NextResponse.json({
    ok: true,
    state: rec.state,
    amount: rec.amount,
    currency: rec.currency,
    ntpID: rec.ntpID,
  });
}
