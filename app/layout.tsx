import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { CookieConsent } from "@/components/CookieConsent";
import { COMPANY, products } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "CarEval",
  legalName: COMPANY.legal,
  description:
    "Expertize tehnice extrajudiciare auto și evaluări în caz de accident, semnate de expert autorizat de Ministerul Justiției. 100% online, livrare în 24–48h.",
  url: SITE_URL,
  telephone: COMPANY.phone,
  email: COMPANY.email,
  // Calculat din prețurile reale — altfel deviază tăcut la prima schimbare de tarif.
  priceRange: (() => {
    const p = products.map((x) => x.price).filter((x): x is number => x != null);
    return `${Math.min(...p)}–${Math.max(...p)} Lei`;
  })(),
  areaServed: { "@type": "Country", name: "România" },
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.address.split(",").slice(0, 2).join(",").trim(),
    addressLocality: "Giroc",
    addressRegion: "Timiș",
    addressCountry: "RO",
  },
  founder: {
    "@type": "Person",
    name: "Dr. Ing. Kulcsar Raul Miklos",
    jobTitle: "Expert Tehnic Judiciar (autorizat Ministerul Justiției)",
  },
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const DESCRIERE =
  "Rapoarte de evaluare auto și expertize tehnice extrajudiciare în caz de accident, semnate de expert autorizat de Ministerul Justiției. Fără deplasare, livrare în 24–48h.";

export const metadata: Metadata = {
  // Fără metadataBase, orice URL relativ din metadata (og:image, canonical) nu se rezolvă.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CarEval — Evaluări auto & expertize în caz de accident",
    template: "%s · CarEval",
  },
  // ATENȚIE: `alternates` NU se pune aici. Câmpurile de metadata se moștenesc,
  // deci un canonical "/" în layout ar face ca fiecare pagină care nu-l suprascrie
  // să se declare duplicat al homepage-ului. Canonical se pune per pagină.
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: "CarEval",
    url: "/",
    title: "CarEval — Evaluări auto & expertize în caz de accident",
    description: DESCRIERE,
    images: [{ url: "/images/og-careval.png", width: 1200, height: 630, alt: "CarEval — expertize tehnice auto autorizate" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CarEval — Evaluări auto & expertize în caz de accident",
    description: DESCRIERE,
    images: ["/images/og-careval.png"],
  },
  description:
    "Rapoarte de evaluare auto și expertize tehnice extrajudiciare în caz de accident, semnate de expert autorizat de Ministerul Justiției. Fără deplasare, livrare în 24–48h. Cifre calculate în AUDATEX și DAT.",
  keywords: [
    "evaluare auto", "expertiza auto", "evaluare in caz de accident",
    "despagubiri rca", "evaluare epava", "raport evaluare autovehicul", "CarEval",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <body className="min-h-dvh bg-white text-navy-800 antialiased">
        {/* Formular ascuns pentru DETECȚIA Netlify Forms (HTML static, la build).
            Submit-ul real se face către /__forms.html (fișier static din public/). */}
        <form name="comanda" data-netlify="true" netlify-honeypot="bot-field" hidden>
          <input type="text" name="nume" />
          <input type="text" name="telefon" />
          <input type="email" name="email" />
          <input type="text" name="localitate" />
          <input type="text" name="produse" />
          <input type="text" name="total" />
          <textarea name="detalii"></textarea>
          <textarea name="mesaj"></textarea>
          <input type="text" name="bot-field" />
        </form>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <ScrollProgress />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
