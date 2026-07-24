export type LeadStatus = "nou" | "in_lucru" | "finalizat";

export interface LeadItem {
  productSlug: string;
  productName: string;
  code: string;
  price: number | null;
  /** valorile câmpurilor completate în wizard (name -> value) */
  data: Record<string, string | boolean>;
  /** imagini ca data URL (groupName -> listă) */
  images: Record<string, string[]>;
}

export interface Contact {
  nume: string;
  telefon: string;
  email: string;
  localitate?: string;
  mesaj?: string;
}

export interface Lead {
  id: string;
  createdAt: number;
  status: LeadStatus;
  contact: Contact;
  items: LeadItem[];
  /** sumă estimativă (produse cu preț fix) */
  total: number | null;
  /**
   * Numărul de comandă afișat clientului la plata cu cardul și în NETOPIA.
   * Fără el, un client care sună („comanda CE-... nu a mers") nu poate fi găsit
   * în panou. Lipsește la comenzile trimise fără plată online.
   */
  orderID?: string;
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  nou: "Nou",
  in_lucru: "În lucru",
  finalizat: "Finalizat",
};
