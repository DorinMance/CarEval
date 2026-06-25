// Strat de date "Firebase-ready".
//
// DEMO: datele sunt ținute în localStorage, ca să fie 100% funcțional fără backend.
// LA GO-LIVE: se rescrie DOAR implementarea de mai jos cu apeluri Firestore/Storage
// (firebase/firestore: collection, addDoc, getDocs, updateDoc). UI-ul rămâne neschimbat.

import type { Lead, LeadStatus } from "./types";

const KEY = "careval_leads_v1";

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
  if (window.localStorage.getItem(KEY)) return;
  const now = Date.now();
  const demo: Lead[] = [
    {
      id: "demo-1",
      createdAt: now - 1000 * 60 * 60 * 3,
      status: "nou",
      contact: { nume: "Andrei Munteanu", telefon: "0741 222 333", email: "andrei.m@email.ro", localitate: "Timișoara" },
      total: 650,
      items: [
        {
          productSlug: "evaluare-despagubiri-cuvenite",
          productName: "Evaluare Despăgubiri Cuvenite",
          code: "EV4",
          price: 650,
          data: { marca: "BMW", model: "Seria 5", vin: "WBA5xxxxxxxxxx", transmisie: "Automată", km: "142000", tipPolita: "RCA", dataAccident: "2026-05-18", descriereAvarii: "Impact lateral dreapta, ușă și aripă spate avariate." },
          images: {},
        },
      ],
    },
    {
      id: "demo-2",
      createdAt: now - 1000 * 60 * 60 * 26,
      status: "in_lucru",
      contact: { nume: "Maria Ionescu", telefon: "0755 888 111", email: "maria.ionescu@email.ro", localitate: "Arad" },
      total: 320,
      items: [
        {
          productSlug: "evaluare-autovehicul",
          productName: "Evaluare Autovehicul",
          code: "EV1",
          price: 320,
          data: { marca: "Volkswagen", model: "Golf 7", vin: "WVWxxxxxxxxxx", transmisie: "Manuală", km: "98000" },
          images: {},
        },
      ],
    },
    {
      id: "demo-3",
      createdAt: now - 1000 * 60 * 60 * 50,
      status: "finalizat",
      contact: { nume: "George Pop", telefon: "0722 444 999", email: "george.pop@email.ro", localitate: "Lugoj" },
      total: null,
      items: [
        {
          productSlug: "consultanta-in-caz-de-accident",
          productName: "Consultanță în caz de accident",
          code: "EV7",
          price: null,
          data: { motiv: "Asigurătorul oferă o sumă prea mică, vreau să știu cum contest.", victime: "Nu", locAccident: "DN6 km 14" },
          images: {},
        },
      ],
    },
  ];
  write(demo);
}
