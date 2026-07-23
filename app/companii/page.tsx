import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { FloatIcon } from "@/components/FloatIcon";
import { Section, Eyebrow, btnPrimary, btnOutline } from "@/components/ui";
import { COMPANY } from "@/lib/products";
import { Building, FileText, Clock, Shield, Users, Award, ArrowRight, Check } from "@/components/icons";

export const metadata: Metadata = {
  alternates: { canonical: "/companii" },
  title: "Pentru companii",
  description: "Soluții de evaluare auto pentru flote, leasing, service-uri și firme de asigurări: volume, facturare lunară și expert dedicat.",
};

const audience = [
  { icon: <Building className="h-7 w-7" />, t: "Flote & leasing", d: "Expertize tehnice și devize de reparație pentru accidente, daune și constatări din parcul auto." },
  { icon: <Shield className="h-7 w-7" />, t: "Asigurători, brokeri și reasigurători", d: "Expertize tehnice independente pentru constatări, daune totale, analiza compatibilității avariilor și dosare cu suspiciune de fraudă. Aceeași echipă și același standard tehnic ca în expertiza judiciară." },
  { icon: <Users className="h-7 w-7" />, t: "Service-uri & dealeri", d: "Devize de reparație și evaluări la schimb, livrate rapid, pentru clienții voștri." },
];

const benefits = [
  { icon: <FileText className="h-6 w-6" />, t: "Facturare lunară", d: "Un singur cont, raportare consolidată." },
  { icon: <Clock className="h-6 w-6" />, t: "Prioritate la livrare", d: "Timpi de răspuns dedicați pentru volume." },
  { icon: <Award className="h-6 w-6" />, t: "Expert dedicat", d: "Un punct de contact care îți cunoaște nevoile." },
  { icon: <Shield className="h-6 w-6" />, t: "Rapoarte autorizate", d: "Aceeași autoritate tehnică, la scară." },
];

export default function CompaniiPage() {
  return (
    <>
      <PageHero
        eyebrow="Pentru companii"
        title={<>Evaluări auto la <span className="text-gradient-lime">scară de business</span></>}
        subtitle="Construim un flux de lucru pe nevoile companiei tale — volume, integrare și prețuri pe măsură."
      />

      <Section className="bg-white">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>Pentru cine</Eyebrow>
            <h2 className="mt-4 font-heading text-3xl font-bold text-navy-800 lg:text-4xl">
              Partener pentru orice business cu mașini
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-navy-500">
              De la o flotă de livrare la un parc auto extins — expertizăm rapid și documentat orice
              eveniment din flota ta. Expertize tehnice și devize de reparație pentru accidente, daune
              și constatări din parcul auto.
            </p>
          </Reveal>
          {/* fleet-cut.png — 3D floating fleet */}
          <Reveal>
            <div className="relative mx-auto max-w-[460px]">
              <div className="absolute bottom-[12%] left-1/2 h-16 w-[70%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(143,208,47,0.18)_0%,transparent_70%)] blur-xl" />
              <Image
                src="/images/generated/fleet-cut.png"
                alt="Flotă de vehicule de business — van și SUV"
                width={920}
                height={547}
                className="relative h-auto w-full object-contain"
                style={{ filter: "drop-shadow(0 26px 40px rgba(11,25,48,0.28))" }}
              />
            </div>
          </Reveal>
        </div>
        <Reveal stagger className="mt-14 grid gap-6 md:grid-cols-3">
          {audience.map((a) => (
            <div data-reveal key={a.t} className="rounded-2xl border border-mist bg-white p-7 shadow-[0_2px_12px_rgba(11,25,48,0.04)]">
              <FloatIcon>{a.icon}</FloatIcon>
              <h3 className="mt-5 font-heading text-xl font-semibold text-navy-800">{a.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">{a.d}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      <Section className="bg-white pt-0">
        <Reveal className="mx-auto max-w-3xl rounded-3xl bg-mesh-light p-8 sm:p-12">
          <Eyebrow>Independență</Eyebrow>
          <h2 className="mt-4 font-heading text-2xl font-bold text-navy-800 lg:text-3xl">
            Lucrăm pentru ambele părți
          </h2>
          <p className="mt-4 leading-relaxed text-navy-600">
            Realizăm expertize tehnice atât pentru persoane fizice, cât și pentru asigurători, flote,
            service-uri și instanțe. Metodologia, sistemele de calcul și standardul raportului sunt
            identice, indiferent de beneficiar.
          </p>
          <p className="mt-3 leading-relaxed text-navy-600">
            Onorariile sunt fixe și nu depind de rezultatul obținut. Nu garantăm sume și nu
            reprezentăm juridic nicio parte.
          </p>
        </Reveal>
      </Section>

      <Section className="bg-cloud pt-0">
        <Reveal stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div data-reveal key={b.t} className="rounded-2xl border border-mist bg-white p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-surface text-lime-300">{b.icon}</span>
              <h3 className="mt-4 font-heading text-lg font-semibold text-navy-800">{b.t}</h3>
              <p className="mt-1.5 text-sm text-navy-500">{b.d}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      <Section className="bg-white pt-0">
        <Reveal className="relative grid items-center gap-8 overflow-hidden rounded-3xl p-8 text-white sm:p-12 lg:grid-cols-2">
          <Image
            src="/images/generated/fleet.png"
            alt="Flotă de mașini de business"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(8,19,35,0.95)_0%,rgba(8,19,35,0.82)_50%,rgba(8,19,35,0.55)_100%)]" />
          <div className="relative z-10">
            <h2 className="font-heading text-3xl font-bold">Hai să discutăm despre volumul tău</h2>
            <p className="mt-3 text-navy-200">
              Spune-ne câte evaluări estimezi lunar și ce tip de servicii ai nevoie. Revenim cu o ofertă personalizată.
            </p>
            <ul className="mt-5 space-y-2">
              {["Ofertă în 24h", "Fără costuri de setup", "Contract flexibil"].map((c) => (
                <li key={c} className="flex items-center gap-2 text-navy-100"><Check className="h-4 w-4 text-lime-400" /> {c}</li>
              ))}
            </ul>
          </div>
          <div className="relative z-10 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
            <a href={COMPANY.phoneHref} className={btnPrimary}>Sună acum: {COMPANY.phone}</a>
            <a href={`mailto:${COMPANY.email}?subject=Solicitare%20ofertă%20companii`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Scrie-ne: {COMPANY.email}
            </a>
            <Link href="/produse" className="text-center text-sm text-navy-300 hover:text-lime-300">sau vezi serviciile individuale →</Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
