import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/lib/products";
import { LegalDoc, LH2, LP, LUl, B } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Termeni și condiții",
  description:
    "Termenii și condițiile de utilizare a site-ului careval.ro și de prestare a serviciilor SC VAST Expertise SRL.",
};

export default function TermeniPage() {
  return (
    <LegalDoc
      title="Termeni și condiții"
      subtitle="Condițiile de utilizare a site-ului și de prestare a serviciilor CarEval."
      updated="iulie 2026"
    >
      <LH2>1. Cine suntem</LH2>
      <LP>
        Site-ul careval.ro este operat de <B>{COMPANY.legal}</B> (marca <B>{COMPANY.name}</B>), CUI {COMPANY.cui},
        Nr. Reg. Com. {COMPANY.regCom}, cu sediul în {COMPANY.addressFull}, reprezentată prin {COMPANY.rep}.
        Contact: <a className="text-lime-600 underline-offset-2 hover:underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>, <a className="text-lime-600 underline-offset-2 hover:underline" href={COMPANY.phoneHref}>{COMPANY.phone}</a>.
      </LP>
      <LP>
        Prin utilizarea site-ului și plasarea unei cereri, ești de acord cu acești termeni. Dacă nu ești
        de acord, te rugăm să nu folosești site-ul.
      </LP>

      <LH2>2. Serviciile oferite</LH2>
      <LP>
        CarEval oferă <B>rapoarte de evaluare auto și expertize tehnice extrajudiciare</B> în domeniul
        auto (evaluarea prejudiciului, costuri de reparație, valoare la data accidentului, evaluare epavă,
        devalorizare, contraexpertiză, consultanță). Rapoartele sunt întocmite folosind sistemele de
        specialitate AUDATEX și DAT și sunt semnate de un expert tehnic autorizat de Ministerul Justiției.
      </LP>
      <LP>
        O expertiză tehnică <B>extrajudiciară</B> este un înscris tehnic solicitat de o parte interesată.
        Ea devine expertiză <B>judiciară</B> doar atunci când o instanță dispune efectuarea unei expertize
        și numește expertul în cauza respectivă; aceasta nu poate fi comandată online.
      </LP>

      <LH2>3. Comandarea serviciului</LH2>
      <LUl>
        <li>Alegi serviciul potrivit și completezi formularul pas cu pas (datele vehiculului, ale evenimentului și fotografiile relevante).</li>
        <li>Adaugi serviciul în coș și trimiți cererea. Vei fi contactat de un reprezentant pentru confirmarea detaliilor și a modalității de plată.</li>
        <li>Contractul se consideră încheiat în momentul confirmării comenzii de către noi.</li>
      </LUl>
      <LP>
        Evaluarea se realizează <B>pe baza documentelor și fotografiilor furnizate de tine</B>. Ești
        responsabil pentru corectitudinea și completitudinea informațiilor transmise.
      </LP>

      <LH2>4. Prețuri și plată</LH2>
      <LP>
        Prețurile sunt afișate pe fiecare pagină de serviciu, exprimate în lei (RON). Factura se emite
        conform legislației fiscale în vigoare. <B>Onorariul este fix, comunicat înainte de începerea
        lucrării și nu depinde de rezultatul obținut.</B>
      </LP>

      <LH2>5. Livrarea raportului</LH2>
      <LP>
        Raportul se livrează în format electronic (PDF), pe email, în mod uzual în <B>24–48 de ore</B> de
        la confirmarea comenzii și primirea tuturor informațiilor necesare. Când un caz necesită inspecție
        fizică ce nu poate fi realizată online, te informăm din start.
      </LP>

      <LH2>6. Natura raportului și limitări</LH2>
      <LUl>
        <li>Raportul stabilește <B>valori tehnice</B>, calculate și documentate; nu garantează obținerea unei anumite sume și nu reprezintă consultanță juridică.</li>
        <li>Nu negociem în numele tău și nu te reprezentăm juridic în fața niciunei părți.</li>
        <li>Concluziile se bazează pe informațiile și materialele puse la dispoziție de client; informații incomplete sau inexacte pot afecta rezultatul.</li>
      </LUl>

      <LH2>7. Dreptul de retragere (consumatori)</LH2>
      <LP>
        Conform OUG 34/2014, consumatorul are, în principiu, un drept de retragere de <B>14 zile</B> de la
        încheierea contractului la distanță. Întrucât serviciul constă într-un raport personalizat,
        realizat la cererea ta, dacă soliciți în mod expres începerea prestării înainte de expirarea
        termenului de 14 zile, <B>iei la cunoștință că îți pierzi dreptul de retragere</B> odată ce
        serviciul a fost prestat integral. Pentru serviciile neîncepute, îți poți exercita dreptul de
        retragere printr-o cerere la <a className="text-lime-600 underline-offset-2 hover:underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
      </LP>

      <LH2>8. Obligațiile utilizatorului</LH2>
      <LUl>
        <li>Să furnizeze date reale, complete și fotografii clare.</li>
        <li>Să nu folosească site-ul în scopuri ilegale sau frauduloase.</li>
        <li>Să nu încarce conținut care încalcă drepturile altor persoane.</li>
      </LUl>

      <LH2>9. Proprietate intelectuală</LH2>
      <LP>
        Conținutul site-ului (texte, logo, grafică, structură) aparține {COMPANY.legal} și este protejat
        de lege. Raportul livrat poate fi folosit de client în scopul pentru care a fost întocmit
        (discuția cu asigurătorul, procedura SAL sau ca înscris în instanță), fără a fi modificat.
      </LP>

      <LH2>10. Răspundere</LH2>
      <LP>
        Ne asumăm răspunderea pentru corectitudinea tehnică a raportului în raport cu datele furnizate. Nu
        răspundem pentru deciziile luate de terți (asigurători, instanțe) și nici pentru consecințele
        folosirii raportului în alt scop decât cel pentru care a fost întocmit. Răspunderea noastră este
        limitată, în orice caz, la valoarea onorariului încasat pentru serviciul respectiv.
      </LP>

      <LH2>11. Protecția datelor</LH2>
      <LP>
        Prelucrarea datelor cu caracter personal este descrisă în{" "}
        <Link className="text-lime-600 underline-offset-2 hover:underline" href="/politica-confidentialitate">Politica de confidențialitate</Link>. Utilizarea cookie-urilor este descrisă în{" "}
        <Link className="text-lime-600 underline-offset-2 hover:underline" href="/politica-cookies">Politica de cookie-uri</Link>.
      </LP>

      <LH2>12. Soluționarea litigiilor · ANPC / SOL</LH2>
      <LP>
        Orice litigiu se soluționează pe cale amiabilă. Consumatorii se pot adresa Autorității Naționale
        pentru Protecția Consumatorilor (ANPC) — <a className="text-lime-600 underline-offset-2 hover:underline" href="https://anpc.ro" target="_blank" rel="noopener noreferrer">anpc.ro</a> — sau pot folosi platforma europeană de
        Soluționare Online a Litigiilor (SOL): <a className="text-lime-600 underline-offset-2 hover:underline" href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>.
        Prezentul contract este guvernat de legea română, iar instanțele competente sunt cele de la sediul
        prestatorului, în lipsa unei prevederi legale imperative contrare.
      </LP>

      <LH2>13. Modificări</LH2>
      <LP>
        Ne rezervăm dreptul de a actualiza acești termeni. Versiunea aplicabilă este cea publicată pe
        această pagină la data plasării cererii.
      </LP>
    </LegalDoc>
  );
}
