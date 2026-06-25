import Link from "next/link";
import { btnPrimary, btnOutline } from "@/components/ui";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="bg-mesh-light grid min-h-[70vh] place-items-center px-4">
      <div className="text-center">
        <p className="font-heading text-7xl font-bold text-lime-500">404</p>
        <h1 className="mt-4 font-heading text-2xl font-bold text-navy-800">Pagina nu a fost găsită</h1>
        <p className="mt-2 text-navy-500">Linkul pe care l-ai accesat nu există sau a fost mutat.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className={btnPrimary}>Acasă <ArrowRight className="h-4 w-4" /></Link>
          <Link href="/produse" className={btnOutline}>Vezi serviciile</Link>
        </div>
      </div>
    </section>
  );
}
