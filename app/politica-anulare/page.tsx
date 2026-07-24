import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/lib/products";
import { LegalDoc, LH2, LP, LUl, B } from "@/components/LegalDoc";

export const metadata: Metadata = {
  alternates: { canonical: "/politica-anulare" },
  title: "Politica de anulare și retragere",
  description:
    "Cum anulezi o comandă, cum îți exerciți dreptul de retragere în 14 zile conform OUG 34/2014 și în cât timp primești banii înapoi.",
};

export default function PoliticaAnularePage() {
  return (
    <LegalDoc
      title="Politica de anulare și retragere"
      subtitle="Cum anulezi o comandă, ce drepturi ai și cum se face restituirea."
      updated="iulie 2026"
    >
      <LH2>1. Anularea înainte de începerea lucrării</LH2>
      <LP>
        Poți anula oricând o comandă <B>înainte</B> ca lucrarea să înceapă, fără nicio
        justificare și fără costuri. Suma achitată se restituie integral.
      </LP>
      <LP>
        Cea mai simplă cale este{" "}
        <Link href="/contact" className="font-medium text-lime-700 underline underline-offset-2">
          formularul de contact
        </Link>
        , alegând motivul „Retragere din contract / anulare comandă". Poți suna și la{" "}
        <a href={COMPANY.phoneHref} className="font-medium text-lime-700 underline underline-offset-2">{COMPANY.phone}</a>.
      </LP>

      <LH2>2. Dreptul de retragere în 14 zile</LH2>
      <LP>
        Conform <B>OUG nr. 34/2014</B>, în calitate de consumator ai dreptul de a te retrage
        din contract în termen de <B>14 zile calendaristice</B>, fără a fi nevoit să justifici
        decizia și fără penalități.
      </LP>
      <LP>
        Termenul curge de la data încheierii contractului, adică de la confirmarea comenzii.
      </LP>

      <LH2>3. Excepția pentru servicii deja prestate</LH2>
      <LP>
        Serviciile noastre sunt <B>personalizate</B> și se execută la cererea expresă a clientului.
        Legea prevede că, dacă prestarea a început cu acordul tău explicit înainte de expirarea
        celor 14 zile:
      </LP>
      <LUl>
        <li>
          dacă serviciul a fost <B>executat integral</B>, dreptul de retragere se pierde, iar suma
          nu se mai restituie;
        </li>
        <li>
          dacă serviciul a fost <B>executat parțial</B>, se reține contravaloarea lucrărilor
          efectuate până la momentul retragerii, proporțional, iar diferența se restituie.
        </li>
      </LUl>
      <LP>
        La plasarea comenzii îți exprimi acordul ca lucrarea să înceapă imediat, tocmai pentru
        a putea respecta termenul de livrare de 24–48 de ore. Acest acord este condiția care
        activează excepția de mai sus.
      </LP>

      <LH2>4. Cum îți exerciți dreptul de retragere</LH2>
      <LP>
        Ne transmiți o cerere neechivocă, prin oricare dintre căile de mai jos. Nu este nevoie
        de un formular tipizat.
      </LP>
      <LUl>
        <li>
          <B>Online:</B>{" "}
          <Link href="/contact" className="font-medium text-lime-700 underline underline-offset-2">
            pagina de contact
          </Link>
          , motivul „Retragere din contract / anulare comandă". Cererea se înregistrează pe loc.
        </li>
        <li><B>Email:</B> {COMPANY.email}</li>
        <li><B>Telefon:</B> {COMPANY.phone}, {COMPANY.hours}</li>
        <li><B>Poștă:</B> {COMPANY.addressFull}</li>
      </LUl>
      <LP>
        Menționează numărul comenzii (de forma <B>CE-…</B>, îl găsești în emailul de confirmare),
        numele și datele de contact. Confirmăm primirea cererii în cel mult 24 de ore lucrătoare.
      </LP>

      <LH2>5. Restituirea sumelor</LH2>
      <LP>
        Restituim suma cuvenită în cel mult <B>14 zile</B> de la data la care am fost informați
        despre decizia ta, folosind <B>aceeași metodă de plată</B> pe care ai folosit-o la comandă.
        Pentru plățile cu cardul, suma revine pe cardul folosit; nu percepem comisioane pentru
        restituire.
      </LP>
      <LP>
        Intervalul în care banii apar efectiv în cont depinde de banca emitentă și poate fi de
        câteva zile lucrătoare după procesarea restituirii de către noi.
      </LP>

      <LH2>6. Anularea din partea noastră</LH2>
      <LP>
        În situații excepționale putem anula o comandă: date insuficiente sau contradictorii,
        fotografii care nu permit o evaluare corectă, sau un caz care nu se încadrează în
        serviciul ales. În toate aceste cazuri te anunțăm, îți explicăm motivul și{" "}
        <B>restituim integral</B> suma achitată.
      </LP>

      <LH2>7. Reclamații și soluționarea litigiilor</LH2>
      <LP>
        Dacă nu ești mulțumit, scrie-ne întâi nouă — majoritatea situațiilor se rezolvă direct.
        Ai de asemenea dreptul de a te adresa <B>ANPC</B> (Autoritatea Națională pentru Protecția
        Consumatorilor), inclusiv procedurii de soluționare alternativă a litigiilor (SAL),
        disponibilă la{" "}
        <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer" className="font-medium text-lime-700 underline underline-offset-2">
          anpc.ro/ce-este-sal
        </a>.
      </LP>

      <LH2>8. Date de contact</LH2>
      <LP>
        {COMPANY.legal}, CUI {COMPANY.cui}, {COMPANY.regCom}, {COMPANY.addressFull}.
        Telefon {COMPANY.phone}, email {COMPANY.email}.
      </LP>
    </LegalDoc>
  );
}
