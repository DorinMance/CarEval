import "server-only";

/**
 * NETOPIA Payments — API v2 (REST + cheie API).
 *
 * Autentificare: cheia API în headerul `Authorization`. Cheile RSA (privată/publică)
 * din panou sunt pentru API-ul v1 și NU se folosesc aici.
 *
 * Sandbox:   https://secure.sandbox.netopia-payments.com
 * Producție: https://secure.netopia-payments.com
 * Semnătura punctului de vânzare e aceeași în ambele medii; diferă doar cheia API.
 */

const BASE = (process.env.NETOPIA_BASE_URL ?? "https://secure.sandbox.netopia-payments.com").replace(/\/$/, "");
const API_KEY = process.env.NETOPIA_API_KEY ?? "";
const POS_SIGNATURE = process.env.NETOPIA_POS_SIGNATURE ?? "";

export const isNetopiaEnabled = Boolean(API_KEY && POS_SIGNATURE);
export const isNetopiaSandbox = BASE.includes("sandbox");

/** Statusuri de plată, din specificația oficială (`PaymentNotify.status`). */
export const NETOPIA_STATUS = {
  PAID: 3,          // plătit
  CONFIRMED: 5,     // confirmat — banii sunt încasați
  INVALID_ACCOUNT: 12,
} as const;

/** Statusurile în care comanda se consideră încasată. */
export function isPaidStatus(status: number): boolean {
  return status === NETOPIA_STATUS.PAID || status === NETOPIA_STATUS.CONFIRMED;
}

export interface StartPaymentInput {
  orderID: string;
  amount: number;           // în lei, ex. 730
  description: string;
  redirectUrl: string;      // unde e trimis browserul după plată
  notifyUrl: string;        // unde trimite NETOPIA confirmarea (server-server)
  billing: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    city?: string;
    state?: string;
    postalCode?: string;
    details?: string;
  };
}

export interface StartPaymentResult {
  ok: boolean;
  paymentURL?: string;
  ntpID?: string;
  status?: number;
  message?: string;
}

export async function startCardPayment(input: StartPaymentInput): Promise<StartPaymentResult> {
  if (!isNetopiaEnabled) {
    return { ok: false, message: "NETOPIA nu e configurat (lipsesc NETOPIA_API_KEY / NETOPIA_POS_SIGNATURE)." };
  }

  const body = {
    config: {
      emailTemplate: "",
      emailSubject: "",
      notifyUrl: input.notifyUrl,
      redirectUrl: input.redirectUrl,
      language: "ro",
    },
    payment: {
      options: { installments: 0, bonus: 0 },
      instrument: { type: "card" },
    },
    order: {
      posSignature: POS_SIGNATURE,
      dateTime: new Date().toISOString(),
      description: input.description.slice(0, 200),
      orderID: input.orderID,
      amount: input.amount,
      currency: "RON",
      billing: {
        email: input.billing.email,
        phone: input.billing.phone,
        firstName: input.billing.firstName,
        lastName: input.billing.lastName,
        city: input.billing.city || "-",
        country: 642,            // cod numeric ISO pentru România
        countryName: "Romania",
        state: input.billing.state || "-",
        postalCode: input.billing.postalCode || "000000",
        details: input.billing.details || "-",
      },
    },
  };

  try {
    const res = await fetch(`${BASE}/payment/card/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: API_KEY },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data) {
      // Motivul real (ex. „POS is not approved", cheie greșită, sumă invalidă) vine
      // în corpul răspunsului. Fără logul ăsta rămâne doar codul HTTP, care nu spune
      // nimic. Îl scriem în log, dar NU îl arătăm clientului — sunt detalii interne.
      console.error(
        `[NETOPIA] pornire plată eșuată: HTTP ${res.status}`,
        data ? JSON.stringify(data).slice(0, 300) : "(corp necitibil)"
      );
      return { ok: false, message: `NETOPIA a răspuns cu ${res.status}.` };
    }

    const paymentURL: string | undefined = data?.payment?.paymentURL;
    if (!paymentURL) {
      // Codul 101 („Redirect user to payment page") e cazul normal de succes;
      // orice altceva fără paymentURL înseamnă că plata nu poate începe.
      return { ok: false, message: data?.error?.message || "NETOPIA nu a returnat o adresă de plată." };
    }

    return {
      ok: true,
      paymentURL,
      ntpID: String(data?.payment?.ntpID ?? ""),
      status: Number(data?.payment?.status ?? 0),
    };
  } catch {
    return { ok: false, message: "Nu am putut contacta NETOPIA." };
  }
}

/** Structura notificării trimise de NETOPIA pe `notifyUrl`. */
export interface NetopiaNotification {
  payment?: {
    method?: string;
    ntpID?: string;
    status?: number;
    amount?: number;
    currency?: string;
    token?: string;
  };
  order?: { orderID?: string };
}

/* ═══════════════ Verificarea semnăturii notificării (IPN) ═══════════════ */

/**
 * NETOPIA semnează fiecare notificare și trimite dovada în headerul
 * `Verification-token`: un JWT semnat RSA cu cheia lor privată. Verificarea are
 * trei părți, toate obligatorii:
 *
 *   1. semnătura JWT se validează cu certificatul public NETOPIA;
 *   2. `iss` trebuie să fie exact „NETOPIA Payments";
 *   3. `sub` trebuie să fie base64(SHA-512(corpul BRUT al cererii)) — asta leagă
 *      semnătura de conținut, deci nimeni nu poate refolosi un token valid cu un
 *      alt payload (ex. altă comandă sau altă sumă).
 *
 * Fără pasul ăsta, oricine poate trimite un POST cu „status: 3" și marca o
 * comandă drept plătită fără să fi intrat vreun ban.
 */

const PUBLIC_KEY_RAW = process.env.NETOPIA_PUBLIC_KEY ?? "";

/** Algoritmi acceptați. Strict RSA: „none" și HMAC (HS*) sunt vulnerabilități clasice. */
const ALG_TO_HASH: Record<string, string> = {
  RS256: "sha256",
  RS384: "sha384",
  RS512: "sha512",
};

export interface IpnVerifyResult {
  ok: boolean;
  reason?: string;
}

/** Certificatul NETOPIA din env — acceptă PEM direct sau codificat base64. */
function netopiaPublicKey() {
  if (!PUBLIC_KEY_RAW) return null;
  const text = PUBLIC_KEY_RAW.includes("-----BEGIN")
    ? PUBLIC_KEY_RAW.replace(/\n/g, "\n")
    : Buffer.from(PUBLIC_KEY_RAW, "base64").toString("utf8");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { X509Certificate, createPublicKey } = require("node:crypto");
  try {
    // Panoul NETOPIA livrează un certificat X.509; acceptăm și cheie publică simplă.
    return text.includes("BEGIN CERTIFICATE")
      ? new X509Certificate(text).publicKey
      : createPublicKey(text);
  } catch {
    return null;
  }
}

/** True dacă verificarea e configurată (există certificatul public). */
export const isIpnVerificationConfigured = Boolean(PUBLIC_KEY_RAW);

/**
 * Verifică notificarea. `rawBody` trebuie să fie corpul BRUT, exact octeții
 * primiți — un `JSON.parse` urmat de `JSON.stringify` schimbă hash-ul.
 */
export function verifyIpn(token: string | null | undefined, rawBody: string): IpnVerifyResult {
  const key = netopiaPublicKey();
  if (!key) return { ok: false, reason: "certificatul public NETOPIA nu e configurat" };
  if (!token) return { ok: false, reason: "lipsește headerul Verification-token" };

  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "token malformat" };
  const [headerB64, payloadB64, signatureB64] = parts;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createVerify, createHash, timingSafeEqual } = require("node:crypto");

  let alg: string;
  let claims: { iss?: string; sub?: string };
  try {
    alg = String(JSON.parse(Buffer.from(headerB64, "base64url").toString("utf8"))?.alg ?? "");
    claims = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
  } catch {
    return { ok: false, reason: "token indescifrabil" };
  }

  const hash = ALG_TO_HASH[alg];
  if (!hash) return { ok: false, reason: `algoritm neacceptat: ${alg || "(absent)"}` };

  const semnaturaOk = createVerify(hash)
    .update(`${headerB64}.${payloadB64}`)
    .verify(key, Buffer.from(signatureB64, "base64url"));
  if (!semnaturaOk) return { ok: false, reason: "semnătură invalidă" };

  if (claims.iss !== "NETOPIA Payments") {
    return { ok: false, reason: `emitent neașteptat: ${claims.iss ?? "(absent)"}` };
  }

  // Legătura dintre semnătură și conținut.
  const asteptat = createHash("sha512").update(rawBody, "utf8").digest("base64");
  const primit = String(claims.sub ?? "");
  const a = Buffer.from(asteptat);
  const b = Buffer.from(primit);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: "corpul cererii nu corespunde semnăturii" };
  }

  return { ok: true };
}
