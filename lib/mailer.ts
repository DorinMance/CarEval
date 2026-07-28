import "server-only";
import nodemailer from "nodemailer";

/**
 * Trimiterea de emailuri tranzacționale, prin SMTP-ul căsuței `comenzi@careval.ro`
 * (cPanel / ClausWeb, `mail.careval.ro:465`).
 *
 * De ce prin căsuța proprie și nu printr-un serviciu extern: domeniul are deja
 * SPF care include explicit IP-ul acestui server (89.36.154.1) ȘI o semnătură
 * DKIM publicată (`default._domainkey.careval.ro`). Un email trimis de aici e
 * deci autentificat corect — condiția principală ca să nu ajungă în spam.
 *
 * ATENȚIE la adresa expeditorului: trebuie să rămână pe `@careval.ro`. Dacă s-ar
 * trimite „în numele" altui domeniu (ex. adresa clientului), SPF/DKIM nu s-ar mai
 * potrivi cu domeniul din `From`, iar mesajul ar fi tratat ca posibil fals.
 *
 * ÎNTRERUPĂTOR: fără variabilele SMTP setate nu se trimite nimic — se logează
 * doar ce s-ar fi trimis. Așa merge dezvoltarea local fără să plece emailuri
 * reale către clienți.
 */

const HOST = process.env.SMTP_HOST ?? "";
const PORT = Number(process.env.SMTP_PORT ?? 465);
const USER = process.env.SMTP_USER ?? "";
const PASS = process.env.SMTP_PASS ?? "";

/** Numele afișat la expeditor. Adresa rămâne cea autentificată (vezi mai sus). */
const FROM_NAME = process.env.SMTP_FROM_NAME ?? "CarEval";

export const isMailEnabled = Boolean(HOST && USER && PASS);

/**
 * Transportul e recreat la fiecare apel, fără pool de conexiuni.
 *
 * Pe Netlify fiecare cerere poate nimeri altă instanță, iar o instanță „adoarme"
 * imediat după răspuns — o conexiune ținută deschisă ar fi tăiată oricum, dar ar
 * întârzia răspunsul. Timeout-urile sunt scurte din același motiv: dacă serverul
 * de mail nu răspunde, nu blocăm confirmarea plății.
 */
function transport() {
  return nodemailer.createTransport({
    host: HOST,
    port: PORT,
    // 465 = TLS de la început; 587 = conexiune simplă upgradată prin STARTTLS.
    secure: PORT === 465,
    auth: { user: USER, pass: PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

export interface MailInput {
  to: string;
  subject: string;
  html: string;
  /**
   * Varianta text a mesajului. NU e opțională din întâmplare: un email doar-HTML
   * e un semnal clasic de spam, iar filtrele îl punctează negativ.
   */
  text: string;
}

export interface MailResult {
  ok: boolean;
  message?: string;
}

/**
 * Trimite un email. Nu aruncă niciodată — apelanții sunt fluxuri care NU trebuie
 * să pice din cauza mailului (confirmarea unei plăți încasate rămâne validă chiar
 * dacă serverul de mail e picat).
 */
export async function sendMail({ to, subject, html, text }: MailInput): Promise<MailResult> {
  if (!isMailEnabled) {
    console.warn(`[mail] DEZACTIVAT — nu am trimis către ${to}: „${subject}”`);
    return { ok: false, message: "SMTP neconfigurat" };
  }
  try {
    const info = await transport().sendMail({
      from: { name: FROM_NAME, address: USER },
      to,
      subject,
      text,
      html,
    });
    console.log(`[mail] trimis către ${to}: „${subject}” (${info.messageId})`);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[mail] EȘUAT către ${to}: ${msg}`);
    return { ok: false, message: msg };
  }
}
