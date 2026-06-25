import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";

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
