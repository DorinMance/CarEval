import { COMPANY } from "./products";
import type { Contact, LeadItem } from "./types";

/**
 * Șablonul emailului de confirmare a plății.
 *
 * Stă separat de `email-plata.ts` (care citește din Firestore și trimite) ca să
 * poată fi randat și verificat izolat, fără bază de date și fără SMTP — vezi
 * `scripts/previzualizare-email.ts`. Modulul e pur: primește date, întoarce text.
 *
 * Promisiunea „răspuns în 24 de ore” e stabilită cu clientul; dacă se schimbă
 * termenul, se schimbă aici o singură dată (apare și în text, și în HTML).
 */

export const TERMEN_RASPUNS = "24 de ore";

export interface ContinutEmail {
  orderID: string;
  contact: Contact;
  items: LeadItem[];
  total: number | null;
}

/** Scapă textul care intră în HTML — numele clientului vine dintr-un formular. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function lei(n: number | null | undefined): string {
  return n == null ? "—" : `${n} Lei`;
}

/** Prenumele, pentru o adresare firească („Bună, Andrei”). */
function prenume(nume: string): string {
  return (nume ?? "").trim().split(/\s+/)[0] || "";
}

export function subiectPlata(orderID: string): string {
  return `Plata confirmată — comanda ${orderID}`;
}

/**
 * Varianta text. Nu e un rezumat al HTML-ului, ci același mesaj complet: unele
 * programe de email o afișează pe asta, iar filtrele de spam o compară cu
 * HTML-ul. Un email doar-HTML e în sine un semnal negativ.
 */
export function textPlata({ orderID, contact, items, total }: ContinutEmail): string {
  const nume = prenume(contact.nume);
  const linii = items.map((i) => `  - ${i.productName}: ${lei(i.price)}`).join("\n");
  return [
    nume ? `Bună, ${nume},` : "Bună,",
    "",
    "Am primit plata pentru comanda ta. Mulțumim!",
    "",
    `Comanda: ${orderID}`,
    linii,
    `  Total plătit: ${lei(total)}`,
    "",
    `Ce urmează: un expert îți analizează dosarul și primești răspuns în ${TERMEN_RASPUNS}.`,
    "Dacă avem nevoie de un document sau o poză în plus, te sunăm la numărul lăsat",
    "în comandă. Până atunci nu e nevoie să faci nimic.",
    "",
    "---",
    // Fără adresa poștală, la cererea clientului.
    COMPANY.legal,
    COMPANY.expert,
    `Telefon: ${COMPANY.phone} | Email: ${COMPANY.email}`,
    COMPANY.hours,
  ].join("\n");
}

/**
 * Varianta HTML. Scrisă cu tabele și stiluri inline pentru că multe programe de
 * email (Outlook mai ales) ignoră CSS-ul modern. Fără imagini: majoritatea le
 * blochează implicit, iar un email care arată corect fără ele ajunge mai rar în
 * spam.
 */
export function htmlPlata({ orderID, contact, items, total }: ContinutEmail): string {
  const NAVY = "#13144d";
  const nume = prenume(contact.nume);
  const randuri = items
    .map(
      (i) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e8e8ef;color:#2b2b3d;font-size:15px;">
              ${esc(i.productName)}
            </td>
            <td style="padding:10px 0;border-bottom:1px solid #e8e8ef;color:#2b2b3d;font-size:15px;text-align:right;white-space:nowrap;">
              ${esc(lei(i.price))}
            </td>
          </tr>`
    )
    .join("");

  return `<!doctype html>
<html lang="ro">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subiectPlata(orderID))}</title></head>
<body style="margin:0;padding:0;background:#f4f4f8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f8;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">

        <tr><td style="background:${NAVY};padding:22px 28px;">
          <div style="color:#ffffff;font-size:19px;font-weight:700;letter-spacing:.3px;">CarEval</div>
          <div style="color:#b9bad8;font-size:13px;margin-top:3px;">Expertiză tehnică auto</div>
        </td></tr>

        <tr><td style="padding:28px 28px 8px;">
          <p style="margin:0 0 14px;color:#2b2b3d;font-size:16px;line-height:1.5;">
            ${nume ? `Bună, ${esc(nume)},` : "Bună,"}
          </p>
          <p style="margin:0 0 20px;color:#2b2b3d;font-size:16px;line-height:1.6;">
            Am primit plata pentru comanda ta. Mulțumim!
          </p>
        </td></tr>

        <tr><td style="padding:0 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
              <td colspan="2" style="padding:0 0 6px;color:#6b6b85;font-size:13px;">
                Comanda <strong style="color:${NAVY};">${esc(orderID)}</strong>
              </td>
            </tr>
            ${randuri}
            <tr>
              <td style="padding:14px 0 0;color:${NAVY};font-size:16px;font-weight:700;">Total plătit</td>
              <td style="padding:14px 0 0;color:${NAVY};font-size:16px;font-weight:700;text-align:right;white-space:nowrap;">
                ${esc(lei(total))}
              </td>
            </tr>
          </table>
        </td></tr>

        <tr><td style="padding:24px 28px 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f8;border-radius:10px;">
            <tr><td style="padding:18px 20px;">
              <div style="color:${NAVY};font-size:15px;font-weight:700;margin-bottom:8px;">Ce urmează</div>
              <p style="margin:0 0 10px;color:#2b2b3d;font-size:15px;line-height:1.6;">
                Un expert îți analizează dosarul și primești răspuns în
                <strong>${TERMEN_RASPUNS}</strong>.
              </p>
              <p style="margin:0;color:#4a4a60;font-size:14px;line-height:1.6;">
                Dacă avem nevoie de un document sau o poză în plus, te sunăm la numărul
                lăsat în comandă. Până atunci nu e nevoie să faci nimic.
              </p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:26px 28px 28px;">
          <div style="border-top:1px solid #e8e8ef;"></div>
          <p style="margin:18px 0 0;color:#6b6b85;font-size:12px;line-height:1.7;">
            ${esc(COMPANY.legal)} &middot; ${esc(COMPANY.expert)}<br>
            Telefon: ${esc(COMPANY.phone)} &middot; Email:
            <a href="mailto:${COMPANY.email}" style="color:${NAVY};">${esc(COMPANY.email)}</a><br>
            ${esc(COMPANY.hours)}
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
