import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ClipboardList, ImagePlus, FileText, Shield, ArrowRight } from "@/components/icons";
import { Section, Eyebrow, btnPrimary } from "@/components/ui";

export const metadata: Metadata = {
  alternates: { canonical: "/cum-functioneaza" },
  title: "Cum funcționează",
  description: "În 3 pași simpli obții un raport de evaluare auto autorizat: alegi serviciul, completezi formularul cu poze, primești raportul în 24–48h.",
};

const steps = [
  { n: "01", Icon: ClipboardList, title: "Alege serviciul", text: "Selectezi tipul de evaluare sau expertiză potrivit situației tale. Dacă nu ești sigur, te ghidăm prin telefon sau consultanță." },
  { n: "02", Icon: ImagePlus, title: "Completezi formularul", text: "Un formular simplu, pas cu pas: datele mașinii (din talon) și câteva fotografii clare. Cu cât informația e mai completă, cu atât raportul e mai exact." },
  { n: "03", Icon: FileText, title: "Primești raportul", text: "Întocmim raportul în sistemele oficiale AUDATEX/DAT și ți-l trimitem pe email în format PDF autorizat, în 24–48h." },
];

const faqs: [string, string][] = [
  ["Cât durează?", "Majoritatea rapoartelor sunt livrate în 24–48h de la primirea datelor complete și a fotografiilor."],
  ["Trebuie să mă deplasez?", "Nu. Întregul proces este online — completezi formularul și încarci pozele de pe telefon."],
  ["Raportul are valoare oficială?", "Da. Este o expertiză tehnică extrajudiciară, semnată de un expert autorizat de Ministerul Justiției."],
  ["Ce fotografii sunt necesare?", "Poze clare din toate unghiurile relevante și cu zonele avariate. Te ghidăm exact în formular."],
  ["Cum plătesc?", "Comanda se finalizează online, cu plată prin card sau transfer bancar. Echipa confirmă comanda și revine cu raportul în termenul promis."],
];

export default function CumFunctioneazaPage() {
  return (
    <>
      <PageHero
        eyebrow="Cum funcționează"
        title={<>Trei pași până la <span className="text-lime-400">raportul tău</span></>}
        subtitle="Fără deplasări, fără birocrație. Procesul e gândit să fie simplu pentru oricine."
      />

      <Section className="bg-white">
        <Reveal stagger className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              data-reveal
              key={s.n}
              className="relative flex flex-col rounded-3xl border border-navy-100 bg-[#f8f9fc] p-8"
            >
              {i < steps.length - 1 && (
                <div className="absolute -right-3 top-16 hidden h-px w-6 bg-gradient-to-r from-lime-400 to-transparent md:block" />
              )}
              <div className="mb-6 flex items-center justify-between">
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white shadow-[0_2px_12px_rgba(11,25,48,0.06)]">
                  <s.Icon className="h-9 w-9 text-lime-500" />
                </div>
                <span className="font-heading text-5xl font-black text-navy-100">{s.n}</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-navy-800">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">{s.text}</p>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-10 flex items-center gap-3 rounded-2xl bg-mesh-light p-6">
          <Shield className="h-6 w-6 shrink-0 text-lime-600" />
          <p className="text-navy-600">
            <strong className="text-navy-800">Important:</strong> evaluarea se realizează pe baza
            documentelor și fotografiilor furnizate de beneficiar. Dacă omiți avarii din poze sau
            descriere, evaluarea poate fi inexactă. Completează cât mai detaliat pentru un rezultat corect.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-cloud">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Întrebări frecvente</Eyebrow>
          <h2 className="mt-4 font-heading text-3xl font-bold text-navy-800">Ce ar trebui să știi</h2>
        </Reveal>
        <Reveal>
          <FAQAccordion faqs={faqs} />
        </Reveal>
      </Section>

      <Section className="bg-white pt-0">
        <Reveal className="flex flex-col items-center gap-4 rounded-3xl bg-navy-gradient px-6 py-14 text-center text-white">
          <h2 className="font-heading text-3xl font-bold">Gata să începi?</h2>
          <p className="max-w-lg text-navy-200">Alege serviciul potrivit și completează formularul în câteva minute.</p>
          <Link href="/produse" className={btnPrimary}>Vezi serviciile <ArrowRight className="h-4 w-4" /></Link>
        </Reveal>
      </Section>
    </>
  );
}
