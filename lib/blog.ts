export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readingTime: string;
  /** Conținut vechi ca paragrafe (seed). Folosit dacă `content` (HTML) lipsește. */
  body: string[];
  /** Conținut HTML produs de editorul din admin (are prioritate la afișare). */
  content?: string;
}

export const posts: Post[] = [
  {
    slug: "dauna-totala-cum-se-calculeaza",
    title: "Daună totală: cum se calculează și ce poți contesta",
    excerpt:
      "Când mașina e declarată daună totală, despăgubirea se calculează după o formulă simplă. Iată ce intră în ea și unde poți contesta.",
    category: "Ghid",
    date: "2026-06-15",
    readingTime: "4 min",
    body: [
      "O mașină este declarată daună totală atunci când costul reparației se apropie sau depășește valoarea ei dinainte de accident. În acel moment, asigurătorul nu mai plătește reparația, ci despăgubește proprietarul cu o sumă calculată după o formulă: valoarea mașinii la data accidentului minus valoarea epavei (partea care mai poate fi valorificată).",
      "Ambele cifre pot fi discutabile. Dacă valoarea mașinii la data accidentului este subevaluată, primești mai puțin. Dacă valoarea epavei este supraevaluată, din nou primești mai puțin. Exact aici apar cele mai frecvente diferențe între oferta asigurătorului și suma corectă.",
      "Pentru fiecare dintre cele două cifre există un serviciu dedicat: „Evaluare Autovehicul la Data Accidentului” stabilește valoarea mașinii din ziua evenimentului, iar „Evaluare Epavă Autoturism” stabilește valoarea reziduală reală. Ambele sunt documentate tehnic, cu referințe AUDATEX/DAT.",
      "Concluzia: nu accepta calculul daunei totale fără să verifici cele două cifre. O expertiză tehnică independentă îți arată negru pe alb dacă suma oferită e corectă și, dacă nu, cu cât ar trebui să fie mai mare.",
    ],
  },
  {
    slug: "cum-arata-o-expertiza-tehnica-auto",
    title: "Cum arată o expertiză tehnică auto (și de ce contează pentru dosarul tău)",
    excerpt:
      "Un raport bun nu e o cifră aruncată pe hârtie. Iată ce conține o expertiză tehnică serioasă și de ce structura ei contează.",
    category: "Ghid",
    date: "2026-05-30",
    readingTime: "3 min",
    body: [
      "O expertiză tehnică auto nu este o simplă estimare de preț. Este un document structurat care pornește de la identificarea exactă a vehiculului (marcă, model, VIN, kilometraj, dotări), continuă cu descrierea avariilor și a metodologiei de calcul, și se încheie cu o concluzie clară, semnată de expert.",
      "Diferența față de o părere informală stă în argumentare: fiecare cifră este susținută de sistemele de specialitate (AUDATEX/DAT) și de datele transmise de client. Asta transformă documentul dintr-o opinie într-un argument tehnic pe care îl poți susține în fața asigurătorului sau, la nevoie, în instanță.",
      "La CarEval, fiecare raport este întocmit de Dr. Ing. Kulcsar Raul Miklos, expert tehnic judiciar autorizat de Ministerul Justiției. Rapoartele sunt acceptate de asigurători, iar când instanța numește expertul direct pe caz, expertiza are calitate deplină de expertiză judiciară.",
      "Dacă vrei să vezi exact cum arată un astfel de document înainte să comanzi, pe pagina „Model raport” găsești exemple reale, pe fiecare tip de serviciu.",
    ],
  },
  {
    slug: "cat-ti-se-cuvine-dupa-accident",
    title: "Cât ți se cuvine de fapt după un accident auto",
    excerpt:
      "Asigurătorii oferă frecvent mai puțin decât valoarea reală. Iată cum afli suma corectă la care ai dreptul.",
    category: "Despăgubiri",
    date: "2026-05-20",
    readingTime: "4 min",
    body: [
      "După un accident, prima ofertă a asigurătorului este de cele mai multe ori sub valoarea reală a pagubei. Asta nu pentru că ar fi ceva ilegal, ci pentru că ei calculează în favoarea lor și mizează pe faptul că nu vei contesta.",
      "Pentru a ști exact cât ți se cuvine, ai nevoie de trei cifre: valoarea de piață a mașinii, costul real al reparației (calculat în AUDATEX sau DAT) și, în cazul daunei totale, valoarea epavei.",
      "Un raport de evaluare independent îți pune aceste cifre negru pe alb. Cu el, poți contesta o ofertă subevaluată și poți obține despăgubirea corectă — adesea cu mii de lei mai mult.",
      "Concluzia e simplă: nu accepta prima ofertă fără să verifici. O expertiză tehnică autorizată costă puțin în comparație cu diferența pe care o poți recupera.",
    ],
  },
  {
    slug: "ce-este-devalorizarea-auto",
    title: "Ce este devalorizarea auto și cum o recuperezi",
    excerpt:
      "Chiar reparată impecabil, o mașină accidentată valorează mai puțin. Această pierdere poate fi recuperată.",
    category: "Ghid",
    date: "2026-04-28",
    readingTime: "3 min",
    body: [
      "Devalorizarea (sau deprecierea) reprezintă pierderea de valoare pe care o suferă o mașină după ce a fost implicată într-un accident, chiar dacă reparația a fost făcută perfect.",
      "Motivul e psihologic și de piață: un cumpărător va plăti mai puțin pentru o mașină cu istoric de accident, indiferent cât de bine arată. Această diferență este reală și cuantificabilă.",
      "Printr-o expertiză de devalorizare, calculăm exact procentul și suma pierdută. Documentul îți permite să ceri această sumă de la partea vinovată sau de la asigurător.",
    ],
  },
  {
    slug: "documente-necesare-evaluare",
    title: "Ce documente și poze îți trebuie pentru o evaluare corectă",
    excerpt:
      "O evaluare bună începe cu informații complete. Iată lista de care ai nevoie înainte să începi.",
    category: "Ghid",
    date: "2026-04-10",
    readingTime: "2 min",
    body: [
      "Pentru un raport precis, ai nevoie de datele din talon (marcă, model, VIN, data primei înmatriculări) și de kilometrajul actual.",
      "La fotografii, ideal e să ai poze clare din toate cele patru unghiuri ale mașinii, plus bordul (pentru kilometraj) și, dacă există avarii, imagini detaliate cu fiecare zonă afectată.",
      "În cazul accidentelor, procesul-verbal de constatare a daunelor ajută foarte mult la acuratețea devizului. Cu cât informația e mai completă, cu atât raportul e mai exact.",
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
