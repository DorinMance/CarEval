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
  /** Adresa (stradă, nr) — necesară pe factură. */
  adresa?: string;
  /** Județ — câmp separat pe factura SmartBill. */
  judet?: string;
  mesaj?: string;

  // ── Facturare pe firmă (persoană juridică) ──
  /** Bifă „doresc factură pe firmă". Când e true, câmpurile de mai jos sunt cerute. */
  facturaFirma?: boolean;
  /** Denumirea firmei (apare ca nume pe factură în locul persoanei). */
  firmaNume?: string;
  /** CIF/CUI, ex. RO12345678. Prefixul RO = plătitor de TVA. */
  firmaCui?: string;
  /** Nr. de la Registrul Comerțului (opțional, ex. J40/1234/2020). */
  firmaRegCom?: string;
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
  /** Numărul facturii emise din admin (ex. „VAST0832"). Absent = nefacturat. */
  facturaNr?: string;
  /** Momentul emiterii facturii (ms). */
  facturaData?: number;

  // ── Starea plății, scrisă permanent de IPN-ul NETOPIA pe comandă ──
  /** „platit" | „esuat" | „in_asteptare". Absent = fără plată online încă. */
  plataStare?: "platit" | "esuat" | "in_asteptare";
  /** ID-ul tranzacției NETOPIA (ntpID), pentru reconciliere. */
  plataNtpID?: string;
  /** Momentul ultimei notificări de plată (ms). */
  plataData?: number;
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  nou: "Nou",
  in_lucru: "În lucru",
  finalizat: "Finalizat",
};
