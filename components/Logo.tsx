import Link from "next/link";

export function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="CarEval — acasă" className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect width="48" height="48" rx="12" fill={light ? "rgba(255,255,255,0.08)" : "#0b1930"} />
        <path
          d="M33 17.5A10.5 10.5 0 1 0 33 30.5"
          stroke="#8fd02f"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <path d="M20 24h13" stroke="#8fd02f" strokeWidth="3.4" strokeLinecap="round" />
      </svg>
      <span className={`font-heading text-xl font-bold tracking-tight ${light ? "text-white" : "text-navy-800"}`}>
        Car<span className="text-lime-500">Eval</span>
      </span>
    </Link>
  );
}
