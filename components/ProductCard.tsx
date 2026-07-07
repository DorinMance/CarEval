import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { PriceTag } from "./ui";
import { ArrowRight, Check, Clock } from "./icons";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <Link
      href={`/produs/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-mist bg-white shadow-[0_2px_8px_rgba(11,25,48,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-lime-200 hover:shadow-[0_24px_50px_-24px_rgba(11,25,48,0.4)]"
    >
      {product.popular && (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-lime-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-navy-900">
          Popular
        </span>
      )}

      <div className="relative aspect-square overflow-hidden bg-white">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-navy-400">
          <span className="rounded-md bg-cloud px-2 py-0.5">{product.category}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {product.delivery}</span>
        </div>

        <h3 className="font-heading text-lg font-semibold leading-snug text-navy-800">
          {product.name}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-navy-500">{product.tagline}</p>

        <ul className="mt-4 space-y-1.5">
          {product.benefits.slice(0, 2).map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-navy-600">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime-500" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-between border-t border-mist pt-4">
          <div>
            <span className="block text-[11px] uppercase tracking-wide text-navy-400">
              {product.price == null ? "Tarif" : "de la"}
            </span>
            <PriceTag price={product.price} note={product.priceNote} className="text-xl font-bold" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-lime-500 group-hover:text-navy-900">
            Comandă
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
