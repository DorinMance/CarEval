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

  /* ═══ Articole SEO de nișă (cluster despăgubiri) ═══ */
  {
    slug: "despagubire-mai-mica-decat-ar-trebui-de-ce",
    title: "Despăgubirea e mai mică decât ar trebui: de ce se întâmplă și ce poți face",
    excerpt: "Dacă simți că asigurarea ți-a oferit prea puțin, nu ești singurul. Iată de unde apar diferențele și cum le poți documenta tehnic.",
    category: "Despăgubiri",
    date: "2026-01-14",
    readingTime: "5 min",
    body: [
      "Primești oferta de la asigurător, te uiți la sumă și ai imediat senzația că ceva nu se leagă: mașina ta valorează mai mult, reparația costă mai mult, iar cifra propusă pare scoasă din altă poveste. Această frustrare este reală și, de foarte multe ori, justificată. Ofertele inițiale sunt construite pe estimări rapide, iar estimările rapide tind să fie prudente pentru cel care plătește, adică pentru asigurător, nu pentru tine.",
      "Cel mai frecvent, diferența apare din trei surse. Prima: manopera și piesele sunt cotate la valori minime, uneori cu piese neoriginale sau la un tarif orar sub cel practicat real în service. A doua: unele operațiuni de reparație pur și simplu lipsesc din deviz, fie că vorbim de vopsire adiacentă, calibrări de senzori sau demontări necesare. A treia: valoarea mașinii la data accidentului este apreciată global, fără să țină cont de dotări, kilometraj real sau starea concretă a exemplarului tău.",
      "Aici intervine o expertiză tehnică independentă. Nu este vorba despre a inventa o cifră mai mare, ci despre a reconstrui devizul corect: fiecare operațiune, fiecare piesă, fiecare oră de manoperă, calculate în sistemele AUDATEX sau DAT, aceleași folosite de asigurători. Rezultatul nu este o promisiune, ci o opinie tehnică argumentată, cu un interval orientativ pe care îl poți pune pe masă atunci când negociezi.",
      "Un aspect important de înțeles: ai dreptul să ceri o justificare a modului în care s-a ajuns la sumă. Dacă oferta vine fără deviz detaliat, ceri devizul. Dacă devizul are poziții lipsă sau tarife nerealiste, ai un punct de plecare solid pentru contestație. Documentele contează mai mult decât nemulțumirea exprimată la telefon.",
      "CarEval este condus de Dr. Ing. Kulcsar Raul Miklos, expert tehnic judiciar autorizat de Ministerul Justiției pe specializarea autovehicule. O evaluare independentă îți transformă senzația de nedreptate într-o cifră documentată tehnic, pe care asigurătorul o poate verifica punct cu punct.",
      "Dacă simți că ți s-a oferit prea puțin, cere o Evaluare a Despăgubirilor Cuvenite. În 24 până la 48 de ore primești un document tehnic clar, 100% online, cu care poți intra în discuție de pe o poziție informată, nu defensivă.",
    ],
  },
  {
    slug: "cum-contest-oferta-de-despagubire-rca-pas-cu-pas",
    title: "Cum contești oferta de despăgubire RCA, pas cu pas",
    excerpt: "Un ghid practic despre ce faci concret când oferta RCA ți se pare prea mică: ce ceri, în ce ordine și cu ce documente.",
    category: "Ghid",
    date: "2026-02-03",
    readingTime: "6 min",
    body: [
      "O ofertă de despăgubire nu este o sentință definitivă, este o propunere. Mulți oameni o acceptă din grabă sau din senzația că nu au ce face, apoi regretă. Vestea bună este că există o procedură logică prin care poți contesta, iar dacă o urmezi ordonat, șansele să obții o recalculare corectă cresc semnificativ.",
      "Primul pas este să obții devizul complet, nu doar suma finală. Ceri în scris, pe email, defalcarea: piese, manoperă, vopsitorie, operațiuni conexe. Fără acest document nu poți argumenta nimic, pentru că nu știi unde s-a tăiat. Al doilea pas este să compari devizul cu realitatea tehnică a reparației, iar aici un ochi de specialist face diferența între o bănuială și un argument.",
      "Al treilea pas este documentarea stării mașinii: fotografii clare ale avariilor, din unghiuri multiple, plus documentele vehiculului și eventualele facturi de întreținere care dovedesc starea bună. Cu cât dosarul tău este mai complet, cu atât contestația ta este mai greu de respins cu un simplu refuz formal.",
      "Al patrulea pas, și cel care schimbă echilibrul, este o contraexpertiză tehnică. Aceasta reia calculul în sistemele AUDATEX sau DAT și produce un deviz alternativ, argumentat poziție cu poziție. Nu spune doar că suma este mică, ci arată exact ce operațiuni lipsesc și de ce valoarea corectă se situează într-un alt interval orientativ. Un astfel de document este acceptat de asigurători ca bază de discuție tocmai pentru că vorbește limbajul lor tehnic.",
      "Dacă negocierea directă nu duce nicăieri, ai în continuare opțiuni, de la sesizarea către asigurător în scris până la calea instanței. Merită reținut: când instanța numește expertul pe caz, expertiza capătă calitate de expertiză judiciară, cu greutate corespunzătoare în dosar. Până atunci, o expertiză tehnică independentă bine făcută rămâne cel mai bun instrument de negociere.",
      "Nu contesta pe baza frustrării, contestă pe baza cifrelor. Comandă o Contraexpertiză Tehnică de la CarEval, primește un deviz documentat în 24 până la 48 de ore și intră în discuția cu asigurătorul cu argumentele așezate pe hârtie.",
    ],
  },
  {
    slug: "recalculare-despagubire-auto-cand-si-cum-o-ceri",
    title: "Recalcularea despăgubirii auto: când și cum ceri o nouă evaluare",
    excerpt: "Nu orice ofertă merită recalculată, dar multe da. Iată semnalele clare că despăgubirea ta ar trebui recalculată și cum procedezi.",
    category: "Ghid",
    date: "2026-03-11",
    readingTime: "5 min",
    body: [
      "Recalcularea despăgubirii înseamnă să reiei, din temelie, cifra propusă de asigurător și să verifici dacă reflectă corect dauna reală. Nu este un capriciu, este un drept firesc atunci când există indicii clare că evaluarea inițială a fost incompletă sau prea prudentă. Întrebarea corectă nu este dacă ai voie să ceri o recalculare, ci dacă situația ta o justifică.",
      "Există câteva semnale care aproape întotdeauna justifică o recalculare. Primul: devizul include piese neoriginale sau reparații acolo unde piesa ar fi trebuit înlocuită. Al doilea: tariful orar de manoperă este vizibil sub cel practicat de service-urile din zona ta. Al treilea: valoarea mașinii la data accidentului a fost apreciată fără a lua în calcul dotările, motorizarea sau starea concretă a exemplarului. Al patrulea: apar avarii ascunse, descoperite abia la demontare, care nu figurau în estimarea inițială.",
      "Procedura este simplă în esență. Aduni documentele daunei, obții devizul asigurătorului, apoi soliciți o reevaluare tehnică independentă. Aceasta recalculează totul în sistemele AUDATEX sau DAT și produce o cifră documentată tehnic, cu un interval orientativ pe care îl poți compara direct cu oferta primită. Diferența dintre cele două cifre devine argumentul tău de negociere.",
      "Este important de spus ce nu facem: nu îți promitem o sumă anume și nu garantăm că asigurătorul o va accepta necondiționat. Ceea ce oferim este o opinie tehnică argumentată, verificabilă poziție cu poziție, care rezistă la o analiză serioasă. Tocmai pentru că este solidă tehnic, o astfel de reevaluare este acceptată de asigurători ca bază reală de discuție.",
      "Momentul contează. O recalculare cerută devreme, înainte să semnezi acceptarea finală a ofertei, îți păstrează toate opțiunile deschise. Odată ce ai acceptat în scris o sumă, discuția devine mult mai grea.",
      "Dacă ai unul dintre semnalele de mai sus, nu aștepta. Cere o Evaluare a Despăgubirilor Cuvenite de la CarEval, 100% online, cu livrare în 24 până la 48 de ore, și află care este cifra documentată tehnic în cazul tău.",
    ],
  },
  {
    slug: "rca-vs-casco-diferenta-la-despagubire",
    title: "RCA vs CASCO: ce diferență faci la despăgubire și de unde vin sumele",
    excerpt: "Aceeași avarie, două logici de despăgubire diferite. Înțelege de ce RCA și CASCO ajung la cifre distincte și ce contești la fiecare.",
    category: "Ghid",
    date: "2026-04-08",
    readingTime: "6 min",
    body: [
      "Mulți șoferi descoperă abia după accident că RCA și CASCO nu despăgubesc la fel, chiar și pentru aceeași avarie. Confuzia este de înțeles, dar diferența are consecințe directe asupra sumei pe care o primești. Dacă știi de la început în ce logică te afli, negociezi mult mai bine.",
      "RCA este asigurarea de răspundere civilă: te despăgubește când altcineva este vinovat, iar plata vine de la asigurătorul celui care ți-a produs dauna. Aici discuția se poartă des în jurul valorii de înlocuire și a devalorizării, iar despăgubirea urmărește să te aducă, tehnic, cât mai aproape de situația dinainte de accident. CASCO este asigurarea proprie, pe care ai plătit-o tu, și acoperă și situațiile în care ești vinovat sau nu există un vinovat identificabil. Aici intervin condițiile din poliță: franșiză, mod de calcul, uzură aplicată la piese.",
      "De aceea aceeași reparație poate produce cifre diferite. Pe CASCO, franșiza ți se scade din despăgubire, iar la unele polițe se aplică o uzură procentuală la piesele înlocuite. Pe RCA, logica este a reparării integrale a prejudiciului, ceea ce deschide discuția despre devalorizare și despre costul real al readucerii mașinii la starea anterioară. Nu este vorba că una este mereu mai bună, ci că se calculează după reguli diferite.",
      "Ce contești diferă și el. Pe RCA verifici dacă devizul acoperă tot prejudiciul, inclusiv devalorizarea, și dacă valoarea la data accidentului a fost corect apreciată. Pe CASCO verifici mai ales corectitudinea aplicării franșizei și a uzurii, plus dacă devizul respectă condițiile poliței. În ambele cazuri, punctul comun rămâne devizul tehnic: dacă operațiunile și piesele sunt cotate greșit, suma finală este greșită, indiferent de tipul poliței.",
      "O expertiză tehnică independentă lămurește exact în ce logică ești și unde se pierd bani. Calculul în sistemele AUDATEX sau DAT produce un deviz clar, iar rezultatul este o cifră documentată tehnic pe care o poți compara cu oferta primită, fie ea pe RCA sau pe CASCO. Aceasta nu este o promisiune de sumă, ci un argument verificabil.",
      "Nu lăsa diferența dintre RCA și CASCO să lucreze împotriva ta din necunoaștere. Comandă o Contraexpertiză Tehnică de la CarEval și află, punct cu punct, dacă despăgubirea ta reflectă corect dauna, indiferent de tipul asigurării.",
    ],
  },
  {
    slug: "asiguratorul-refuza-plata-sau-tergiverseaza-ce-faci",
    title: "Asigurătorul refuză plata sau tergiversează: ce faci și în ce termen",
    excerpt: "Refuz, tăcere sau amânare la nesfârșit. Iată pașii concreți și de ce termenul de contestație nu trebuie lăsat să treacă.",
    category: "Despăgubiri",
    date: "2026-05-20",
    readingTime: "6 min",
    body: [
      "Puține situații sunt mai frustrante decât un dosar de daună care rămâne blocat: fie primești un refuz sec, fie ți se cer mereu alte documente, fie pur și simplu nu mai primești răspuns. Este o formă de uzură psihologică, iar mulți oameni renunță tocmai pentru că se simt depășiți. Nu trebuie să fie așa, dacă acționezi ordonat și la timp.",
      "Primul principiu: totul în scris. Solicitările tale, răspunsurile lor, cererile de documente, toate trebuie să existe pe email sau pe hârtie, cu date. Un dosar în care comunicarea a fost doar telefonică este un dosar greu de apărat. Al doilea principiu: cere motivarea. Un asigurător care refuză plata are obligația să spună de ce, iar un refuz nemotivat sau vag este exact tipul de răspuns pe care îl poți contesta.",
      "Al doilea pas practic este să îți consolidezi dosarul tehnic. Dacă refuzul sau tergiversarea se sprijină pe ideea că avaria nu justifică suma cerută, o expertiză tehnică independentă răstoarnă discuția. Calculată în sistemele AUDATEX sau DAT, ea arată exact ce operațiuni și piese sunt necesare și produce o cifră documentată tehnic. Un astfel de document este mult mai greu de ignorat decât o simplă cerere de plată.",
      "Atenție la termenul de contestație. Nu lăsa timpul să curgă în favoarea celui care întârzie. Fiecare pas, de la sesizarea în scris către asigurător până la eventuala cale a instanței, are propriile termene, iar depășirea lor îți poate slăbi poziția. Regula practică este simplă: acționează cât ești încă în interval, nu după ce a expirat. Dacă nu ești sigur de termenele aplicabile cazului tău, cere o clarificare din timp, nu în ultima zi.",
      "Merită reținut și un aspect de fond: dacă dosarul ajunge în instanță și instanța numește expertul pe caz, expertiza capătă calitate de expertiză judiciară, cu greutate corespunzătoare în proces. Până acolo însă, o expertiză independentă solidă rămâne instrumentul care deblochează cel mai des situațiile, pentru că oferă asigurătorului o bază tehnică pe care o poate accepta fără a mai amâna.",
      "Dacă asigurătorul refuză sau tergiversează, nu rămâne pe poziție de așteptare. Comandă o Contraexpertiză Tehnică de la CarEval, 100% online, cu livrare în 24 până la 48 de ore, și transformă un dosar blocat într-un dosar documentat, cu argumente pe care cealaltă parte le poate verifica.",
    ],
  },

  /* ═══ Articole SEO de nișă (cluster daună totală / epavă) ═══ */
  {
    slug: "valoare-masina-dauna-totala-cum-se-calculeaza",
    title: "Valoarea mașinii la dauna totală: cum se calculează, pas cu pas",
    excerpt: "Explicăm logica din spatele cifrei care decide dauna totală: cum se stabilește valoarea autovehiculului la data accidentului și de ce contează fiecare detaliu.",
    category: "Ghid",
    date: "2026-01-28",
    readingTime: "5 min",
    body: [
      "Când primești vestea că mașina ta a fost declarată daună totală, prima întrebare este aproape mereu aceeași: de unde a ieșit cifra aceea și pe ce se bazează. Este o reacție normală, pentru că suma respectivă influențează direct despăgubirea pe care o vei primi. Înainte de a o accepta sau de a o contesta, merită să înțelegi cum se ajunge la ea.",
      "Punctul de plecare este valoarea autovehiculului chiar în ziua evenimentului, nu în ziua în care ai cumpărat mașina și nici în ziua în care primești oferta. Se pornește de la marcă, model, an de fabricație, motorizare și dotări, apoi se ajustează în funcție de kilometraj, starea generală, istoricul de întreținere și eventualele intervenții anterioare. Fiecare dintre aceste elemente mută cifra în sus sau în jos, iar tocmai de aceea două mașini aparent identice pot avea rezultate diferite.",
      "Peste aceste date se suprapun sistemele de calcul specializate, cum sunt AUDATEX și DAT, folosite la nivel european pentru estimări tehnice. Ele oferă un interval orientativ AUDATEX sau DAT, nu un preț fix, iar rolul expertului este să interpreteze corect acest interval în raport cu situația reală a mașinii tale. Rezultatul nu este o promisiune de valoare de piață, ci o opinie tehnică argumentată, susținută de documente și de o metodologie coerentă.",
      "Dauna totală apare atunci când costul reparației se apropie sau depășește această valoare de referință, moment în care repararea devine neeconomică. Diferența dintre a accepta o cifră subevaluată și a susține una documentată tehnic poate însemna o sumă considerabilă, mai ales la autoturisme cu dotări sau istoric care nu se reflectă automat în tabelele standard.",
      "Aici intervine avantajul unei evaluări independente. Un raport care pornește de la starea concretă a mașinii tale, nu de la o medie generică, îți oferă o bază solidă în discuția cu asigurătorul și un argument acceptat de asigurători atunci când cifrele nu se potrivesc.",
      "Dacă vrei să știi ce valoare avea de fapt mașina în ziua accidentului, serviciul de Evaluare Autovehicul la Data Accidentului îți oferă o cifră documentată tehnic, calculată 100% online, în 24 până la 48 de ore, fără să fie nevoie să te deplasezi nicăieri.",
    ],
  },
  {
    slug: "cat-valoreaza-masina-epava-si-cum-afli-pretul",
    title: "Cât valorează o mașină epavă și cum afli prețul corect",
    excerpt: "O epavă nu este zero lei. Îți arătăm ce anume îi dă valoare unei mașini avariate grav și cum obții o cifră realistă înainte de a o vinde.",
    category: "Ghid",
    date: "2026-02-11",
    readingTime: "4 min",
    body: [
      "Mulți proprietari cred că, odată declarată daună totală, mașina lor nu mai valorează nimic. În realitate, chiar și un autoturism grav avariat păstrează o valoare reziduală, adică suma pe care cineva ar fi dispus să o plătească pentru ceea ce a mai rămas din el. A ignora această valoare înseamnă, de multe ori, a pierde bani.",
      "Valoarea unei epave vine din mai multe direcții. Piesele nedeteriorate, cum sunt motorul, cutia de viteze, trenul de rulare sau componentele electronice, pot fi recuperate și revândute. Contează și cererea pentru modelul respectiv pe piața de dezmembrări, prețul metalului și cât de accesibile sunt piesele întregi. O mașină lovită în față poate avea o parte spate perfect valorificabilă, iar asta se traduce în bani.",
      "Problema apare când această cifră este estimată la ochi sau propusă direct de cel care vrea să cumpere epava. Fără o evaluare tehnică independentă, este ușor să accepți un preț mult sub cât ai putea obține. O cifră documentată tehnic îți dă un punct de referință clar și te ajută să negociezi în cunoștință de cauză.",
      "Valoarea reziduală joacă un rol și în relația cu asigurătorul. Dacă alegi să păstrezi mașina după dauna totală, din despăgubire se scade tocmai această sumă. Cu cât ea este stabilită mai corect, cu atât înțelegi mai bine ce primești efectiv și ce rămâne în discuție.",
      "Dacă vrei să afli cât valorează de fapt mașina ta în starea în care se află acum, serviciul de Evaluare Epavă Autoturism îți oferă o opinie tehnică argumentată asupra valorii reziduale, complet online, în 24 până la 48 de ore, astfel încât să pornești orice negociere cu o cifră solidă în mână.",
    ],
  },
  {
    slug: "dauna-totala-economica-ce-inseamna-cu-adevarat",
    title: "Ce înseamnă dauna totală economică și de ce mașina ta încă merge",
    excerpt: "Uneori mașina pornește și rulează, dar tot este declarată daună totală. Explicăm logica economică din spatele acestei decizii.",
    category: "Ghid",
    date: "2026-02-25",
    readingTime: "5 min",
    body: [
      "Există o situație care îi surprinde pe mulți proprietari: mașina a fost lovită, dar încă pornește, se deplasează și pare reparabilă, iar asigurătorul o declară totuși daună totală. Explicația nu ține de faptul că mașina nu mai poate fi reparată tehnic, ci de faptul că nu mai merită reparată din punct de vedere economic. Acesta este sensul daunei totale economice.",
      "Logica este simplă în esență. Se compară costul estimat al reparației cu valoarea pe care o avea autovehiculul la data accidentului. Atunci când reparația ajunge să coste aproape cât întreaga mașină, sau chiar mai mult, repararea devine nejustificată. Nu are sens să investești într-o reparație cifra la care s-ar ridica un autoturism echivalent în stare bună.",
      "Diferența față de dauna totală tehnică este importantă. La dauna totală tehnică, structura mașinii este atât de afectată încât o reparație sigură nu mai este posibilă. La dauna totală economică, mașina ar putea fi reparată, dar costul o transformă într-o alegere nerentabilă. Ambele duc la aceeași încadrare, însă din motive diferite.",
      "Tocmai de aceea valoarea de referință a mașinii la data accidentului devine elementul central. Dacă această valoare este estimată prea jos, pragul de la care se declară dauna totală scade artificial, iar tu poți fi împins spre o încadrare care nu îți este favorabilă. O cifră documentată tehnic schimbă complet această ecuație.",
      "Un raport independent care stabilește corect valoarea la momentul evenimentului îți arată dacă încadrarea este justificată și îți oferă un argument acceptat de asigurători atunci când ai motive să crezi că estimarea inițială te dezavantajează.",
      "Dacă te afli în această situație și vrei claritate asupra valorii reale a mașinii în ziua accidentului, serviciul de Evaluare Autovehicul la Data Accidentului îți pune la dispoziție o opinie tehnică argumentată, online, în 24 până la 48 de ore.",
    ],
  },
  {
    slug: "pot-pastra-masina-la-dauna-totala-ce-trebuie-sa-stii",
    title: "Pot să păstrez mașina la dauna totală? Ce trebuie să știi înainte de a decide",
    excerpt: "Dauna totală nu înseamnă automat că trebuie să renunți la mașină. Analizăm ce presupune păstrarea ei și cum influențează despăgubirea.",
    category: "Ghid",
    date: "2026-03-19",
    readingTime: "5 min",
    body: [
      "O concepție greșită frecventă este că, odată declarată dauna totală, mașina trebuie predată obligatoriu, iar tu primești o sumă și cazul se închide. În multe situații poți alege să păstrezi autovehiculul, iar această opțiune merită analizată cu atenție, pentru că poate fi avantajoasă în funcție de circumstanțe.",
      "Când alegi să păstrezi mașina, mecanismul se schimbă. Din despăgubirea calculată pe baza valorii la data accidentului se scade valoarea reziduală, adică valoarea a ceea ce a mai rămas din autovehicul și rămâne în posesia ta. Practic, primești diferența dintre cele două cifre, iar mașina, în starea ei actuală, rămâne a ta.",
      "Această variantă are sens mai ales atunci când avaria, deși gravă pe hârtie, lasă în urmă componente valoroase sau când crezi că poți valorifica mașina mai bine decât prin predarea ei. În alte cazuri, când valoarea reziduală scade despăgubirea prea mult iar reparația este nesigură, predarea poate fi alegerea mai bună. Nu există un răspuns unic, ci o decizie care depinde de cifre concrete.",
      "Problema apare atunci când nu ai o imagine clară asupra celor două valori aflate în joc: cea de la data accidentului și cea reziduală. Dacă valoarea reziduală este supraestimată, despăgubirea ta scade nejustificat. Dacă valoarea de referință este subevaluată, pierzi din start. Doar cu ambele cifre documentate tehnic poți compara corect variantele.",
      "O evaluare independentă îți oferă exact acest sprijin: un reper obiectiv pentru fiecare dintre cele două valori, astfel încât decizia de a păstra sau de a preda mașina să fie una informată, nu una luată sub presiune.",
      "Dacă vrei să înțelegi ce ai de câștigat sau de pierdut în fiecare scenariu, serviciile de Evaluare Autovehicul la Data Accidentului și de Evaluare Epavă Autoturism îți oferă cifrele de care ai nevoie, online, în 24 până la 48 de ore, ca să decizi în cunoștință de cauză.",
    ],
  },
  {
    slug: "despagubire-dauna-totala-cum-se-stabileste-suma-finala",
    title: "Despăgubirea la dauna totală: cum se stabilește suma pe care o primești",
    excerpt: "De la valoarea mașinii la suma care ajunge efectiv la tine, sunt câțiva pași care pot face diferența. Îți arătăm unde se pierd sau se câștigă bani.",
    category: "Ghid",
    date: "2026-05-08",
    readingTime: "5 min",
    body: [
      "După o daună totală, suma pe care o primești nu apare din senin și nu este niciodată întâmplătoare. Ea rezultă dintr-un calcul care pornește de la valoarea autovehiculului la data accidentului și trece prin câteva ajustări. A înțelege acest traseu te ajută să vezi exact unde se poate strecura o subevaluare și unde poți interveni.",
      "Primul reper este valoarea mașinii în ziua evenimentului, stabilită în funcție de model, an, kilometraj, dotări și stare. Din această valoare, atunci când păstrezi autovehiculul, se scade valoarea reziduală. Rezultatul este suma netă care ar trebui să ajungă la tine. Fiecare dintre aceste componente poate fi apreciată corect sau incorect, iar erorile se acumulează în defavoarea ta.",
      "Cele mai frecvente diferențe apar la valoarea de plecare. Tabelele standard nu țin cont de dotările suplimentare, de un istoric de întreținere impecabil sau de o stare peste medie a mașinii. Un interval orientativ AUDATEX sau DAT interpretat superficial poate ateriza la limita de jos, deși mașina ta merita o poziționare mai bună. Aici o opinie tehnică argumentată face diferența reală.",
      "Al doilea punct sensibil este valoarea reziduală, atunci când alegi să păstrezi mașina. Dacă aceasta este umflată, despăgubirea ta scade proporțional. O cifră documentată tehnic pentru starea concretă a epavei te protejează de o astfel de reducere nejustificată și îți oferă un argument solid în discuție.",
      "Când cifrele propuse nu se potrivesc cu realitatea, un raport independent devine instrumentul tău principal. Este acceptat de asigurători ca punct de referință și îți dă o poziție clară în negociere, fără să te bazezi doar pe estimarea celeilalte părți.",
      "Dacă vrei să te asiguri că suma finală reflectă valoarea reală a mașinii tale, serviciul de Evaluare Autovehicul la Data Accidentului, completat la nevoie de Evaluare Epavă Autoturism, îți oferă cifrele documentate de care ai nevoie, complet online, în 24 până la 48 de ore.",
    ],
  },

  /* ═══ Articole SEO de nișă (cluster devalorizare / contraexpertiză / pre-cumpărare) ═══ */
  {
    slug: "devalorizare-auto-dupa-accident-cum-o-ceri-la-despagubire",
    title: "Devalorizare auto după accident: cum o incluzi corect în despăgubire",
    excerpt: "Chiar reparată perfect, o mașină lovită valorează mai puțin pe piață. Iată cum documentezi tehnic pierderea și cum o susții la asigurător.",
    category: "Ghid",
    date: "2026-01-21",
    readingTime: "5 min",
    body: [
      "După un accident, mulți proprietari cred că totul se rezolvă odată ce mașina iese din service reparată. În realitate, o mașină cu istoric de daună înregistrată se vinde mai greu și la un preț mai mic decât una identică, fără evenimente în trecut. Această diferență se numește devalorizare comercială și nu apare automat în oferta asigurătorului, pentru că reparația acoperă doar readucerea la starea tehnică, nu și pierderea de valoare pe piață.",
      "Devalorizarea nu este o cifră inventată. Ea se estimează pornind de la clasa vehiculului, vârstă, rulaj, amploarea avariei, zona reparată (element structural sau doar tinichigerie de suprafață) și de la modul în care piața locală penalizează un istoric de daună. La CarEval lucrăm cu date din sistemele AUDATEX și DAT pentru a construi un interval orientativ, pe care îl susținem cu o opinie tehnică argumentată, nu cu o promisiune de sumă fixă.",
      "Pentru o evaluare corectă a devalorizării avem nevoie de câteva lucruri concrete: pozele clare ale zonelor avariate înainte și după reparație, devizul de reparație, actele mașinii și, dacă există, procesul verbal sau constatarea daunei. Ne bazăm strict pe materialele pe care ni le trimiți, deoarece lucrăm 100% online, în 24 până la 48 de ore, fără să fie nevoie să aduci mașina undeva.",
      "Un aspect important ține de momentul cererii. Devalorizarea se poate solicita în cadrul dosarului de despăgubire, iar cu cât ai o documentație tehnică mai clară de la început, cu atât discuția cu asigurătorul este mai scurtă și mai puțin ambiguă. O cifră documentată tehnic, cu metodologie explicată, este mult mai greu de respins decât o simplă pretenție verbală.",
      "Trebuie spus onest că estimarea noastră este o opinie tehnică, nu o garanție că vei primi exact acea sumă. Rolul nostru este să îți dăm un argument solid și coerent, care rezistă la o discuție serioasă și care poate fi acceptat de asigurători ca punct de plecare rezonabil. Decizia finală asupra despăgubirii rămâne un proces de negociere sau, dacă se ajunge acolo, o chestiune pentru instanță.",
      "Dacă tocmai ți-ai reparat mașina după un accident și simți că oferta primită nu ține cont de pierderea reală de valoare, o Evaluare Devalorizare la CarEval îți oferă baza tehnică de care ai nevoie pentru a cere ce ți se cuvine, calm și pe argumente, nu pe presupuneri.",
    ],
  },
  {
    slug: "contest-expertiza-asiguratorului-cand-are-sens-contraexpertiza",
    title: "Contești expertiza asigurătorului? Când are sens o contraexpertiză tehnică",
    excerpt: "Constatarea daunei ți se pare subevaluată. Iată cum recunoști o estimare discutabilă și cum o contraexpertiză independentă îți poate schimba dosarul.",
    category: "Ghid",
    date: "2026-03-04",
    readingTime: "5 min",
    body: [
      "Prima constatare a daunei este făcută de un expert care lucrează pentru asigurător sau în interesul acestuia. Nu înseamnă neapărat rea intenție, dar înseamnă că estimarea poate fi conservatoare: piese trecute la reparat în loc de înlocuit, ore de manoperă subevaluate sau avarii ascunse care nu au fost luate în calcul pentru că nu se vedeau în poza inițială. Aici intervine dreptul tău de a cere o a doua părere.",
      "O contraexpertiză tehnică este o reevaluare independentă a daunei, făcută de un expert care nu are interes în minimizarea sumei. Ea compară metodologic estimarea existentă cu ceea ce rezultă dintr-un calcul propriu, folosind aceleași instrumente recunoscute în domeniu, AUDATEX și DAT, pentru a arăta unde și de ce apar diferențele. Rezultatul nu este o cifră aruncată, ci o opinie tehnică argumentată, punct cu punct.",
      "Are sens să ceri o contraexpertiză atunci când diferența dintre ce ți s-a oferit și ce simți că ar costa o reparație corectă este semnificativă, când ți s-a propus reparat în loc de înlocuit la piese de siguranță, sau când suspectezi că avariile structurale au fost tratate superficial. Pentru cazuri minore, cu diferențe mici, efortul poate să nu merite; onestitatea aici contează mai mult decât o vânzare.",
      "La CarEval procesul este 100% online. Ne trimiți constatarea existentă, devizul, pozele detaliate ale avariilor și actele mașinii, iar noi întoarcem analiza în 24 până la 48 de ore. Lucrăm strict pe baza materialelor primite, deci calitatea pozelor și completitudinea documentelor influențează direct cât de ferm putem susține concluziile.",
      "Este important de înțeles distincția dintre o contraexpertiză și o expertiză judiciară. Contraexpertiza noastră este un document tehnic pe care îl poți folosi în negocierea cu asigurătorul și care poate fi acceptat de asigurători ca argument. Expertiza judiciară propriu-zisă intervine doar atunci când un litigiu ajunge în instanță, iar instanța numește expertul pe caz. Dr. Ing. Kulcsar Raul Miklos este expert tehnic judiciar autorizat de Ministerul Justiției, iar această autorizare privește persoana expertului, nu documentul în sine.",
      "Dacă estimarea primită nu ți se pare corectă și vrei un argument solid înainte de a accepta sau a contesta, o Contraexpertiză Tehnică la CarEval îți pune la dispoziție o analiză independentă, clară și documentată, cu care poți intra în discuție de pe o poziție informată.",
    ],
  },
  {
    slug: "a-doua-opinie-expertiza-auto-de-ce-conteaza-independenta",
    title: "A doua opinie la o expertiză auto: de ce contează cine face evaluarea",
    excerpt: "Nu orice estimare are aceeași greutate. Explicăm ce înseamnă o a doua opinie cu adevărat independentă și când merită să o ceri.",
    category: "Ghid",
    date: "2026-04-16",
    readingTime: "4 min",
    body: [
      "În foarte multe dosare de daună, proprietarul acceptă prima estimare pentru că nu știe că are alternative sau pentru că i se pare complicat să conteste. O a doua opinie tehnică nu este un gest de neîncredere agresivă, ci un pas normal atunci când miza financiară este mare. La fel cum ceri o a doua părere medicală înainte de o decizie importantă, o poți cere și pentru mașină.",
      "Ce face diferența nu este doar cifra finală, ci independența și metoda. O a doua opinie are valoare atunci când este făcută de cineva care nu are interes în rezultatul dosarului și care își explică raționamentul: pe ce date se bazează, ce piese a considerat, ce ore de manoperă a luat în calcul și de unde vin diferențele față de prima estimare. Fără această transparență, o cifră nouă nu valorează mai mult decât cea veche.",
      "La CarEval, a doua opinie se sprijină pe instrumentele standard din domeniu, AUDATEX și DAT, și pe experiența unui expert tehnic judiciar autorizat de Ministerul Justiției. Rezultatul îl formulăm ca opinie tehnică argumentată și interval orientativ, nu ca o sumă garantată. Este o distincție de fond: îți oferim un temei solid, nu o promisiune pe care nu am putea-o susține.",
      "Procesul este simplu și complet online. Ne trimiți documentele existente și pozele, iar în 24 până la 48 de ore primești o analiză independentă. Pentru că lucrăm doar cu materialele pe care le primim, îți spunem clar de la început ce concluzii putem sprijini ferm și unde rămân limite din cauza informațiilor lipsă.",
      "O a doua opinie devine cu adevărat utilă când o folosești la momentul potrivit: înainte să semnezi acceptul unei despăgubiri, înainte să iei o decizie de reparație costisitoare sau când ai un dubiu real despre corectitudinea estimării. Dacă ești în oricare dintre aceste situații, serviciul A Doua Opinie de la CarEval îți oferă claritatea de care ai nevoie ca să decizi în cunoștință de cauză, nu pe intuiție.",
    ],
  },
  {
    slug: "verificare-anunt-masina-second-hand-red-flags-inainte-sa-cumperi",
    title: "Verificare anunț mașină second hand: red flags pe care le vezi din poze",
    excerpt: "Multe probleme se citesc încă din anunț, înainte de a pierde timp cu o vizionare. Iată semnalele de alarmă și limita reală a unei verificări online.",
    category: "Ghid",
    date: "2026-04-25",
    readingTime: "5 min",
    body: [
      "Piața de mașini second hand este plină de anunțuri corecte, dar și de altele care ascund probleme. Vestea bună este că multe semnale de alarmă se observă încă din anunț, înainte să te urci în mașină și să conduci ore până la vânzător. O citire atentă a pozelor și a descrierii îți economisește timp, bani de drum și dezamăgiri.",
      "Printre semnalele care merită atenție sunt: poze puține sau făcute de departe, care evită detaliile caroseriei, diferențe de nuanță între elemente adiacente care pot indica revopsire, jocuri neuniforme între capote, uși și aripi care sugerează o reparație după impact, precum și un preț vizibil sub media pieței pentru acel model și an, fără o explicație credibilă. La acestea se adaugă descrieri vagi, insistența pe plata rapidă și refuzul de a trimite poze suplimentare la cerere.",
      "Tot din poze se pot citi indicii despre rulaj și uzură: starea volanului, a pedalelor, a scaunului șoferului și a schimbătorului trebuie să fie coerentă cu kilometrajul afișat. Un interior foarte uzat la o mașină prezentată cu rulaj mic este o contradicție care merită investigată. La fel, martori aprinși în bord surprinși în poze spun mai mult decât o descriere optimistă.",
      "Aici este esențial să fim onești cu ce putem și ce nu putem face. O analiză a anunțului pe baza pozelor și documentelor nu înlocuiește verificarea la fața locului și nici proba de drum. Nu avem acces la istoricul VIN și nu putem garanta că mașina nu are probleme ascunse care nu se văd în imagini. Ceea ce facem este să pregătim cumpărătorul: să îi spunem la ce să se uite, ce întrebări să pună și ce zone să ceară verificate suplimentar.",
      "Practic, o a doua opinie tehnică pe un anunț te ajută să filtrezi rapid ofertele care nu merită deplasarea și să mergi la vizionare cu o listă concretă de puncte de control, în loc să te bazezi pe impresie. Este diferența dintre a cumpăra emoțional și a cumpăra informat.",
      "Dacă ai găsit o mașină care îți place, dar vrei o părere tehnică înainte să te implici, serviciul A Doua Opinie, Înainte Să Cumperi de la CarEval îți analizează pozele și documentele trimise și îți spune clar ce semnale de alarmă vede și ce ar trebui să verifici la fața locului.",
    ],
  },
  {
    slug: "cum-verific-o-masina-inainte-sa-o-cumpar-online-checklist-cumparator",
    title: "Cum verifici o mașină înainte să o cumperi, când totul începe online",
    excerpt: "Astăzi cumpărarea unei mașini pornește de pe telefon. Iată cum folosești inteligent etapa online și unde se oprește ea.",
    category: "Ghid",
    date: "2026-05-19",
    readingTime: "5 min",
    body: [
      "Astăzi aproape orice achiziție de mașină începe online: găsești anunțul, vezi pozele, citești descrierea și decizi dacă merită să mergi mai departe. Etapa online este puternică pentru filtrare, dar are limite clare, iar problemele apar când cumpărătorul o tratează ca pe o garanție, nu ca pe o primă triere. Secretul este să folosești fiecare etapă pentru ce poate ea cu adevărat.",
      "În faza online, ai câteva lucruri de făcut metodic. Cere vânzătorului poze suplimentare pe zonele critice: pragurile, arcurile de roată, portbagajul sub mochetă, compartimentul motor și zonele de îmbinare a caroseriei. Cere o poză clară a bordului cu contactul pus, ca să vezi martorii. Cere seria de șasiu și actele, ca să confirmi că datele din anunț corespund cu documentele reale. Un vânzător corect nu se va supăra de aceste cereri.",
      "În paralel, verifică coerența informațiilor. Anul, rulajul, motorizarea și dotările trebuie să se potrivească între ele și cu prețul cerut. Fii atent la descrieri copiate, la lipsa istoricului de întreținere și la explicații care nu se leagă. O opinie tehnică pe aceste materiale te ajută să vezi contradicțiile pe care ochiul neantrenat le trece cu vederea.",
      "Trebuie spus limpede unde se oprește etapa online. O verificare pe baza pozelor și documentelor nu înlocuiește inspecția la fața locului, testul de drum și, ideal, o verificare pe elevator la un service de încredere. Nu avem acces la istoricul VIN și ne bazăm strict pe ce ni se trimite, deci nu putem exclude o problemă ascunsă care nu apare în imagini. Rolul unei a doua opinii este să te pregătească, nu să îți dea o garanție pe care nimeni nu ar putea-o oferi de la distanță.",
      "Gândită așa, etapa online devine un filtru care îți economisește energie și te protejează de deplasări inutile. Când ajungi în sfârșit la mașină, ajungi cu o listă de întrebări și de puncte de verificat, ceea ce schimbă complet echilibrul discuției cu vânzătorul în favoarea ta.",
      "Dacă vrei să transformi o simplă vizionare într-o decizie informată, serviciul A Doua Opinie, Înainte Să Cumperi de la CarEval îți analizează online anunțul și documentele și îți oferă un plan clar de verificare pentru momentul în care ajungi față în față cu mașina.",
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
