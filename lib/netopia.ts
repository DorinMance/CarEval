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
