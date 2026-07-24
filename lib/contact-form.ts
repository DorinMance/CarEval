import type { WizardStep } from "./products";

/**
 * Schema formularului de contact.
 *
 * Motivul „Retragere din contract / anulare comandă" nu e decorativ: NETOPIA cere
 * explicit „o modalitate online clară și ușor accesibilă pentru exercitarea
 * dreptului de retragere din contract". Pagina asta o îndeplinește.
 */

export const MOTIVE_CONTACT = [
  "Am o întrebare despre servicii",
  "Vreau o ofertă pentru firmă / flotă",
  "Am o comandă în curs și am nevoie de ajutor",
  "Retragere din contract / anulare comandă",
  "Reclamație sau sesizare",
  "Altceva",
] as const;

/** Motivul care declanșează pașii suplimentari pentru retragere. */
export const MOTIV_RETRAGERE = "Retragere din contract / anulare comandă";

export const CONTACT_STEPS: WizardStep[] = [
  {
    id: "motiv",
    title: "Cu ce te putem ajuta?",
    subtitle: "Alege motivul, ca să ajungi direct la persoana potrivită.",
    fields: [
      {
        name: "motiv",
        label: "Motivul contactului",
        type: "select",
        required: true,
        options: [...MOTIVE_CONTACT],
        full: true,
      },
    ],
  },
  {
    id: "date",
    title: "Datele tale",
    subtitle: "Ca să îți putem răspunde.",
    fields: [
      { name: "nume", label: "Nume și prenume", type: "text", required: true, placeholder: "Ion Popescu" },
      { name: "telefon", label: "Telefon", type: "tel", required: true, placeholder: "07xx xxx xxx" },
      { name: "email", label: "Email", type: "email", required: true, placeholder: "nume@email.ro" },
      { name: "localitate", label: "Localitate", type: "text", placeholder: "Timișoara" },
    ],
  },
  {
    id: "mesaj",
    title: "Mesajul tău",
    subtitle: "Scrie pe scurt despre ce e vorba. Cu cât mai concret, cu atât răspundem mai repede.",
    fields: [
      {
        name: "mesaj",
        label: "Mesaj",
        type: "textarea",
        required: true,
        full: true,
        placeholder: "Descrie situația în câteva rânduri…",
      },
    ],
  },
  {
    id: "sumar",
    title: "Verifică și trimite",
    subtitle: "Confirmă datele înainte de trimitere.",
  },
];
