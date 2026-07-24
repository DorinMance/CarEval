import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Section, Eyebrow } from "@/components/ui";
import { ContactWizard } from "@/components/ContactWizard";
import { COMPANY } from "@/lib/products";
import { Phone, Mail, MapPin, Clock } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Scrie-ne sau sună-ne. Răspundem în 24 de ore lucrătoare. Tot de aici poți cere anularea unei comenzi sau retragerea din contract.",
  alternates: { canonical: "/contact" },
};

const dateFirma = [
  { icon: <Phone className="h-4 w-4" />, eticheta: "Telefon", val: COMPANY.phone, href: COMPANY.phoneHref },
  { icon: <Mail className="h-4 w-4" />, eticheta: "Email", val: COMPANY.email, href: `mailto:${COMPANY.email}` },
  { icon: <MapPin className="h-4 w-4" />, eticheta: "Sediu", val: COMPANY.addressFull },
  { icon: <Clock className="h-4 w-4" />, eticheta: "Program", val: COMPANY.hours },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Stăm de vorbă <span className="text-gradient-lime">fără formulare lungi</span></>}
        subtitle="Spune-ne în câțiva pași cu ce te putem ajuta. Îți răspundem în cel mult 24 de ore lucrătoare."
      />

      <Section className="bg-white">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
          <Reveal>
            <ContactWizard />
          </Reveal>

          <Reveal className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-mist bg-cloud p-6">
              <Eyebrow>Date de contact</Eyebrow>
              <p className="mt-3 font-heading text-lg font-bold text-navy-800">{COMPANY.legal}</p>
              <p className="text-sm text-navy-500">CUI {COMPANY.cui} · {COMPANY.regCom}</p>

              <ul className="mt-5 space-y-4">
                {dateFirma.map((d) => (
                  <li key={d.eticheta} className="flex gap-3">
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface text-lime-300">
                      {d.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">{d.eticheta}</p>
                      {d.href ? (
                        <a href={d.href} className="text-sm font-medium text-navy-800 hover:text-lime-700">{d.val}</a>
                      ) : (
                        <p className="text-sm font-medium text-navy-800">{d.val}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
