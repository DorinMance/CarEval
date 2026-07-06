// Strat de date "Firebase-ready".
//
// DEMO: datele sunt ținute în localStorage, ca să fie 100% funcțional fără backend.
// LA GO-LIVE: se rescrie DOAR implementarea de mai jos cu apeluri Firestore/Storage
// (firebase/firestore: collection, addDoc, getDocs, updateDoc). UI-ul rămâne neschimbat.

import type { Lead, LeadStatus } from "./types";

// Bump versiunea când se schimbă structura/seed-ul demo → forțează reîncărcarea datelor.
const KEY = "careval_leads_v2";

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

export function saveLead(lead: Lead): void {
  const leads = read();
  leads.unshift(lead);
  write(leads);
}

export function listLeads(): Lead[] {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}

export function updateLeadStatus(id: string, status: LeadStatus): void {
  const leads = read().map((l) => (l.id === id ? { ...l, status } : l));
  write(leads);
}

export function deleteLead(id: string): void {
  write(read().filter((l) => l.id !== id));
}

// Lead-uri demo pentru ca panoul de admin să arate populat din prima.
export function seedIfEmpty(): void {
  if (typeof window === "undefined") return;
  // Reîncarcă demo-ul dacă lipsește cheia SAU dacă lista e goală/coruptă
  // (altfel, după ștergerea tuturor comenzilor, CRM-ul rămânea gol permanent).
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
  // Poze demo — folosim imagini reale din proiect ca să arate cum apar fotografiile clientului.
  const IMG_AVARIE = "/images/generated/accident-cut.png";
  const IMG_MASINA = "/images/generated/car-cutout.png";
  const IMG_DOC = "/images/generated/docs-cut.png";

  const demo: Lead[] = [
    // 1 — Despăgubiri Cuvenite (avarii + proces verbal)
    {
      id: "demo-1",
      createdAt: now - 1000 * 60 * 60 * 3,
      status: "nou",
      contact: { nume: "Andrei Munteanu", telefon: "0741 222 333", email: "andrei.m@email.ro", localitate: "Timișoara", mesaj: "Asigurătorul mi-a oferit mult sub valoare. Aș vrea raportul cât mai repede pentru contestație." },
      total: 650,
      items: [
        {
          productSlug: "evaluare-despagubiri-cuvenite",
          productName: "Evaluare Despăgubiri Cuvenite",
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
    // 2 — Costuri Reparație (deviz, avarii)
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
    // 3 — Evaluare la Data Accidentului (poze pe 5 unghiuri)
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
