// CarEval — definiția produselor + câmpurile formularului wizard.
// Sursa câmpurilor: formularele de pe careval.ro (grupate în pași logici).

export type FieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "textarea"
  | "checkbox"
  | "tel"
  | "email";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  help?: string;
  full?: boolean; // ocupă toată lățimea
}

export interface ImageGroup {
  name: string;
  label: string;
  max: number;
  help?: string;
}

export interface WizardStep {
  id: string;
  title: string;
  subtitle?: string;
  fields?: Field[];
  images?: ImageGroup[];
}

export interface Product {
  id: number;
  slug: string;
  code: string;
  name: string;
  tagline: string; // beneficiul în 1 frază
  price: number | null; // null = la cerere
  priceNote?: string;
  delivery: string;
  image: string;
  category: "Evaluare" | "Accident" | "Consultanță";
  popular?: boolean;
  shortDescription: string;
  description: string[];
  benefits: string[];
  steps: WizardStep[];
}

// ---- Grupuri de câmpuri reutilizabile ----

const vehicleFields: Field[] = [
  { name: "marca", label: "Marca", type: "text", required: true, placeholder: "ex. BMW" },
  { name: "model", label: "Model", type: "text", required: true, placeholder: "ex. Seria 3" },
  { name: "varianta", label: "Variantă echipare", type: "text", placeholder: "ex. 320d xDrive" },
  { name: "vin", label: "Serie șasiu (VIN)", type: "text", required: true, placeholder: "17 caractere" },
  { name: "capacitate", label: "Capacitate cilindrică [cmc]", type: "number", placeholder: "ex. 1995" },
  { name: "putere", label: "Putere motor [kW]", type: "number", placeholder: "ex. 140" },
  { name: "transmisie", label: "Transmisie", type: "select", required: true, options: ["Manuală", "Automată"] },
  { name: "km", label: "Kilometri rulați [km]", type: "number", required: true, placeholder: "ex. 120000" },
  { name: "primaInmatriculare", label: "Data primei înmatriculări", type: "date", required: true },
  { name: "proprietari", label: "Număr proprietari", type: "number", placeholder: "ex. 2" },
  { name: "dotari", label: "Dotări suplimentare după fabricație", type: "textarea", full: true, placeholder: "Trapă, jante 19”, pachet M, etc." },
];

const accidentFields: Field[] = [
  { name: "descriereAvarii", label: "Descrie avariile autovehiculului", type: "textarea", required: true, full: true, placeholder: "Ex: impact frontal stânga, airbag declanșat, far spart..." },
  { name: "dataAccident", label: "Data accidentului", type: "date", required: true },
  { name: "tipPolita", label: "Tip poliță", type: "select", required: true, options: ["RCA", "CASCO"] },
  { name: "sistemCalcul", label: "Sistem calcul deviz reparații", type: "select", options: ["AUDATEX", "DAT"], help: "Dacă nu știi, lăsăm noi alegerea optimă." },
];

const contactStep: WizardStep = {
  id: "contact",
  title: "Datele tale de contact",
  subtitle: "Un expert te contactează cu oferta în cel mai scurt timp.",
  fields: [
    { name: "nume", label: "Nume și prenume", type: "text", required: true, placeholder: "Ion Popescu" },
    { name: "telefon", label: "Telefon", type: "tel", required: true, placeholder: "07xx xxx xxx" },
    { name: "email", label: "Email", type: "email", required: true, placeholder: "nume@email.ro" },
    { name: "localitate", label: "Localitate", type: "text", placeholder: "ex. Timișoara" },
    { name: "raportTiparit", label: "Doresc și raportul în format tipărit (+65 Lei)", type: "checkbox", full: true },
    { name: "mesaj", label: "Mesaj (opțional)", type: "textarea", full: true, placeholder: "Orice detaliu care ne ajută să pregătim oferta." },
  ],
};

// 5 unghiuri standard pentru evaluare
const angleImages: ImageGroup[] = [
  { name: "imgFata", label: "Față", max: 1 },
  { name: "imgSpate", label: "Spate", max: 1 },
  { name: "imgDreapta", label: "Lateral dreapta", max: 1 },
  { name: "imgStanga", label: "Lateral stânga", max: 1 },
  { name: "imgBord", label: "Bord (km)", max: 1 },
];

const damageImages: ImageGroup[] = [
  { name: "imgAvarii", label: "Imagini cu avariile", max: 10, help: "Până la 10 poze clare cu toate zonele avariate." },
  { name: "imgPV", label: "Proces verbal / constatare daune", max: 3, help: "Dacă ai documentul, încarcă-l aici." },
];

// helpers de compunere pași
const stepVehicle = (subtitle?: string): WizardStep => ({
  id: "vehicul",
  title: "Date despre autovehicul",
  subtitle: subtitle ?? "Completează datele din talon / cartea de identitate a vehiculului.",
  fields: vehicleFields,
});

const stepAccident: WizardStep = {
  id: "accident",
  title: "Detalii accident & avarii",
  subtitle: "Cu cât descrii mai exact, cu atât oferta și raportul sunt mai precise.",
  fields: accidentFields,
};

// ---- Grupuri suplimentare de imagini/documente ----

const insurerDocImages: ImageGroup[] = [
  { name: "docExpertizaAsigurator", label: "Expertiza / oferta asigurătorului", max: 5, help: "Încarcă documentul primit de la asigurător (PDF sau fotografie clară)." },
];

const buyDocImages: ImageGroup[] = [
  { name: "docCarteService", label: "Carte service / alte documente", max: 5, help: "Carte de service, ITP sau orice alt document disponibil despre vehicul." },
];

// ---- Cele 8 produse (ordine conform brief) ----

export const products: Product[] = [
  /* 1 — Consultanță */
  {
    id: 1,
    slug: "consultanta-in-caz-de-accident",
    code: "EV7",
    name: "Consultanță în caz de accident",
    tagline: "Un expert lângă tine, pas cu pas, după accident.",
    price: null,
    priceNote: "200 Lei / oră",
    delivery: "Răspuns rapid",
    image: "/images/generated/prod-consultanta.png",
    category: "Consultanță",
    shortDescription:
      "Nu știi ce să faci după accident? Îți spunem exact ce pași să urmezi ca să obții despăgubirea corectă, fără stres și fără greșeli costisitoare.",
    description: [
      "Imediat după un accident e ușor să faci greșeli care te costă bani. Serviciul de consultanță îți oferă îndrumarea unui expert tehnic autorizat, care îți spune exact ce pași să urmezi.",
      "Te ajutăm cu strategia de despăgubire, documentele necesare și negocierea cu asigurătorul, ca să obții suma corectă.",
    ],
    benefits: [
      "Îndrumare de la expert tehnic judiciar",
      "Eviți greșelile care te costă bani",
      "Strategie clară de despăgubire",
    ],
    steps: [
      {
        id: "caz",
        title: "Detalii despre cazul tău",
        subtitle: "Descrie pe scurt situația ca să te putem ajuta cât mai bine.",
        fields: [
          { name: "motiv", label: "Motivul pentru care soliciți consultanța", type: "textarea", required: true, full: true, placeholder: "Descrie pe scurt ce s-a întâmplat și cu ce te putem ajuta." },
          { name: "locAccident", label: "Locul accidentului", type: "text", full: true, placeholder: "ex. DN6, km 12, Timișoara" },
          { name: "dataOra", label: "Data accidentului", type: "date" },
          { name: "victime", label: "Accident cu victime?", type: "select", options: ["Nu", "Da"], required: true },
        ],
      },
      {
        id: "imagini",
        title: "Imagini cu vehiculele",
        subtitle: "Poze cu mașina ta și cu vehiculul vinovat.",
        images: [
          { name: "imgVehiculTau", label: "Vehiculul tău", max: 4 },
          { name: "imgVehiculVinovat", label: "Vehiculul vinovat", max: 4 },
        ],
      },
      contactStep,
    ],
  },

  /* 2 — Despăgubiri Cuvenite */
  {
    id: 2,
    slug: "evaluare-despagubiri-cuvenite",
    code: "EV4",
    name: "Evaluare Despăgubiri Cuvenite",
    tagline: "Câți bani ți se cuvin de fapt după accident.",
    price: 650,
    delivery: "24–48h",
    image: "/images/generated/prod-despagubiri.png",
    category: "Accident",
    popular: true,
    shortDescription:
      "Calculăm despăgubirea corectă la care ai dreptul — combinăm valoarea vehiculului, devizul de reparație și prevederile poliței.",
    description: [
      "Asigurătorii oferă frecvent mai puțin decât ți se cuvine. Raportul de Despăgubiri Cuvenite stabilește suma corectă la care ai dreptul, conform poliței RCA sau CASCO.",
      "Combinăm opinia de valoare argumentată tehnic, devizul de reparație din AUDATEX/DAT și prevederile legale într-un singur document de expertiză, cu care poți contesta o ofertă subevaluată.",
    ],
    benefits: [
      "Suma corectă, calculată și documentată tehnic",
      "Bază pentru contestație sau instanță",
      "Întocmit de expert tehnic judiciar autorizat MJ",
    ],
    steps: [stepVehicle(), stepAccident, { id: "imagini", title: "Imagini cu avariile", subtitle: "Adaugă și procesul verbal dacă îl ai.", images: damageImages }, contactStep],
  },

  /* 3 — Costuri Reparație */
  {
    id: 3,
    slug: "evaluare-costuri-reparatie-autovehicul",
    code: "EV2",
    name: "Evaluare Costuri Reparație Autovehicul",
    tagline: "Vezi negru pe alb cât costă reparația — calcul AUDATEX/DAT.",
    price: 490,
    delivery: "24–48h",
    image: "/images/generated/prod-costuri.png",
    category: "Accident",
    shortDescription:
      "Deviz de reparație detaliat în sistem AUDATEX sau DAT, cu manoperă, piese și vopsitorie — argument solid în fața asigurătorului.",
    description: [
      "Ai avut un accident și asigurătorul îți oferă o sumă prea mică pentru reparații? Raportul de Evaluare Costuri Reparație îți arată costul real al reparației, calculat în sistemele oficiale AUDATEX sau DAT.",
      "Devizul include manopera, piesele și vopsitoria, pe baza fotografiilor cu avariile. Este documentul cu care poți negocia o despăgubire corectă.",
    ],
    benefits: [
      "Deviz oficial AUDATEX / DAT",
      "Manoperă + piese + vopsitorie, defalcat",
      "Argument puternic în negocierea cu asigurarea",
    ],
    steps: [stepVehicle(), stepAccident, { id: "imagini", title: "Imagini cu avariile", subtitle: "Pozele clare = evaluare precisă.", images: damageImages }, contactStep],
  },

  /* 4 — Data Accidentului */
  {
    id: 4,
    slug: "evaluare-autovehicul-la-data-accidentului",
    code: "EV3",
    name: "Evaluare Autovehicul la Data Accidentului",
    tagline: "Valoarea mașinii exact la momentul accidentului.",
    price: 320,
    delivery: "24–48h",
    image: "/images/generated/prod-data.png",
    category: "Accident",
    shortDescription:
      "Stabilim o opinie de valoare argumentată tehnic pentru vehiculul tău la data accidentului — esențial pentru daune totale și despăgubiri corecte.",
    description: [
      "Când mașina este declarată daună totală, asigurătorul calculează despăgubirea pe baza valorii vehiculului la data accidentului. Raportul nostru stabilește o opinie de valoare argumentată tehnic, cu referire la condițiile de piață din acel moment.",
      "Raportul este semnat de Dr. Ing. Kulcsar Raul Miklos, expert tehnic judiciar autorizat de Ministerul Justiției — cifră documentată, susținută cu referințe AUDATEX/DAT și acceptată de asigurători.",
    ],
    benefits: [
      "Opinie de valoare raportată la data exactă a accidentului",
      "Esențial la daună totală",
      "Document tehnic, semnat de expert autorizat",
    ],
    steps: [
      stepVehicle(),
      { id: "accident", title: "Detalii accident", subtitle: "Avem nevoie de data exactă a evenimentului.", fields: [{ name: "dataAccident", label: "Data accidentului", type: "date", required: true }, { name: "descriereAvarii", label: "Descriere scurtă a accidentului", type: "textarea", full: true, placeholder: "Ce s-a întâmplat?" }] },
      { id: "imagini", title: "Imagini cu mașina", subtitle: "Poze din fiecare unghi + avarii dacă există.", images: angleImages },
      contactStep,
    ],
  },

  /* 5 — Epavă */
  {
    id: 5,
    slug: "evaluare-epava-autoturism",
    code: "EV5",
    name: "Evaluare Epavă Autoturism",
    tagline: "Cât mai valorează mașina ca epavă / piese.",
    price: 450,
    delivery: "24–48h",
    image: "/images/generated/prod-epava.png",
    category: "Accident",
    shortDescription:
      "Stabilește valoarea reziduală (epava) a vehiculului avariat — necesară la calculul corect al daunei totale.",
    description: [
      "La o daună totală, despăgubirea = valoarea mașinii minus valoarea epavei. Dacă epava este supraevaluată, primești mai puțini bani. Acest raport stabilește valoarea reală a epavei.",
      "Evaluarea reziduală documentată te ajută să nu fii dezavantajat în calculul asigurătorului.",
    ],
    benefits: [
      "Valoare reziduală corectă",
      "Te protejează la calculul daunei totale",
      "Raport autorizat, susținut documentat",
    ],
    steps: [stepVehicle(), stepAccident, { id: "imagini", title: "Imagini cu epava", subtitle: "Poze cuprinzătoare cu starea actuală.", images: damageImages }, contactStep],
  },

  /* 6 — Devalorizare */
  {
    id: 6,
    slug: "evaluare-devalorizare-autovehicul-dupa-accident",
    code: "EV6",
    name: "Evaluare Devalorizare Autovehicul după Accident",
    tagline: "Recuperează valoarea pierdută chiar și după reparație.",
    price: 1200,
    delivery: "24–48h",
    image: "/images/generated/prod-devalorizare.png",
    category: "Accident",
    shortDescription:
      "Chiar reparată impecabil, o mașină accidentată valorează mai puțin. Calculăm această pierdere de valoare — bani pe care îi poți recupera.",
    description: [
      "O mașină care a fost accidentată valorează mai puțin la revânzare, chiar și după o reparație perfectă. Această pierdere se numește devalorizare și poate fi recuperată.",
      "Raportul calculează procentul și cifra devalorizării, argumentate tehnic, pe baza datelor din sistemele AUDATEX/DAT — documentul cu care îți ceri banii pierduți de la asigurător.",
    ],
    benefits: [
      "Recuperezi valoarea pierdută la revânzare",
      "Calcul procentual documentat tehnic",
      "Aplicabil chiar și după reparație completă",
    ],
    steps: [stepVehicle(), stepAccident, { id: "imagini", title: "Imagini cu mașina", subtitle: "Înainte/după reparație, dacă ai.", images: damageImages }, contactStep],
  },

  /* 7 — Contraexpertiță Tehnică */
  {
    id: 7,
    slug: "contraexpertiza-tehnica",
    code: "EV_CT",
    name: "Contraexpertiță Tehnică",
    tagline: "Contestă evaluarea asigurătorului cu o opinie independentă.",
    price: 590,
    delivery: "24–48h",
    image: "/images/generated/prod-contraexpertiza.png",
    category: "Accident",
    shortDescription:
      "Ai primit o expertiză sau ofertă de la asigurător pe care o consideri incorectă? O contraexpertiță independentă verifică calculele și poate demonstra diferența.",
    description: [
      "Dacă asigurătorul ți-a furnizat o evaluare pe care o contești, o contraexpertiță tehnică independentă analizează punct cu punct calculele acestuia și argumentează diferențele.",
      "Raportul este elaborat de Dr. Ing. Kulcsar Raul Miklos, expert tehnic judiciar autorizat de Ministerul Justiției, cu referire la sistemele AUDATEX/DAT — document utilizabil în negociere sau în instanță.",
    ],
    benefits: [
      "Verificare independentă a calculelor asigurătorului",
      "Argumentare tehnică punct cu punct",
      "Document tehnic semnat de expert autorizat MJ",
    ],
    steps: [
      stepVehicle(),
      stepAccident,
      {
        id: "imagini",
        title: "Imagini și expertiza asigurătorului",
        subtitle: "Adaugă pozele cu avariile și documentul primit de la asigurător.",
        images: [...damageImages, ...insurerDocImages],
      },
      contactStep,
    ],
  },

  /* 8 — A Doua Opinie */
  {
    id: 8,
    slug: "a-doua-opinie",
    code: "EV_ADO",
    name: "A Doua Opinie — Înainte Să Cumperi",
    tagline: "Verifică mașina pe care vrei s-o cumperi, înainte de tranzacție.",
    price: 490,
    delivery: "24–48h",
    image: "/images/generated/prod-adoua-opinie.png",
    category: "Evaluare",
    shortDescription:
      "Vrei să cumperi o mașină second-hand și vrei o opinie de specialitate? Analizăm starea reală din fotografii și documente și îți oferim o evaluare independentă.",
    description: [
      "Cumpărarea unei mașini second-hand ascunde riscuri: accidente nedeclarate, km dați înapoi sau prețuri umflate. O a doua opinie de la un expert tehnic judiciar îți oferă o imagine clară înainte să semnezi.",
      "Pe baza fotografiilor, a VIN-ului și a documentelor disponibile, elaborăm o opinie tehnic argumentată privind starea și intervalul de valoare orientativ al vehiculului.",
    ],
    benefits: [
      "Opinie independentă înainte de cumpărare",
      "Verificare VIN, documente și stare aparentă din fotografii",
      "Interval de valoare orientativ, argumentat tehnic",
    ],
    steps: [
      {
        id: "anunt",
        title: "Anunțul și datele vehiculului",
        subtitle: "Trimite-ne linkul anunțului sau completează datele mașinii.",
        fields: [
          { name: "linkAnunt", label: "Link anunț (Autovit, OLX etc.)", type: "text", full: true, placeholder: "https://www.autovit.ro/..." },
          { name: "marca", label: "Marca", type: "text", required: true, placeholder: "ex. Volkswagen" },
          { name: "model", label: "Model", type: "text", required: true, placeholder: "ex. Golf" },
          { name: "varianta", label: "Variantă echipare", type: "text", placeholder: "ex. 1.6 TDI Highline" },
          { name: "anFabricatie", label: "An fabricație", type: "number", placeholder: "ex. 2018" },
          { name: "pretCerut", label: "Prețul cerut (€ sau Lei)", type: "text", placeholder: "ex. 12.500 €" },
        ],
      },
      {
        id: "tehnic",
        title: "Date tehnice",
        subtitle: "Completează datele din talon sau din anunț.",
        fields: [
          { name: "vin", label: "Serie șasiu (VIN)", type: "text", placeholder: "17 caractere — din talon sau bord" },
          { name: "capacitate", label: "Capacitate cilindrică [cmc]", type: "number", placeholder: "ex. 1598" },
          { name: "putere", label: "Putere motor [kW]", type: "number", placeholder: "ex. 85" },
          { name: "transmisie", label: "Transmisie", type: "select", options: ["Manuală", "Automată"] },
          { name: "km", label: "Kilometri rulați [km]", type: "number", placeholder: "ex. 95000" },
          { name: "primaInmatriculare", label: "Data primei înmatriculări", type: "date" },
          { name: "proprietari", label: "Număr proprietari", type: "number", placeholder: "ex. 2" },
          { name: "dotari", label: "Dotări suplimentare", type: "textarea", full: true, placeholder: "Climatronic, navigație, camere parcare, etc." },
        ],
      },
      {
        id: "imagini",
        title: "Imagini cu mașina",
        subtitle: "Câte o poză clară din fiecare unghi.",
        images: angleImages,
      },
      {
        id: "documente",
        title: "Documente disponibile",
        subtitle: "Dacă ai acces la carte service, ITP sau alte documente, încarcă-le.",
        images: buyDocImages,
      },
      contactStep,
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** Pași impliciți pentru un produs nou creat din admin (formular minim funcțional). */
export function defaultProductSteps(): WizardStep[] {
  return [stepVehicle(), contactStep];
}

/** Șablon gol pentru „Adaugă produs" în admin. */
export function blankProduct(): Product {
  return {
    id: Date.now(),
    slug: "",
    code: "",
    name: "",
    tagline: "",
    price: 0,
    delivery: "24–48h",
    image: "/images/evaluare-autovehicul-440687.png",
    category: "Evaluare",
    shortDescription: "",
    description: [""],
    benefits: [""],
    steps: defaultProductSteps(),
  };
}

/** slug SEO-friendly din text (diacritice românești incluse). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ă/g, "a").replace(/â/g, "a").replace(/î/g, "i")
    .replace(/ș|ş/g, "s").replace(/ț|ţ/g, "t")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatPrice(p: Product): string {
  if (p.price == null) return p.priceNote ? p.priceNote : "La cerere";
  return `${p.price.toLocaleString("ro-RO")} Lei`;
}

// FAQ per produs (2–3 întrebări reale) — folosit pe pagina de produs + schema FAQPage (SEO).
export const PRODUCT_FAQ: Record<string, [string, string][]> = {
  "consultanta-in-caz-de-accident": [
    ["Cât durează o consultanță?", "De obicei 30–60 de minute, în funcție de complexitatea cazului. Poți suna direct sau completa formularul și te contactăm."],
    ["Consultanța include și un raport?", "Nu — consultanța e îndrumare (pași, strategie, documente). Dacă ai nevoie de un document tehnic, îți recomandăm serviciul de evaluare potrivit."],
  ],
  "evaluare-despagubiri-cuvenite": [
    ["Cu ce mă ajută concret raportul?", "Îți pune negru pe alb suma corectă la care ai dreptul, calculată în AUDATEX/DAT — argumentul tehnic în fața asigurătorului sau la contestație."],
    ["În cât timp primesc raportul?", "În 24–48h de la trimiterea completă a datelor și fotografiilor."],
    ["Pot folosi raportul în instanță?", "Da. E o expertiză tehnică semnată de expert autorizat de Ministerul Justiției; când instanța numește expertul pe caz, are calitate de expertiză judiciară."],
  ],
  "evaluare-costuri-reparatie-autovehicul": [
    ["Ce sistem de calcul folosiți?", "AUDATEX sau DAT — aceleași sisteme oficiale folosite de asigurători, dar de data asta în favoarea ta."],
    ["De ce fotografii am nevoie?", "Poze clare cu toate zonele avariate; cu cât sunt mai complete, cu atât devizul e mai precis."],
  ],
  "evaluare-autovehicul-la-data-accidentului": [
    ["Când am nevoie de acest raport?", "La daună totală, când despăgubirea se calculează la valoarea mașinii din ziua accidentului."],
    ["Cum stabiliți valoarea?", "Prin expertiză tehnică, cu referințe AUDATEX/DAT — o cifră documentată tehnic, nu o valoare de piață oficială."],
  ],
  "evaluare-epava-autoturism": [
    ["Ce înseamnă valoarea epavei?", "Valoarea reziduală a mașinii avariate. La daună totală, despăgubirea = valoarea mașinii minus valoarea epavei."],
    ["De ce contează?", "Dacă epava e supraevaluată de asigurător, primești mai puțini bani. Raportul stabilește valoarea reală, documentat."],
  ],
  "evaluare-devalorizare-autovehicul-dupa-accident": [
    ["Ce este devalorizarea?", "Pierderea de valoare la revânzare pe care o suferă o mașină după un accident, chiar reparată perfect."],
    ["Se poate recupera?", "Da — calculăm procentul și suma, documentat tehnic, pe care le poți cere de la partea vinovată sau de la asigurător."],
  ],
  "contraexpertiza-tehnica": [
    ["Când am nevoie de o contraexpertiză?", "Când ai deja o expertiză sau ofertă de la asigurător pe care o consideri incorectă și vrei o analiză independentă."],
    ["Ce trebuie să trimit?", "Pe lângă datele mașinii, încarci și expertiza/oferta asigurătorului — e materia primă a analizei, fără ea produsul nu poate fi livrat."],
  ],
  "a-doua-opinie": [
    ["Înlocuiește verificarea la un service?", "Nu. Nu vedem fizic mașina — te pregătim să mergi la vizionare știind exact ce să cauți."],
    ["Ce primesc concret?", "Verificare specificații anunț vs. serie șasiu (VIN), interval de preț orientativ AUDATEX/DAT, semnale de atenție din poze și un checklist personalizat pentru vizionare."],
  ],
};

// Linie de onestitate afișată vizibil pe anumite pagini de produs.
export const PRODUCT_NOTE: Record<string, string> = {
  "a-doua-opinie": "Nu înlocuim verificarea la fața locului — te pregătim să mergi acolo știind exact ce să cauți.",
};

export const COMPANY = {
  name: "CarEval",
  legal: "SC VAST Expertise SRL",
  phone: "+40 750 483 935",
  phoneHref: "tel:+40750483935",
  email: "contact@careval.ro",
  address: "Str. Lămîiței 4, ap. 12, Giroc, Timiș",
  hours: "Luni–Vineri, 08:00–17:00",
  expert: "Dr. Ing. KULCSAR Raul Miklos — Expert Tehnic Judiciar",
};
