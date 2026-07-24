"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { products, COMPANY } from "@/lib/products";
import { PaymentLogos } from "./PaymentLogos";
import { Phone, Mail, MapPin, Clock, Lock } from "./icons";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-navy-gradient text-navy-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <Logo light />
          <p className="mt-4 max-w-xs text-sm text-navy-200">
            Evaluări auto și expertize tehnice în caz de accident, semnate de expert autorizat
            de Ministerul Justiției. Fără deplasare, livrare în 24–48h.
          </p>
          <p className="mt-4 text-xs text-navy-200">{COMPANY.legal}</p>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
            Servicii
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={`/produs/${p.slug}`} className="text-navy-200 transition-colors hover:text-lime-300">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
            Companie
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/cum-functioneaza" className="text-navy-200 hover:text-lime-300">Cum funcționează</Link></li>
            <li><Link href="/model-raport" className="text-navy-200 hover:text-lime-300">Model raport</Link></li>
            <li><Link href="/despre-noi" className="text-navy-200 hover:text-lime-300">Despre noi</Link></li>
            <li><Link href="/independenta" className="text-navy-200 hover:text-lime-300">Independență</Link></li>
            <li><Link href="/companii" className="text-navy-200 hover:text-lime-300">Pentru companii</Link></li>
            <li><Link href="/blog" className="text-navy-200 hover:text-lime-300">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li><a href={COMPANY.phoneHref} className="flex items-center gap-2 text-navy-200 hover:text-lime-300"><Phone className="h-4 w-4 text-lime-400" /> {COMPANY.phone}</a></li>
            <li><a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 text-navy-200 hover:text-lime-300"><Mail className="h-4 w-4 text-lime-400" /> {COMPANY.email}</a></li>
            <li className="flex items-start gap-2 text-navy-200"><MapPin className="mt-0.5 h-4 w-4 text-lime-400" /> {COMPANY.address}</li>
            <li className="flex items-center gap-2 text-navy-200"><Clock className="h-4 w-4 text-lime-400" /> {COMPANY.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* inline-flex + min-h-11 = 44px țintă de atingere, fără a schimba aspectul */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 text-xs text-navy-200 sm:justify-start">
            {[
              ["/termeni-si-conditii", "Termeni și condiții"],
              ["/politica-confidentialitate", "Politica de confidențialitate"],
              ["/politica-cookies", "Politica de cookie-uri"],
              ["/politica-livrare", "Politica de livrare"],
              ["/politica-anulare", "Anulare și retragere"],
              ["/contact", "Contact"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="inline-flex min-h-11 items-center hover:text-lime-300">{label}</Link>
            ))}
            {/* ANPC cere informarea privind soluționarea alternativă a litigiilor (SAL). */}
            <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:text-lime-300">ANPC — SAL</a>
          </div>

          <PaymentLogos className="mt-5 border-t border-white/10 pt-5" />
          <div className="mt-4 flex flex-col gap-3 text-xs text-navy-200 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {COMPANY.name} · {COMPANY.legal} · CUI {COMPANY.cui} · {COMPANY.regCom}</p>
            <div className="flex items-center gap-4">
              <p>Expertize tehnice auto autorizate · livrare 24–48h</p>
              <Link
                href="/admin"
                aria-label="Autentificare administrator"
                title="Acces administrator"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-navy-200 transition-colors hover:border-lime-400/40 hover:text-lime-300"
              >
                <Lock className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Semnătura autorului site-ului, ultimul rând din pagină. */}
          <div className="mt-4 border-t border-white/10 pt-4 text-center">
            <a
              href="https://novaprimedigital.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-xs text-navy-200 transition-colors hover:text-lime-300"
            >
              Made by <span className="ml-1 font-semibold">NovaPrime Digital</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
