import "server-only";
import type { Contact } from "./types";

/**
 * SmartBill — emiterea facturii pentru o comandă.
 *
 * Flux ales cu clientul: facturare MANUALĂ dintr-un buton în admin. NU se emite
 * automat la plată și NU se trimite pe mail. Butonul doar generează factura în
 * SmartBill; proprietarul o verifică acolo și o trimite el, când vrea.
 *
 * Autentificare: Basic, cu emailul contului și tokenul de API
 * (SmartBill → Setări → Integrare API).
 *
 * ÎNTRERUPĂTOR: cu `SMARTBILL_ENABLED != "true"` nu se apelează nimic — se
 * logează doar ce s-ar fi trimis. SmartBill NU are mediu de test, iar o factură
 * emisă din greșeală nu se șterge, ci se stornează (și pleacă la ANAF prin
 * e-Factura).
 */

const ENABLED = process.env.SMARTBILL_ENABLED === "true";
const USER = process.env.SMARTBILL_USER ?? "";
const TOKEN = process.env.SMARTBILL_TOKEN ?? "";
const CIF = process.env.SMARTBILL_CIF ?? "";
const SERIES = process.env.SMARTBILL_SERIES ?? "";
const BASE = "https://ws.smartbill.ro/SBORO/api";

/** Cota standard de TVA din România (21% de la 1 aug. 2025). */
const TVA = 21;

export interface InvoiceItem {
  /** Denumirea serviciului, așa cum apare pe factură. */
  name: string;
  /** Preț cu TVA inclus (prețurile de pe site sunt cu TVA inclus). */
  price: number;
}

export interface InvoiceInput {
  orderID: string;
  items: InvoiceItem[];
  contact?: Contact;
}

function authHeader() {
  return "Basic " + Buffer.from(`${USER}:${TOKEN}`).toString("base64");
}

/**
 * Construiește obiectul `client` pentru SmartBill din datele de contact.
 * Firmă → nume = denumirea firmei, vatCode = CIF, isTaxPayer după prefixul RO.
 * Persoană fizică → nume = numele persoanei, fără CIF.
 */
function buildClient(c?: Contact) {
  const peFirma = !!c?.facturaFirma;
  const cui = (c?.firmaCui ?? "").replace(/\s/g, "").toUpperCase();
  return {
    name: peFirma ? (c?.firmaNume || c?.nume || "Client") : (c?.nume || "Client"),
    // CIF-ul cu prefix RO indică plătitor de TVA — SmartBill emite factura corect.
    vatCode: peFirma ? cui : "",
    regCom: peFirma ? (c?.firmaRegCom ?? "") : "",
    isTaxPayer: peFirma && cui.startsWith("RO"),
    address: c?.adresa ?? "",
    city: c?.localitate ?? "",
    county: c?.judet ?? "",
    country: "Romania",
    email: c?.email ?? "",
    saveToDb: false,
  };
}

export async function issueInvoice(
  input: InvoiceInput
): Promise<{ ok: boolean; number?: string; series?: string; message?: string }> {
  const produse = (input.items ?? []).filter((it) => it && it.price != null && it.price > 0);
  if (produse.length === 0) {
    return { ok: false, message: "comandă fără sumă de facturat" };
  }

  if (!ENABLED) {
    // Afișăm exact ce ar pleca la SmartBill, ca să putem verifica în teste că
    // datele de firmă (CIF, județ, isTaxPayer) și liniile trec corect prin lanț.
    console.log(
      `[SMARTBILL dezactivat] Factură ${input.orderID}. Client:`,
      JSON.stringify(buildClient(input.contact)),
      "Produse:",
      JSON.stringify(produse)
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
    client: buildClient(input.contact),
    issueDate: today,
    seriesName: SERIES,
    isDraft: false,
    dueDate: today,
    // Prețurile de pe site sunt cu TVA inclus.
    products: produse.map((it) => ({
      name: it.name,
      code: input.orderID,
      isDiscount: false,
      measuringUnitName: "buc",
      currency: "RON",
      quantity: 1,
      price: it.price,
      isTaxIncluded: true,
      taxName: "Normala",
      taxPercentage: TVA,
      saveToDb: false,
      isService: true,
    })),
  };

  try {
    const res = await fetch(`${BASE}/invoice`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: authHeader() },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    // SmartBill întoarce 200 cu errorText chiar și la erori de business.
    if (!res.ok || (data && data.errorText)) {
      const msg = data?.errorText || `HTTP ${res.status}`;
      console.error("[SMARTBILL] emitere eșuată:", res.status, msg);
      return { ok: false, message: msg };
    }

    const number: string | undefined = data?.number;
    console.log(`[SMARTBILL] factură emisă: ${SERIES}${number ?? ""} pentru ${input.orderID}`);
    // Intenționat NU trimitem pe mail (document/send). Proprietarul verifică
    // factura în SmartBill și o trimite el.
    return { ok: true, number, series: SERIES };
  } catch (e) {
    console.error("[SMARTBILL] eroare de rețea:", e);
    return { ok: false, message: "eroare de rețea" };
  }
}
