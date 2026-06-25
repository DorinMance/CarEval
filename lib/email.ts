// Stub de trimitere email (DEMO).
//
// LA GO-LIVE: înlocuiește buildOwnerEmail + "trimiterea" din /api/lead cu nodemailer
// (sau Resend / SendGrid). Structura payload-ului rămâne identică.

import type { Lead } from "./types";
import { COMPANY } from "./products";

function fieldLabel(name: string): string {
  const map: Record<string, string> = {
    marca: "Marca", model: "Model", varianta: "Variantă", vin: "VIN",
    capacitate: "Capacitate [cmc]", putere: "Putere [kW]", transmisie: "Transmisie",
    km: "Km", primaInmatriculare: "Primă înmatriculare", proprietari: "Proprietari",
    dotari: "Dotări", descriereAvarii: "Avarii", dataAccident: "Data accidentului",
    tipPolita: "Tip poliță", sistemCalcul: "Sistem calcul", motiv: "Motiv",
    locAccident: "Loc accident", dataOra: "Data/ora", victime: "Cu victime",
    raportTiparit: "Raport tipărit",
  };
  return map[name] ?? name;
}

/** Construiește HTML-ul emailului către proprietarul site-ului. */
export function buildOwnerEmail(lead: Lead): { subject: string; html: string } {
  const subject = `Lead nou CarEval — ${lead.contact.nume} (${lead.items.map((i) => i.code).join(", ")})`;

  const itemsHtml = lead.items
    .map((it) => {
      const rows = Object.entries(it.data)
        .filter(([, v]) => v !== "" && v !== false)
        .map(([k, v]) => `<tr><td style="padding:4px 10px;color:#64748b">${fieldLabel(k)}</td><td style="padding:4px 10px;font-weight:600">${v === true ? "Da" : v}</td></tr>`)
        .join("");
      const imgCount = Object.values(it.images).reduce((n, arr) => n + arr.length, 0);
      return `
        <div style="border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin:12px 0">
          <div style="font-weight:700;color:#0b1930;font-size:16px">${it.productName} <span style="color:#8fd02f">(${it.code})</span></div>
          <div style="color:#64748b;margin:4px 0 10px">${it.price != null ? it.price + " Lei" : "Ofertă la cerere"} · ${imgCount} imagini atașate</div>
          <table style="border-collapse:collapse;font-size:14px">${rows}</table>
        </div>`;
    })
    .join("");

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;background:#fff">
    <div style="background:#0b1930;padding:20px 24px;border-radius:12px 12px 0 0">
      <span style="color:#fff;font-size:20px;font-weight:800">Car<span style="color:#8fd02f">Eval</span></span>
      <span style="color:#94a3b8;float:right;font-size:13px">Lead nou de pe site</span>
    </div>
    <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px">
      <h2 style="margin:0 0 4px;color:#0b1930">Cerere de ofertă nouă</h2>
      <p style="color:#64748b;margin:0 0 16px">Un client a trimis o comandă prin coșul de pe ${COMPANY.name}.ro</p>
      <table style="border-collapse:collapse;font-size:14px;margin-bottom:8px">
        <tr><td style="padding:4px 10px;color:#64748b">Nume</td><td style="padding:4px 10px;font-weight:700">${lead.contact.nume}</td></tr>
        <tr><td style="padding:4px 10px;color:#64748b">Telefon</td><td style="padding:4px 10px;font-weight:700">${lead.contact.telefon}</td></tr>
        <tr><td style="padding:4px 10px;color:#64748b">Email</td><td style="padding:4px 10px;font-weight:700">${lead.contact.email}</td></tr>
        <tr><td style="padding:4px 10px;color:#64748b">Localitate</td><td style="padding:4px 10px">${lead.contact.localitate ?? "-"}</td></tr>
        ${lead.contact.mesaj ? `<tr><td style="padding:4px 10px;color:#64748b">Mesaj</td><td style="padding:4px 10px">${lead.contact.mesaj}</td></tr>` : ""}
      </table>
      <h3 style="color:#0b1930;margin:16px 0 0">Servicii alese</h3>
      ${itemsHtml}
      <p style="color:#94a3b8;font-size:12px;margin-top:16px">Acest email a fost generat automat. Răspunde clientului la ${lead.contact.email} sau sună la ${lead.contact.telefon}.</p>
    </div>
  </div>`;

  return { subject, html };
}
