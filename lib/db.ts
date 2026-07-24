// Strat de date pentru comenzi (lead-uri).
//
// - Cu Firebase configurat: comenzile se scriu în Firestore, iar pozele în Firebase Storage.
// - Fără Firebase (mod demo): totul în localStorage, cu lead-uri demo pre-încărcate.
// UI-ul (panoul admin, checkout) folosește exact aceleași funcții în ambele moduri.

import type { Lead, LeadStatus } from "./types";
import { isFirebaseEnabled, fbDb, fbStorage } from "./firebase";
import {
  collection, doc, setDoc, onSnapshot, updateDoc, deleteDoc, query, orderBy,
} from "firebase/firestore";
import { ref as storageRef, uploadString, getDownloadURL } from "firebase/storage";

/** Rezolvă o „sursă" de imagine în URL afișabil.
 *  - path local (/images/…), URL http sau dataURL → se folosește ca atare
 *  - cale Storage (Firebase) → generează link-ul de download (necesită admin logat) */
export async function resolveImageUrl(src: string): Promise<string> {
  if (!isFirebaseEnabled) return src;
  if (src.startsWith("http") || src.startsWith("data:") || src.startsWith("/")) return src;
  try {
    return await getDownloadURL(storageRef(fbStorage()!, src));
  } catch {
    return src;
  }
}

const KEY = "careval_leads_v2";
const COL = "leads";

/* ─────────── localStorage (mod demo) ─────────── */
function read(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Lead[]) : [];
  } catch {
    return [];
  }
}

function write(leads: Lead[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(leads));
  window.dispatchEvent(new CustomEvent("careval:leads-updated"));
}

/* ─────────── API public ─────────── */

/** Salvează o comandă: în Firestore (+ poze în Storage) sau în localStorage. */
export async function saveLead(lead: Lead): Promise<void> {
  if (isFirebaseEnabled) {
    const db = fbDb()!;
    const st = fbStorage()!;
    // Dacă comanda are un orderID, documentul e cheiat pe el — o comandă reluată
    // (ex. plata reîncercată) suprascrie același document, nu creează duplicate.
    const ref = lead.orderID ? doc(db, COL, lead.orderID) : doc(collection(db, COL));
    const id = ref.id;

    // Urcă pozele (dataURL) în Storage și înlocuiește-le cu URL-uri publice.
    const items = await Promise.all(
      lead.items.map(async (item, ii) => {
        const images: Record<string, string[]> = {};
        for (const [group, srcs] of Object.entries(item.images)) {
          images[group] = await Promise.all(
            srcs.map(async (src, i) => {
              if (!src.startsWith("data:")) return src; // deja URL/path — nu reurca
              // Salvăm DOAR calea în Firestore. Link-ul de download se generează
              // în admin (logat), ca pozele să nu fie accesibile public.
              const path = `leads/${id}/${ii}_${group}_${i}`;
              await uploadString(storageRef(st, path), src, "data_url");
              return path;
            })
          );
        }
        return { ...item, images };
      })
    );

    await setDoc(ref, {
      createdAt: lead.createdAt,
      status: "nou" as LeadStatus,
      contact: lead.contact,
      total: lead.total ?? null,
      // Numărul de comandă afișat clientului și în NETOPIA. Documentul se
      // construiește câmp cu câmp, deci orice câmp nou trebuie adăugat explicit
      // aici — altfel se pierde tăcut la salvare.
      orderID: lead.orderID ?? null,
      items,
    });
    return;
  }

  // Fallback demo
  const leads = read();
  leads.unshift(lead);
  write(leads);
}

/** Ascultă lista de comenzi în timp real. Returnează funcția de dezabonare. */
export function subscribeLeads(cb: (leads: Lead[]) => void): () => void {
  if (isFirebaseEnabled) {
    const db = fbDb()!;
    const q = query(collection(db, COL), orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Lead, "id">) }))),
      () => cb([])
    );
  }
  // Fallback demo: citim din localStorage + reacționăm la evenimentul de update.
  const emit = () => cb(read().sort((a, b) => b.createdAt - a.createdAt));
  emit();
  if (typeof window !== "undefined") window.addEventListener("careval:leads-updated", emit);
  return () => {
    if (typeof window !== "undefined") window.removeEventListener("careval:leads-updated", emit);
  };
}

/** Listare sincronă (folosită doar în modul demo). */
export function listLeads(): Lead[] {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  if (isFirebaseEnabled) {
    await updateDoc(doc(fbDb()!, COL, id), { status });
    return;
  }
  write(read().map((l) => (l.id === id ? { ...l, status } : l)));
}

export async function deleteLead(id: string): Promise<void> {
  if (isFirebaseEnabled) {
    await deleteDoc(doc(fbDb()!, COL, id));
    return;
  }
  write(read().filter((l) => l.id !== id));
}

/** Lead-uri demo — DOAR în modul fără Firebase. */
export function seedIfEmpty(): void {
  if (isFirebaseEnabled) return; // date reale în Firestore, fără seed
  if (typeof window === "undefined") return;
  const existing = window.localStorage.getItem(KEY);
  if (existing) {
    try {
      const arr = JSON.parse(existing);
      if (Array.isArray(arr) && arr.length > 0) return;
    } catch {
      /* JSON corupt → reface demo-ul */
    }
  }
  const now = Date.now();
  const IMG_AVARIE = "/images/generated/accident-cut.png";
  const IMG_MASINA = "/images/generated/car-cutout.png";
  const IMG_DOC = "/images/generated/docs-cut.png";

  const demo: Lead[] = [
    {
      id: "demo-1",
      createdAt: now - 1000 * 60 * 60 * 3,
      status: "nou",
      contact: { nume: "Andrei Munteanu", telefon: "0741 222 333", email: "andrei.m@email.ro", localitate: "Timișoara", mesaj: "Vreau să verific dacă suma din dosar reflectă corect valoarea mașinii. Aș avea nevoie de raport cât mai repede." },
      total: 650,
      items: [
        {
          productSlug: "evaluare-despagubiri-cuvenite",
          productName: "Evaluare tehnică a prejudiciului",
          code: "EV4",
          price: 650,
          data: {
            marca: "BMW", model: "Seria 5", varianta: "520d xDrive", vin: "WBAJC51020G123456",
            capacitate: "1995", putere: "140", transmisie: "Automată", km: "142000",
            primaInmatriculare: "2019-03-15", proprietari: "2",
            dotari: "Trapă panoramică, jante 19″, pachet M, scaune încălzite",
            descriereAvarii: "Impact lateral dreapta: ușă față și spate deformate, aripă spate zgâriată, airbag lateral declanșat.",
            dataAccident: "2026-05-18", tipPolita: "RCA", sistemCalcul: "AUDATEX", raportTiparit: true,
          },
          images: { imgAvarii: [IMG_AVARIE, IMG_AVARIE], imgPV: [IMG_DOC] },
        },
      ],
    },
    {
      id: "demo-2",
      createdAt: now - 1000 * 60 * 60 * 26,
      status: "in_lucru",
      contact: { nume: "Maria Ionescu", telefon: "0755 888 111", email: "maria.ionescu@email.ro", localitate: "Arad" },
      total: 490,
      items: [
        {
          productSlug: "evaluare-costuri-reparatie-autovehicul",
          productName: "Evaluare Costuri Reparație Autovehicul",
          code: "EV2",
          price: 490,
          data: {
            marca: "Volkswagen", model: "Golf 7", varianta: "2.0 TDI Highline", vin: "WVWZZZ1KZAW654321",
            capacitate: "1968", putere: "110", transmisie: "Manuală", km: "98000",
            primaInmatriculare: "2018-06-10", proprietari: "1",
            dotari: "Navigație Discover Pro, senzori parcare față/spate, faruri full LED",
            descriereAvarii: "Coliziune frontală: bară față, capotă și far stânga deteriorate, radiator lovit.",
            dataAccident: "2026-06-02", tipPolita: "CASCO", sistemCalcul: "DAT",
          },
          images: { imgAvarii: [IMG_AVARIE, IMG_AVARIE, IMG_AVARIE] },
        },
      ],
    },
    {
      id: "demo-3",
      createdAt: now - 1000 * 60 * 60 * 50,
      status: "finalizat",
      contact: { nume: "George Pop", telefon: "0722 444 999", email: "george.pop@email.ro", localitate: "Lugoj", mesaj: "Mașina a fost declarată daună totală, am nevoie de valoarea la data accidentului." },
      total: 320,
      items: [
        {
          productSlug: "evaluare-autovehicul-la-data-accidentului",
          productName: "Evaluare Autovehicul la Data Accidentului",
          code: "EV3",
          price: 320,
          data: {
            marca: "Audi", model: "A4 Avant", varianta: "2.0 TDI quattro", vin: "WAUZZZ8K9BA112233",
            capacitate: "1968", putere: "130", transmisie: "Automată", km: "187000",
            primaInmatriculare: "2017-09-20", proprietari: "3",
            dotari: "Faruri Xenon, tapițerie piele, climatronic 3 zone, cârlig remorcare",
            dataAccident: "2026-04-11",
            descriereAvarii: "Daună totală după impact frontal puternic; vehiculul nu mai este funcțional.",
          },
          images: {
            imgFata: [IMG_MASINA], imgSpate: [IMG_MASINA], imgDreapta: [IMG_MASINA],
            imgStanga: [IMG_MASINA], imgBord: [IMG_MASINA],
          },
        },
      ],
    },
  ];
  write(demo);
}
