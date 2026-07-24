"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";
import { COMPANY } from "@/lib/products";
import { Cart, Menu, X, Phone } from "./icons";

const NAV = [
  { href: "/produse", label: "Produse" },
  { href: "/cum-functioneaza", label: "Cum funcționează" },
  { href: "/model-raport", label: "Model raport" },
  { href: "/despre-noi", label: "Despre noi" },
  { href: "/independenta", label: "Independență" },
  { href: "/companii", label: "Companii" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { count } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Blochează scroll-ul paginii din fundal cât timp meniul mobil e deschis
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Adminul are propria bară — nu afișa header-ul site-ului acolo
  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-[0_1px_0_rgba(11,25,48,0.08)]"
          : "bg-white"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-[15px] font-medium transition-colors ${
                  active ? "text-lime-600" : "text-navy-700 hover:text-navy-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={COMPANY.phoneHref}
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-navy-700 transition-colors hover:text-lime-600 md:flex"
          >
            <Phone className="h-4 w-4" />
            {COMPANY.phone}
          </a>

          <Link
            href="/cos"
            aria-label="Coșul meu"
            className="relative grid h-11 w-11 place-items-center rounded-lg text-navy-700 transition-colors hover:bg-cloud"
          >
            <Cart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-lime-500 px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label={open ? "Închide meniul" : "Deschide meniul"}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-lg text-navy-700 hover:bg-cloud lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu — overlay full-page, cu blocare scroll fundal */}
      {open && (
        <div className="fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto overscroll-contain bg-white lg:hidden">
          <nav className="flex flex-col gap-1 px-4 py-6 sm:px-6">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-4 py-4 text-lg font-semibold transition-colors ${
                    active ? "bg-lime-50 text-lime-700" : "text-navy-800 hover:bg-cloud"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href={COMPANY.phoneHref}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-surface px-4 py-4 text-base font-semibold text-white"
            >
              <Phone className="h-4 w-4" /> {COMPANY.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
