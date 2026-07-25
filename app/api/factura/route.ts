import { NextResponse } from "next/server";
import { issueInvoice, type InvoiceItem } from "@/lib/smartbill";
import { isAdminRequest } from "@/lib/admin-auth";
import type { Contact } from "@/lib/types";

/**
 * Emiterea manuală a facturii dintr-un buton din admin.
 *
 * Acces: doar contul de admin (ID-token Firebase verificat în isAdminRequest).
 * Efect: creează factura în SmartBill (serie configurată) și întoarce numărul.
 * NU trimite factura pe mail — proprietarul o verifică și o trimite el.
 */
export async function POST(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, message: "neautorizat" }, { status: 401 });
  }

  let body: { orderID?: string; items?: InvoiceItem[]; contact?: Contact };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "payload invalid" }, { status: 400 });
  }

  const orderID = (body.orderID ?? "").trim();
  const items = Array.isArray(body.items) ? body.items : [];
  if (!orderID) {
    return NextResponse.json({ ok: false, message: "orderID lipsă" }, { status: 400 });
  }

  const rezultat = await issueInvoice({ orderID, items, contact: body.contact });
  if (!rezultat.ok) {
    return NextResponse.json(rezultat, { status: 422 });
  }
  return NextResponse.json(rezultat);
}
