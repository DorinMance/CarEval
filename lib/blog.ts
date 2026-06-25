export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readingTime: string;
  body: string[];
}

export const posts: Post[] = [
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
