import { NextResponse } from "next/server";
import { startCardPayment, isNetopiaEnabled } from "@/lib/netopia";
import { putPayment } from "@/lib/payment-store";
import { products as seedProducts, PRINT_FEE } from "@/lib/products";
import { adminDb } from "@/lib/firebase-admin";
import type { Contact } from "@/lib/types";

/** Suma maximă acceptată, ca plasă împotriva unui payload manipulat. */
const MAX_AMOUNT = 20000;

/** Linie de coș trimisă de client — DOAR ce produs e, nu și prețul (îl calculăm noi). */
type ItemInput = { slug?: string; raportTiparit?: boolean };

/**
 * Prețul unui produs, stabilit pe SERVER — niciodată din suma trimisă de browser.
 *
 * Sursa de adevăr e Firestore, fiindcă acolo editează adminul prețurile și tot de
 * acolo le citește pagina de produs. Dacă cele două ar folosi surse diferite,
 * clientul ar vedea o sumă și ar plăti alta. Datele din cod rămân doar rezervă
 * (colecție goală sau Firestore indisponibil).
 */
async function priceForSlug(slug: string | undefined): Promise<number | null | undefined> {
  if (!slug) return undefined;

  const db = adminDb();
  if (db) {
    try {
      const q = await db.collection("products").where("slug", "==", slug).limit(1).get();
      if (!q.empty) {
        const p = q.docs[0].data()?.price;
        return typeof p === "number" ? p : null; // null = serviciu „la cerere"
      }
    } catch (e) {
      console.error("[plata/start] citire preț din Firestore eșuată, folosesc prețul din cod:", e);
    }
  } else {
    console.warn("[plata/start] Firebase Admin neconfigurat — prețurile vin din cod, nu din admin.");
  }

  const seed = seedProducts.find((p) => p.slug === slug);
  return seed ? seed.price : undefined;
}

/**
 * Recalculează suma pe SERVER din prețurile reale ale produselor. Nu avem
 * încredere în suma din browser — un client ar putea trimite o valoare mai mică.
 */
async function computeAmount(items: unknown): Promise<{ amount: number } | { error: string }> {
  if (!Array.isArray(items) || items.length === 0) return { error: "Coș gol." };
  let sum = 0;
  for (const raw of items as ItemInput[]) {
    const price = await priceForSlug(raw?.slug);
    if (price === undefined) return { error: "Coșul conține un serviciu necunoscut." };
    if (price == null) return { error: "Coșul conține un serviciu fără preț fix — nu se poate plăti online." };
    sum += price + (raw?.raportTiparit ? PRINT_FEE : 0);
  }
  return { amount: sum };
}

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

  const { items, amount: clientAmount, description, contact, orderID: clientOrderID } = (body ?? {}) as {
    items?: ItemInput[];
    amount?: number;
    description?: string;
    orderID?: string;
    contact?: Partial<Contact>;
  };

  // Suma se CALCULEAZĂ pe server din produse — nu se acceptă din browser.
  const calc = await computeAmount(items);
  if ("error" in calc) {
    return NextResponse.json({ ok: false, message: calc.error }, { status: 400 });
  }
  const amount = calc.amount;
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    return NextResponse.json({ ok: false, message: "Sumă invalidă." }, { status: 400 });
  }
  // Dacă suma din browser diferă de cea calculată, o semnalăm (posibilă manipulare
  // sau preț învechit în client) — dar plătim tot suma corectă, calculată de server.
  if (typeof clientAmount === "number" && Math.abs(clientAmount - amount) > 0.01) {
    console.warn(`[plata/start] sumă client ${clientAmount} ≠ server ${amount} (orderID ${clientOrderID ?? "-"})`);
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
    // Toate datele necesare facturii se rețin acum, ca IPN-ul să le poată trimite
    // la SmartBill (adresă, județ, date firmă pentru factura pe CIF).
    contact: contact as Contact,
    description,
  });

  // `ntpID` se scrie PERMANENT pe comandă, nu doar în memoria (efemeră) a funcției.
  // Fără el nu putem întreba NETOPIA care e starea plății, iar dacă notificarea IPN
  // se pierde comanda rămâne „în așteptare" deși banii au fost încasați — exact ce
  // s-a întâmplat la prima plată reală. Suma inițiată se salvează tot aici, ca să
  // avem cu ce compara confirmarea.
  try {
    const db = adminDb();
    if (db && result.ntpID) {
      await db.collection("leads").doc(orderID).set(
        { plataNtpID: result.ntpID, plataSumaInitiata: amount },
        { merge: true }
      );
    }
  } catch (e) {
    console.error("[plata/start] nu am putut salva ntpID pe comandă:", e);
  }

  return NextResponse.json({ ok: true, orderID, paymentURL: result.paymentURL, ntpID: result.ntpID });
}
