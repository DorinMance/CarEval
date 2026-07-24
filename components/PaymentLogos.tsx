/**
 * Siglele de plată din subsolul site-ului.
 *
 * NETOPIA cere explicit, în condițiile de eligibilitate, ca pe site să apară
 * „siglele Visa, Mastercard și NETOPIA Payments". Fără ele, punctul de vânzare
 * nu trece de validare.
 *
 * Sunt desenate ca SVG inline, nu imagini: rămân clare la orice rezoluție, nu
 * adaugă cereri de rețea și nu pot dispărea dintr-un folder.
 */

function Visa({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 16" role="img" aria-label="Visa">
      <text
        x="0" y="13"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="15" fontWeight="700" fontStyle="italic"
        letterSpacing="0.5"
        fill="currentColor"
      >
        VISA
      </text>
    </svg>
  );
}

function Mastercard({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 24" role="img" aria-label="Mastercard">
      <circle cx="15" cy="12" r="9" fill="#EB001B" />
      <circle cx="25" cy="12" r="9" fill="#F79E1B" />
      <path
        d="M20 5.1a8.98 8.98 0 0 0 0 13.8 8.98 8.98 0 0 0 0-13.8Z"
        fill="#FF5F00"
      />
    </svg>
  );
}

function Netopia({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 104 24" role="img" aria-label="NETOPIA Payments">
      <text
        x="0" y="11"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="11" fontWeight="400" letterSpacing="2.6"
        fill="currentColor"
      >
        NETOPIA
      </text>
      <text
        x="0" y="21"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="7" fontWeight="700" letterSpacing="3.1"
        fill="currentColor"
      >
        PAYMENTS
      </text>
    </svg>
  );
}

export function PaymentLogos({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-[11px] uppercase tracking-wide text-navy-200">Plăți securizate prin</p>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <a
          href="https://netopia-payments.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="NETOPIA Payments — procesator de plăți"
          className="inline-flex min-h-11 items-center text-white transition-opacity hover:opacity-80"
        >
          <Netopia className="h-6 w-[104px]" />
        </a>
        <span className="inline-flex min-h-11 items-center text-white" aria-hidden="true">
          <Visa className="h-4 w-12" />
        </span>
        <span className="inline-flex min-h-11 items-center" aria-hidden="true">
          <Mastercard className="h-6 w-10" />
        </span>
      </div>
    </div>
  );
}
