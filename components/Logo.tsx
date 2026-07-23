import Link from "next/link";
import Image from "next/image";

/* Logo original CarEval — fișierul real (public/images/careval-logo.webp). */

export function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="CarEval — acasă" className={`inline-flex items-center ${className}`}>
      <Image
        // Fundal deschis (header) -> varianta în albastrul de brand #283E64.
        // Fundal închis (footer)  -> varianta albă, ca să nu fie nevoie de casetă albă.
        // REVENIRE la logo-ul vechi: schimbă "careval-logo-brand.png" -> "careval-logo.webp"
        // (originalul navy #14144D e păstrat neatins în public/images/).
        src={light ? "/images/careval-logo-light.png" : "/images/careval-logo-brand.png"}
        alt="CarEval"
        width={100}
        height={100}
        priority
        className="h-[72px] w-[72px] object-contain"
      />
    </Link>
  );
}
