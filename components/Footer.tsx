import Link from "next/link";
import { Logo } from "./Logo";
import { products, COMPANY } from "@/lib/products";
import { Phone, Mail, MapPin, Clock } from "./icons";

export function Footer() {
  return (
    <footer className="bg-navy-gradient text-navy-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <Logo light />
          <p className="mt-4 max-w-xs text-sm text-navy-200">
            Evaluări auto și expertize tehnice în caz de accident, autorizate de expert tehnic
            judiciar. Fără deplasare, livrare în 24–48h.
          </p>
          <p className="mt-4 text-xs text-navy-300">{COMPANY.legal}</p>
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
            <li><Link href="/companii" className="text-navy-200 hover:text-lime-300">Pentru companii</Link></li>
            <li><Link href="/blog" className="text-navy-200 hover:text-lime-300">Blog</Link></li>
            <li><Link href="/admin" className="text-navy-300 hover:text-lime-300">Panou admin (demo)</Link></li>
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
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-navy-300 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {COMPANY.name} · {COMPANY.legal}. Toate drepturile rezervate.</p>
          <p>Demo realizat în Next.js · datele de admin sunt simulate local.</p>
        </div>
      </div>
    </footer>
  );
}
