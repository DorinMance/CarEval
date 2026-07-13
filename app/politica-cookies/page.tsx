import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/lib/products";
import { LegalDoc, LH2, LP, LUl, B } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Politica de cookie-uri",
  description:
    "Ce cookie-uri folosește site-ul CarEval, în ce scop și cum îți poți gestiona preferințele.",
};

export default function PoliticaCookiesPage() {
  return (
    <LegalDoc
      title="Politica de cookie-uri"
      subtitle="Ce sunt cookie-urile, ce folosim și cum îți controlezi preferințele."
      updated="iulie 2026"
    >
      <LH2>1. Ce sunt cookie-urile</LH2>
      <LP>
        Cookie-urile sunt fișiere text de mici dimensiuni salvate în browserul tău atunci când vizitezi
        un site. Ele ajută site-ul să funcționeze, să rețină preferințe și să genereze statistici de
        utilizare. Folosim și tehnologii similare (ex. stocare locală în browser).
      </LP>

      <LH2>2. Ce cookie-uri folosim</LH2>
      <LP><B>Strict necesare</B> (nu pot fi dezactivate — fac site-ul să funcționeze):</LP>
      <LUl>
        <li>reținerea coșului tău și a pașilor din formular (stocare locală în browser);</li>
        <li>reținerea opțiunii tale privind cookie-urile (bannerul de consimțământ).</li>
      </LUl>
      <LP><B>De analiză</B> (opționale — se activează doar cu acordul tău):</LP>
      <LUl>
        <li><B>Google Analytics</B> (ex. <span className="font-mono text-[13px]">_ga</span>, <span className="font-mono text-[13px]">_ga_*</span>) — ne ajută să înțelegem, în mod agregat și anonim, cum este folosit site-ul, ca să îl îmbunătățim.</li>
      </LUl>
      <LP>
        Nu folosim cookie-uri de publicitate și nu vindem date către terți. Cookie-urile de analiză se
        încarcă doar dacă apeși „Accept” în bannerul afișat la prima vizită.
      </LP>

      <LH2>3. Consimțământ și gestionarea preferințelor</LH2>
      <LP>
        La prima vizită îți afișăm un banner prin care poți <B>accepta</B> sau <B>refuza</B> cookie-urile
        de analiză. Îți poți schimba oricând opțiunea ștergând cookie-urile din browser (ceea ce reafișează
        bannerul) sau blocând/ștergând cookie-urile direct din setările browserului:
      </LP>
      <LUl>
        <li>Google Chrome, Mozilla Firefox, Microsoft Edge, Safari — din meniul „Setări → Confidențialitate / Cookie-uri”.</li>
      </LUl>
      <LP>
        Dezactivarea cookie-urilor strict necesare poate afecta funcționarea corectă a site-ului (ex.
        coșul sau formularul).
      </LP>

      <LH2>4. Temeiul legal</LH2>
      <LP>
        Folosirea cookie-urilor se face conform Regulamentului (UE) 2016/679 (GDPR) și a Legii nr.
        506/2004. Cookie-urile de analiză se bazează pe consimțământul tău, pe care îl poți retrage oricând.
      </LP>

      <LH2>5. Mai multe informații</LH2>
      <LP>
        Pentru detalii despre prelucrarea datelor, vezi{" "}
        <Link className="text-lime-600 underline-offset-2 hover:underline" href="/politica-confidentialitate">Politica de confidențialitate</Link>.
        Pentru întrebări, scrie-ne la <a className="text-lime-600 underline-offset-2 hover:underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
      </LP>
    </LegalDoc>
  );
}
