import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/lib/products";
import { LegalDoc, LH2, LP, LUl, B } from "@/components/LegalDoc";

export const metadata: Metadata = {
  alternates: { canonical: "/politica-livrare" },
  title: "Politica de livrare",
  description:
    "Cum și în cât timp livrăm rapoartele de evaluare și expertizele tehnice auto: format electronic, termene, ce se întâmplă dacă lipsesc date.",
};

export default function PoliticaLivrarePage() {
  return (
    <LegalDoc
      title="Politica de livrare"
      subtitle="Ce livrăm, în ce format și în cât timp."
      updated="iulie 2026"
    >
      <LH2>1. Ce livrăm</LH2>
      <LP>
        {COMPANY.legal} (marca <B>{COMPANY.name}</B>) prestează <B>servicii</B>, nu vinde bunuri
        fizice. Rezultatul fiecărei comenzi este un <B>document electronic</B>: un raport de
        evaluare sau o expertiză tehnică auto, în format PDF, semnat de expert tehnic judiciar
        autorizat de Ministerul Justiției.
      </LP>
      <LP>
        Nu există transport, curierat sau costuri de livrare. Prin urmare, nu percepem taxe
        de livrare.
      </LP>

      <LH2>2. Cum se face livrarea</LH2>
      <LP>
        Raportul se transmite <B>prin email</B>, la adresa indicată de client în formularul de
        comandă. Recomandăm verificarea adresei înainte de trimiterea comenzii, precum și a
        folderului „Spam" în cazul în care documentul nu apare în Inbox.
      </LP>
      <LP>
        La cerere, raportul poate fi livrat și în <B>format tipărit</B>, prin poștă sau curier,
        contra unui cost suplimentar comunicat în prealabil. Această opțiune se solicită la
        momentul comenzii sau ulterior, prin{" "}
        <Link href="/contact" className="font-medium text-lime-700 underline underline-offset-2">
          pagina de contact
        </Link>.
      </LP>

      <LH2>3. Termene de livrare</LH2>
      <LUl>
        <li>
          <B>24–48 de ore lucrătoare</B> pentru majoritatea rapoartelor, calculate din momentul
          în care am primit <B>toate</B> datele și fotografiile necesare, iar plata a fost
          confirmată.
        </li>
        <li>
          Pentru lucrări complexe (dosare voluminoase, contraexpertize, cazuri aflate în
          instanță) termenul poate fi mai lung. În acest caz îl comunicăm în scris, înainte de
          începerea lucrării.
        </li>
        <li>
          Termenul se suspendă dacă lipsesc informații esențiale sau dacă fotografiile primite
          nu permit o evaluare corectă. Te contactăm și reluăm calculul din momentul completării
          dosarului.
        </li>
      </LUl>

      <LH2>4. Confirmarea comenzii</LH2>
      <LP>
        După plasarea comenzii primești o confirmare pe email. În cazul plății online cu cardul,
        primești suplimentar confirmarea tranzacției de la procesatorul de plăți NETOPIA Payments,
        precum și <B>factura fiscală</B>, emisă și transmisă electronic.
      </LP>

      <LH2>5. Dacă nu ai primit raportul</LH2>
      <LP>
        Dacă termenul comunicat a expirat și nu ai primit documentul, contactează-ne la{" "}
        <a href={COMPANY.phoneHref} className="font-medium text-lime-700 underline underline-offset-2">{COMPANY.phone}</a>{" "}
        sau la{" "}
        <a href={`mailto:${COMPANY.email}`} className="font-medium text-lime-700 underline underline-offset-2">{COMPANY.email}</a>.
        Retrimitem documentul fără costuri suplimentare.
      </LP>
      <LP>
        Pentru anularea comenzii sau retragerea din contract, vezi{" "}
        <Link href="/politica-anulare" className="font-medium text-lime-700 underline underline-offset-2">
          politica de anulare și retragere
        </Link>.
      </LP>

      <LH2>6. Date de contact</LH2>
      <LP>
        {COMPANY.legal}, CUI {COMPANY.cui}, {COMPANY.regCom}, {COMPANY.addressFull}.
        Telefon {COMPANY.phone}, email {COMPANY.email}. Program: {COMPANY.hours}.
      </LP>
    </LegalDoc>
  );
}
