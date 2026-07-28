import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import {
  isPaidStatus, verifyIpn, isIpnVerificationConfigured, isNetopiaSandbox, getPaymentStatus,
  type NetopiaNotification,
} from "@/lib/netopia";
import { updatePayment, getPayment } from "@/lib/payment-store";
import { adminDb } from "@/lib/firebase-admin";
import { trimiteEmailPlataConfirmata } from "@/lib/email-plata";

/** Suma pe care NOI am inițiat-o, ca să nu credem suma din notificare. */
async function sumaInitiataDinFirestore(orderID: string): Promise<number | null> {
  try {
    const db = adminDb();
    if (!db) return null;
    const snap = await db.collection("leads").doc(orderID).get();
    const d = snap.data() as { plataSumaInitiata?: number; total?: number } | undefined;
    return d?.plataSumaInitiata ?? d?.total ?? null;
  } catch {
    return null;
  }
}

/**
 * Metadate despre o notificare respinsă, ca să putem repara nepotrivirea de format
 * fără să vânăm prin logurile funcțiilor (care se pierd în 24h). Nu conține
 * semnătura și nici date personale — doar ce trebuie ca să comparăm cu specificația.
 */
function diagnostic(token: string | null, raw: string, motiv?: string) {
  const d: Record<string, unknown> = {
    cand: new Date().toISOString(),
    motiv: motiv ?? "-",
    areHeader: !!token,
    parti: token ? token.split(".").length : 0,
    lungimeCorp: raw.length,
    subCalculatDeNoi: createHash("sha512").update(raw, "utf8").digest("base64"),
    // Corpul și tokenul, ca să putem reproduce verificarea offline și testa pe ce
    // cheie publică se validează. Nu sunt secrete: corpul e starea plății (fără
    // date de card), iar tokenul e o semnătură peste el. Se șterg după diagnostic.
    corp: raw.slice(0, 2000),
    token: (token ?? "").slice(0, 3000),
  };
  try {
    const [h, p] = (token ?? "").split(".");
    d.antet = JSON.parse(Buffer.from(h, "base64url").toString("utf8"));
    const claims = JSON.parse(Buffer.from(p, "base64url").toString("utf8"));
    d.iss = claims?.iss;
    d.subPrimitDeLaNetopia = claims?.sub;
    d.cheiClaims = Object.keys(claims ?? {});
  } catch {
    d.tokenIndescifrabil = true;
  }
  return d;
}

/**
 * Confirmarea plății, trimisă de NETOPIA server-la-server pe `notifyUrl`.
 *
 * Aceasta e SINGURA sursă de adevăr pentru „s-a încasat”: endpointul de status
 * (`/operation/status`) e marcat în specificație drept indisponibil încă, iar
 * revenirea browserului nu garantează nimic (utilizatorul poate închide fereastra).
 *
 * NETOPIA nu poate apela `localhost`, deci în dezvoltare se simulează cu
 * `scripts/simulate-ipn.mjs`.
 */
export async function POST(req: Request) {
  // Corpul se citește BRUT: hash-ul din semnătură se calculează pe octeții
  // exacți, iar un JSON.parse/stringify intermediar l-ar schimba.
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return NextResponse.json({ errorCode: 1, message: "payload ilizibil" }, { status: 400 });
  }

  // Corpul trebuie citibil ca JSON înainte de orice — și pentru verificarea de
  // rezervă avem nevoie de `ntpID` din el.
  let body: NetopiaNotification;
  try {
    body = JSON.parse(raw) as NetopiaNotification;
  } catch {
    return NextResponse.json({ errorCode: 1, message: "payload invalid" }, { status: 400 });
  }

  // ── Autenticitatea notificării ──
  // Fără ea, oricine poate trimite un POST cu „status: 3" și marca o comandă drept
  // plătită. Avem DOUĂ căi independente, ca o singură nepotrivire de format să nu
  // blocheze încasările — exact ce s-a întâmplat la prima plată reală, unde NETOPIA
  // a reîncercat de 3 ori și de fiecare dată am răspuns 400:
  //
  //   1. semnătura JWT (rapidă, offline);
  //   2. dacă pică — întrebăm NETOPIA dacă plata e reală (autoritar, cu cheia
  //      noastră API). Un atacator n-ar trece nici pe aici: NETOPIA i-ar spune că
  //      tranzacția nu există sau nu e plătită, iar suma trebuie să coincidă cu cea
  //      inițiată de noi.
  //
  // În sandbox fără certificat lăsăm să treacă (scripts/simulate-ipn.mjs nu poate semna).
  let autentic = false;
  if (isIpnVerificationConfigured) {
    const token = req.headers.get("verification-token");
    const v = verifyIpn(token, raw);
    autentic = v.ok;
    if (!v.ok) {
      // Diagnostic: dacă NETOPIA trimite alt format decât cel documentat, aici se
      // vede exact de ce a picat. Se scrie și în Firestore, fiindcă logurile
      // funcțiilor serverless se pierd în 24h și sunt greu de citit. Nu salvăm
      // semnătura, doar metadate.
      const d = diagnostic(token, raw, v.reason);
      console.warn(`[NETOPIA IPN] semnătură respinsă: ${JSON.stringify(d)}`);
      try {
        const db = adminDb();
        if (db) await db.collection("_diagnostic").doc("ultima-ipn-respinsa").set(d);
      } catch { /* diagnosticul nu trebuie să blocheze plata */ }
    }
  } else if (!isNetopiaSandbox) {
    console.error("[NETOPIA IPN] RESPINS: NETOPIA_PUBLIC_KEY lipsește în producție.");
    return NextResponse.json({ errorCode: 1, message: "verificare neconfigurată" }, { status: 500 });
  } else {
    console.warn("[NETOPIA IPN] sandbox fără certificat — notificare acceptată NEVERIFICATĂ.");
    autentic = true;
  }

  const orderID = body.order?.orderID;
  const status = Number(body.payment?.status ?? 0);
  const ntpID = body.payment?.ntpID;

  if (!orderID) {
    return NextResponse.json({ errorCode: 1, message: "orderID lipsă" }, { status: 400 });
  }

  // A doua cale de autentificare: întrebăm NETOPIA. Nu credem nimic din corpul
  // primit — îl folosim doar ca să știm PE CINE să întrebăm. Confirmăm doar dacă
  // NETOPIA spune că e plătită ȘI suma coincide cu cea inițiată de noi.
  if (!autentic && ntpID) {
    const st = await getPaymentStatus(ntpID, orderID);
    // LEGĂTURA CRITICĂ: NETOPIA ignoră orderID-ul din interogare (caută doar după
    // ntpID) dar răspunde cu orderID-ul REAL al tranzacției. Fără comparația asta,
    // un ntpID plătit legitim (ex. o comandă de 5 Lei) ar „confirma" ORICE altă
    // comandă — testat ca atac, chiar trecea. Comanda din notificare trebuie să fie
    // exact cea căreia NETOPIA îi atribuie tranzacția.
    const comandaOk = !!st.orderID && st.orderID === orderID;
    const initiata = getPayment(orderID)?.amount ?? (await sumaInitiataDinFirestore(orderID));
    const sumaOk = st.amount == null || initiata == null || Math.abs(st.amount - initiata) < 0.01;
    if (st.ok && comandaOk && st.status != null && isPaidStatus(st.status) && sumaOk) {
      autentic = true;
      console.warn(`[NETOPIA IPN] ${orderID}: semnătura a picat, dar NETOPIA confirmă plata — acceptat.`);
    } else {
      console.warn(
        `[NETOPIA IPN] ${orderID}: RESPINS — semnătura invalidă și NETOPIA nu confirmă ` +
        `(status=${st.status ?? "?"}, comandaOk=${comandaOk}, sumaOk=${sumaOk}, motiv=${st.message ?? "-"}).`
      );
      return NextResponse.json({ errorCode: 1, message: "notificare neautentificată" }, { status: 400 });
    }
  } else if (!autentic) {
    console.warn(`[NETOPIA IPN] ${orderID}: RESPINS — semnătură invalidă și fără ntpID de verificat.`);
    return NextResponse.json({ errorCode: 1, message: "notificare neautentificată" }, { status: 400 });
  }

  const paid = isPaidStatus(status);
  const inainte = getPayment(orderID);
  const sumaNotificata = body.payment?.amount;

  // Nu suprascriem orbește suma inițiată. O diferență între cât am cerut și cât
  // raportează NETOPIA e fie o eroare, fie o încercare de manipulare — în ambele
  // cazuri trebuie văzută, nu îngropată.
  const sumaDiferita =
    inainte?.amount != null && sumaNotificata != null && Math.abs(inainte.amount - sumaNotificata) > 0.01;
  if (sumaDiferita) {
    console.warn(
      `[NETOPIA IPN] ATENȚIE sumă diferită la ${orderID}: inițiat ${inainte?.amount}, notificat ${sumaNotificata}`
    );
  }

  const rec = updatePayment(orderID, {
    state: paid ? "platit" : "esuat",
    ntpID,
    netopiaStatus: status,
    // Păstrăm suma inițiată ca referință; o luăm pe cea notificată doar dacă nu aveam una.
    amount: inainte?.amount ?? sumaNotificata,
    currency: body.payment?.currency ?? inainte?.currency,
  });

  console.log(`[NETOPIA IPN] ${orderID} status=${status} → ${paid ? "PLĂTIT" : "eșuat"} (ntpID ${ntpID})`);
  void rec;

  // Scriem starea plății PERMANENT pe comanda din Firestore, ca badge-ul
  // „Plătit / Plată eșuată" din admin să nu depindă de memoria (efemeră) a
  // funcției serverless. Documentul comenzii e cheiat pe orderID. Dacă Admin SDK
  // nu e configurat (fără cheie de service account), degradăm la registrul din
  // memorie — nu blocăm răspunsul către NETOPIA.
  try {
    const db = adminDb();
    if (db) {
      await db.collection("leads").doc(orderID).set(
        {
          plataStare: paid ? "platit" : "esuat",
          plataNtpID: ntpID ?? null,
          plataData: Date.now(),
        },
        { merge: true }
      );
    }
  } catch (e) {
    console.error("[NETOPIA IPN] nu am putut scrie starea plății în Firestore:", e);
  }

  // Confirmarea pe email către client. Se trimite o singură dată (vezi
  // `trimiteEmailPlataConfirmata`) și doar la plată reușită. Așteptăm rezultatul
  // în loc să lansăm în fundal: după ce răspundem, instanța serverless poate fi
  // înghețată imediat, iar un email pornit „pe fundal” s-ar pierde. Funcția nu
  // aruncă și are timeout scurt, deci nu poate bloca răspunsul către NETOPIA.
  if (paid) await trimiteEmailPlataConfirmata(orderID);

  // Factura NU se emite automat aici. Am ales cu clientul facturare manuală:
  // proprietarul apasă „Facturează" în admin (vezi app/api/factura), verifică
  // factura în SmartBill și o trimite el.

  // NETOPIA așteaptă 200 cu errorCode 0; altfel reia notificarea.
  return NextResponse.json({ errorCode: 0 });
}
