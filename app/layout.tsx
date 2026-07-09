import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { COMPANY } from "@/lib/products";

// Google Analytics 4 — ID public (vizibil oricum în HTML). Din env, cu fallback.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-MXMQZ04NEB";
const GA_ENABLED = process.env.NODE_ENV === "production" && Boolean(GA_ID);

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "CarEval",
  legalName: COMPANY.legal,
  description:
    "Expertize tehnice auto și evaluări în caz de accident, autorizate de expert tehnic judiciar. 100% online, livrare în 24–48h.",
  url: "https://careval.ro",
  telephone: COMPANY.phone,
  email: COMPANY.email,
  priceRange: "320–1200 Lei",
  areaServed: { "@type": "Country", name: "România" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Str. Lămîiței 4, ap. 12",
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

export const metadata: Metadata = {
  title: {
    default: "CarEval — Evaluări auto & expertize în caz de accident",
    template: "%s · CarEval",
  },
  description:
    "Rapoarte de evaluare auto și expertize tehnice în caz de accident, autorizate de expert tehnic judiciar. Fără deplasare, livrare în 24–48h. Obține despăgubirea corectă.",
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
        {GA_ENABLED && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script
              id="ga4-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
              }}
            />
          </>
        )}
        <ScrollProgress />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
