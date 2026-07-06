import Link from "next/link";
import Image from "next/image";

/* Logo original CarEval — fișierul real (public/images/careval-logo.webp). */

export function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="CarEval — acasă" className={`inline-flex items-center ${className}`}>
      <span className={light ? "grid place-items-center rounded-xl bg-white p-1.5" : ""}>
        <Image
          src="/images/careval-logo.webp"
          alt="CarEval"
          width={100}
          height={100}
          priority
          className="h-[72px] w-[72px] object-contain"
        />
      </span>
    </Link>
  );
}
