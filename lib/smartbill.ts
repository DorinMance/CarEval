import "server-only";

/**
 * SmartBill — emiterea și trimiterea automată a facturii după încasare.
 *
 * Autentificare: Basic, cu emailul contului și tokenul de API
 * (SmartBill → Setări → Cont → Integrare API).
 *
 * ÎNTRERUPĂTOR: cu `SMARTBILL_ENABLED != "true"` nu se apelează nimic — se
 * logează doar ce s-ar fi trimis. SmartBill NU are mediu de test, iar o factură
 * emisă din greșeală nu se șterge, ci se stornează (și pleacă la ANAF prin
 * e-Factura). Se pornește abia după ce fluxul de plată e verificat.
 *
 * Trimiterea pe email cere ca în SmartBill, la Configurare → Email, să fie bifat
 * „Vreau să folosesc serverul meu de email" și completate datele SMTP. Fără asta,
 * factura se emite dar nu pleacă la client.
 */

const ENABLED = process.env.SMARTBILL_ENABLED === "true";
const USER = process.env.SMARTBILL_USER ?? "";
const TOKEN = process.env.SMARTBILL_TOKEN ?? "";
const CIF = process.env.SMARTBILL_CIF ?? "";
const SERIES = process.env.SMARTBILL_SERIES ?? "";
const BASE = "https://ws.smartbill.ro/SBORO/api";

export interface InvoiceInput {
  orderID: string;
  amount: number;
  description: string;
  contact?: { nume: string; email: string; telefon: string; localitate?: string };
}

function authHeader() {
  return "Basic " + Buffer.from(`${USER}:${TOKEN}`).toString("base64");
}

export async function issueInvoice(input: InvoiceInput): Promise<{ ok: boolean; number?: string; message?: string }> {
  if (!ENABLED) {
    console.log(
      `[SMARTBILL dezactivat] Aș fi emis factură pentru ${input.orderID}: ` +
        `${input.amount} RON, client ${input.contact?.nume ?? "?"} <${input.contact?.email ?? "?"}>`
    );
    return { ok: false, message: "SMARTBILL_ENABLED=false" };
  }
  if (!USER || !TOKEN || !CIF || !SERIES) {
    console.error("[SMARTBILL] configurare incompletă — factura NU a fost emisă.");
    return { ok: false, message: "configurare incompletă" };
  }

  const today = new Date().toISOString().slice(0, 10);
  const payload = {
    companyVatCode: CIF,
    client: {
      name: input.contact?.nume ?? "Client",
      email: input.contact?.email ?? "",
      city: input.contact?.localitate ?? "",
      country: "Romania",
      isTaxPayer: false,
      saveToDb: false,
    },
    issueDate: today,
    seriesName: SERIES,
    isDraft: false,
    dueDate: today,
    // Prețurile de pe site sunt cu TVA inclus.
    products: [
      {
        name: input.description,
        code: input.orderID,
        isDiscount: false,
        measuringUnitName: "buc",
        currency: "RON",
        quantity: 1,
        price: input.amount,
        isTaxIncluded: true,
        taxName: "Normala",
        taxPercentage: 21,
        saveToDb: false,
        isService: true,
      },
    ],
  };

  try {
    const res = await fetch(`${BASE}/invoice`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: authHeader() },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      console.error("[SMARTBILL] emitere eșuată:", res.status, data);
      return { ok: false, message: `HTTP ${res.status}` };
    }

    const number: string | undefined = data?.number;
    console.log(`[SMARTBILL] factură emisă: ${SERIES}${number} pentru ${input.orderID}`);

    // Trimiterea pe email e apel separat.
    if (number && input.contact?.email) {
      const sent = await fetch(`${BASE}/document/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: authHeader() },
        body: JSON.stringify({
          companyVatCode: CIF,
          seriesName: SERIES,
          number,
          type: "factura",
          to: input.contact.email,
        }),
      });
      console.log(`[SMARTBILL] trimitere email: HTTP ${sent.status}`);
    }

    return { ok: true, number };
  } catch (e) {
    console.error("[SMARTBILL] eroare de rețea:", e);
    return { ok: false, message: "eroare de rețea" };
  }
}
