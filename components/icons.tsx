import type { SVGProps } from "react";

const base = (props: SVGProps<SVGSVGElement>) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const Phone = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M3 5a2 2 0 0 1 2-2h2.5a1 1 0 0 1 1 .76l1 4a1 1 0 0 1-.29 1L8 11.5a13 13 0 0 0 4.5 4.5l1.74-1.21a1 1 0 0 1 1-.29l4 1a1 1 0 0 1 .76 1V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5Z" /></svg>
);
export const Mail = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const Clock = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const MapPin = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
export const Check = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="m5 12 5 5L20 7" /></svg>
);
export const ArrowRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
);
export const ChevronRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="m9 6 6 6-6 6" /></svg>
);
export const ChevronDown = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>
);
export const Cart = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h2.2l2.3 12.4a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H5.2" /></svg>
);
export const Menu = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M3 6h18M3 12h18M3 18h18" /></svg>
);
export const X = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const Star = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ ...p, fill: "currentColor", stroke: "none" })}><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z" /></svg>
);
export const Shield = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M12 3 5 6v6c0 4.2 3 7.4 7 9 4-1.6 7-4.8 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const FileText = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></svg>
);
export const Car = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13" /><path d="M3 13h18v4a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1H6.5v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4Z" /><path d="M6.5 16h.01M17.5 16h.01" /></svg>
);
export const Upload = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M12 16V5m0 0L8 9m4-4 4 4" /><path d="M5 19h14" /></svg>
);
export const Users = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M16 5.5a3 3 0 0 1 0 5M21 20c0-2.5-1.4-4.7-3.5-5.6" /></svg>
);
export const Scale = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M12 3v18M7 21h10M6 7h12M6 7l-3 6a3 3 0 0 0 6 0L6 7Zm12 0-3 6a3 3 0 0 0 6 0l-3-6Z" /></svg>
);
export const Sparkle = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /></svg>
);
export const Quote = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ ...p, fill: "currentColor", stroke: "none" })}><path d="M7 7h4v6a4 4 0 0 1-4 4v-2a2 2 0 0 0 2-2H7V7Zm8 0h4v6a4 4 0 0 1-4 4v-2a2 2 0 0 0 2-2h-2V7Z" /></svg>
);
export const Award = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><circle cx="12" cy="9" r="5" /><path d="m8.5 13-1.5 8 5-3 5 3-1.5-8" /></svg>
);
export const Building = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01M10 21v-4h4v4" /></svg>
);
export const Phone2 = Phone;
export const Zap = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" /></svg>
);
export const ClipboardList = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><rect x="8" y="2" width="8" height="4" rx="1.5" /><path d="M8 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-2" /><path d="M9 12h6M9 16h4" /></svg>
);
export const ImagePlus = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 15l4-4a3 3 0 0 1 4 0l5 5" /><path d="M14 14l1.5-1.5a3 3 0 0 1 4 0L21 14" /><circle cx="8.5" cy="8.5" r="1.5" /></svg>
);
export const RefreshCw = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
);
export const FileImage = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5" /><circle cx="10" cy="13" r="1.5" /><path d="m9 17 1.5-2 2.5 3.5" /></svg>
);
