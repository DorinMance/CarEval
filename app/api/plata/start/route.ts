import { NextResponse } from "next/server";
import { startCardPayment, isNetopiaEnabled } from "@/lib/netopia";
import { putPayment } from "@/lib/payment-store";

/** Suma maximă acceptată, ca plasă împotriva unui payload manipulat. */
const MAX_AMOUNT = 20000;

export async function POST(req: Request) {
  if (!isNetopiaEnabled) {
    return NextResponse.json({ ok: false, message: "Plata cu cardul nu e configurată." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Cerere invalidă." }, { status: 400 });
  }

  const { amount, description, contact, orderID: clientOrderID } = (body ?? {}) as {
    amount?: number;
    description?: string;
    orderID?: string;
    contact?: { nume?: string; email?: string; telefon?: string; localitate?: string };
  };

  // Validare: suma vine din client, deci nu are încredere oarbă.
  // LA GO-LIVE: recalculează suma pe server din coșul salvat, nu o accepta din request.
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    return NextResponse.json({ ok: false, message: "Sumă invalidă." }, { status: 400 });
  }
  if (!contact?.email || !contact?.nume || !contact?.telefon) {
    return NextResponse.json({ ok: false, message: "Date de contact incomplete." }, { status: 400 });
  }

  // Numărul vine de la client, ca să fie identic cu cel salvat pe comandă. Îl
  // acceptăm doar dacă respectă formatul; altfel generăm unul.
  const orderID =
    typeof clientOrderID === "string" && /^CE-\d{10,}-[A-Z0-9]{4,10}$/.test(clientOrderID)
      ? clientOrderID
      : `CE-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  // Adresa publică a site-ului: NETOPIA trebuie să poată ajunge la notifyUrl.
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    new URL(req.url).origin;

  const [firstName, ...rest] = contact.nume.trim().split(/\s+/);

  const result = await startCardPayment({
    orderID,
    amount,
    description: description || "Servicii de evaluare tehnică auto",
    redirectUrl: `${origin}/comanda/rezultat?orderID=${encodeURIComponent(orderID)}`,
    notifyUrl: `${origin}/api/netopia/ipn`,
    billing: {
      email: contact.email,
      phone: contact.telefon,
      firstName: firstName || contact.nume,
      lastName: rest.join(" ") || "-",
      city: contact.localitate,
    },
  });

  if (!result.ok || !result.paymentURL) {
    return NextResponse.json({ ok: false, message: result.message ?? "Plata nu a putut fi inițiată." }, { status: 502 });
  }

  putPayment({
    orderID,
    state: "in_asteptare",
    ntpID: result.ntpID,
    amount,
    currency: "RON",
    updatedAt: Date.now(),
    contact: {
      nume: contact.nume,
      email: contact.email,
      telefon: contact.telefon,
      localitate: contact.localitate,
    },
    description,
  });

  return NextResponse.json({ ok: true, orderID, paymentURL: result.paymentURL, ntpID: result.ntpID });
}
