import { NextResponse } from "next/server";
import { buildOwnerEmail } from "@/lib/email";
import type { Lead } from "@/lib/types";
import { COMPANY } from "@/lib/products";

// DEMO: simulează trimiterea emailului către proprietar și returnează un preview HTML.
// Persistarea lead-ului în CRM se face client-side (lib/db.ts -> localStorage) pentru demo.
//
// LA GO-LIVE:
//   1. trimite emailul real (nodemailer/Resend) folosind { subject, html } de mai jos
//   2. scrie lead-ul în Firestore (admin SDK) aici, server-side.

export async function POST(req: Request) {
  let lead: Lead;
  try {
    lead = (await req.json()) as Lead;
  } catch {
    return NextResponse.json({ ok: false, error: "Payload invalid" }, { status: 400 });
  }

  if (!lead?.contact?.email || !lead?.contact?.nume || !lead.items?.length) {
    return NextResponse.json({ ok: false, error: "Date incomplete" }, { status: 422 });
  }

  const { subject, html } = buildOwnerEmail(lead);

  // --- DEMO: "trimitere" simulată ---
  console.log(`[CarEval DEMO] Email către ${COMPANY.email}`);
  console.log(`  Subiect: ${subject}`);
  console.log(`  Servicii: ${lead.items.map((i) => i.code).join(", ")}`);

  // mică întârziere ca să simuleze rețeaua
  await new Promise((r) => setTimeout(r, 600));

  return NextResponse.json({
    ok: true,
    demo: true,
    sentTo: COMPANY.email,
    subject,
    previewHtml: html,
  });
}
