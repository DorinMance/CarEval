import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/lib/products";
import { LegalDoc, LH2, LP, LUl, B } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description:
    "Cum prelucrează CarEval (SC VAST Expertise SRL) datele tale cu caracter personal, conform Regulamentului (UE) 2016/679 (GDPR).",
};

export default function PoliticaConfidentialitatePage() {
  return (
    <LegalDoc
      title="Politica de confidențialitate"
      subtitle="Cum colectăm, folosim și protejăm datele tale cu caracter personal, conform GDPR."
      updated="iulie 2026"
    >
      <LP>
        Această politică explică modul în care <B>{COMPANY.legal}</B>, prin marca <B>{COMPANY.name}</B>,
        prelucrează datele cu caracter personal ale persoanelor care folosesc site-ul careval.ro sau ne
        solicită servicii. Prelucrarea se face cu respectarea Regulamentului (UE) 2016/679 (GDPR) și a
        legislației naționale aplicabile.
      </LP>

      <LH2>1. Cine este operatorul de date</LH2>
      <LP>Operatorul datelor cu caracter personal este:</LP>
      <LUl>
        <li><B>{COMPANY.legal}</B> (marca {COMPANY.name})</li>
        <li>CUI: {COMPANY.cui} · Nr. Reg. Com.: {COMPANY.regCom}</li>
        <li>Sediu: {COMPANY.addressFull}</li>
        <li>Reprezentant: {COMPANY.rep}</li>
        <li>Email: <a className="text-lime-600 underline-offset-2 hover:underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> · Telefon: <a className="text-lime-600 underline-offset-2 hover:underline" href={COMPANY.phoneHref}>{COMPANY.phone}</a></li>
      </LUl>

      <LH2>2. Ce date colectăm</LH2>
      <LP>În funcție de modul în care interacționezi cu noi, putem prelucra:</LP>
      <LUl>
        <li><B>Date de identificare și contact:</B> nume și prenume, telefon, email, localitate.</li>
        <li><B>Date despre vehicul și eveniment:</B> marcă, model, serie șasiu (VIN), kilometraj, date de înmatriculare, descrierea avariilor, data și circumstanțele accidentului, tipul poliței.</li>
        <li><B>Documente și fotografii</B> încărcate de tine pentru realizarea evaluării (poze ale vehiculului, procese-verbale, oferte, acte).</li>
        <li><B>Date de trafic și utilizare</B> a site-ului: adresă IP, tip de dispozitiv și browser, pagini vizitate — colectate prin cookie-uri și instrumente de analiză (vezi <Link className="text-lime-600 underline-offset-2 hover:underline" href="/politica-cookies">Politica de cookie-uri</Link>).</li>
      </LUl>
      <LP>
        Nu îți cerem și nu ai nevoie să ne transmiți date sensibile (de sănătate, biometrice etc.) sau
        codul numeric personal pentru serviciile noastre. Te rugăm să nu incluzi astfel de date în
        câmpurile libere sau în documentele încărcate.
      </LP>

      <LH2>3. În ce scopuri și pe ce temei legal</LH2>
      <LUl>
        <li><B>Furnizarea serviciului solicitat</B> (întocmirea raportului de evaluare / expertiză tehnică extrajudiciară, comunicarea cu tine) — temei: executarea contractului (art. 6 alin. 1 lit. b GDPR).</li>
        <li><B>Emiterea documentelor fiscale și respectarea obligațiilor legale</B> (contabile, fiscale, arhivare) — temei: obligație legală (art. 6 alin. 1 lit. c GDPR).</li>
        <li><B>Îmbunătățirea site-ului și statistici de utilizare</B> — temei: consimțământul tău pentru cookie-urile de analiză (art. 6 alin. 1 lit. a GDPR).</li>
        <li><B>Comunicări administrative</B> legate de cererea ta și, unde e cazul, apărarea unui drept în justiție — temei: interesul legitim (art. 6 alin. 1 lit. f GDPR).</li>
      </LUl>

      <LH2>4. Cine mai are acces la date (persoane împuternicite)</LH2>
      <LP>
        Pentru a funcționa, site-ul folosește furnizori de servicii care pot prelucra date în numele
        nostru, pe bază de contract și cu garanții adecvate:
      </LP>
      <LUl>
        <li><B>Google Firebase</B> (Google Ireland Ltd. / Google LLC) — găzduirea bazei de date și a fișierelor (formulare, imagini).</li>
        <li><B>Netlify</B> — găzduirea și livrarea site-ului, precum și procesarea formularelor trimise.</li>
        <li><B>Google Analytics</B> — statistici de utilizare, doar dacă accepți cookie-urile de analiză.</li>
        <li>Furnizori de email și, la nevoie, contabilul autorizat al societății.</li>
      </LUl>
      <LP>
        Nu vindem și nu închiriem datele tale. Le putem divulga autorităților doar dacă legea ne obligă.
      </LP>

      <LH2>5. Transferuri în afara UE/SEE</LH2>
      <LP>
        Unii furnizori (ex. Google) pot procesa date pe servere din afara Spațiului Economic European.
        În aceste cazuri, transferul se face pe baza clauzelor contractuale standard aprobate de Comisia
        Europeană sau a altor mecanisme legale care asigură un nivel adecvat de protecție.
      </LP>

      <LH2>6. Cât timp păstrăm datele</LH2>
      <LUl>
        <li>Datele din cereri care nu se finalizează într-o comandă: până la <B>12 luni</B>.</li>
        <li>Datele aferente serviciilor prestate și documentele fiscale: pe durata impusă de legislația contabilă și fiscală (în general <B>10 ani</B>).</li>
        <li>Datele de analiză web: conform duratei setate în instrumentul de analiză, ștergându-se ulterior sau fiind anonimizate.</li>
      </LUl>

      <LH2>7. Drepturile tale (GDPR)</LH2>
      <LP>În calitate de persoană vizată, ai următoarele drepturi:</LP>
      <LUl>
        <li>dreptul de <B>acces</B> la date și de a obține o copie;</li>
        <li>dreptul la <B>rectificare</B> a datelor inexacte;</li>
        <li>dreptul la <B>ștergere</B> („dreptul de a fi uitat”), în condițiile legii;</li>
        <li>dreptul la <B>restricționarea</B> prelucrării;</li>
        <li>dreptul la <B>portabilitatea</B> datelor;</li>
        <li>dreptul la <B>opoziție</B> față de prelucrarea bazată pe interes legitim;</li>
        <li>dreptul de a-ți <B>retrage consimțământul</B> oricând (fără a afecta prelucrările anterioare);</li>
        <li>dreptul de a nu fi supus unei decizii bazate exclusiv pe prelucrare automată.</li>
      </LUl>
      <LP>
        Îți poți exercita drepturile printr-o cerere la <a className="text-lime-600 underline-offset-2 hover:underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
        Răspundem în cel mult 30 de zile.
      </LP>

      <LH2>8. Dreptul de a depune o plângere</LH2>
      <LP>
        Dacă apreciezi că prelucrarea îți încalcă drepturile, te poți adresa Autorității Naționale de
        Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP): B-dul G-ral Gheorghe Magheru
        nr. 28-30, sector 1, 010336 București, <a className="text-lime-600 underline-offset-2 hover:underline" href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer">www.dataprotection.ro</a>.
      </LP>

      <LH2>9. Securitatea datelor</LH2>
      <LP>
        Aplicăm măsuri tehnice și organizatorice rezonabile pentru a proteja datele împotriva accesului
        neautorizat, pierderii sau divulgării (acces restricționat, autentificare, stocare la furnizori
        cu standarde de securitate recunoscute).
      </LP>

      <LH2>10. Minori</LH2>
      <LP>
        Serviciile se adresează persoanelor cu vârsta de peste 18 ani. Nu colectăm cu bună știință date
        despre minori.
      </LP>

      <LH2>11. Modificări ale politicii</LH2>
      <LP>
        Putem actualiza această politică. Versiunea în vigoare este cea publicată pe această pagină, cu
        data ultimei actualizări indicată mai sus.
      </LP>

      <LP>
        Vezi și: <Link className="text-lime-600 underline-offset-2 hover:underline" href="/termeni-si-conditii">Termeni și condiții</Link> ·{" "}
        <Link className="text-lime-600 underline-offset-2 hover:underline" href="/politica-cookies">Politica de cookie-uri</Link>.
      </LP>
    </LegalDoc>
  );
}
