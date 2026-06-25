// Căile către animațiile Lottie în /public/lottie.
// Fișier "plain" (fără "use client") — poate fi citit și din Server Components.

export const LOTTIE = {
  // Animații generate (always-looping, profesionale)
  evalSpin: "/lottie/eval-spin.json",       // arc lime rotativ + bifă albă — pentru evaluare/verificare
  shieldPing: "/lottie/shield-ping.json",   // scut pulsant cu inele radiale — pentru autoritate/protecție
  docCheck: "/lottie/doc-check.json",       // document cu linii + ștampilă bounce — pentru raport/official

  // Animații originale (rezervă)
  carAccident: "/lottie/car-accident.json",
  report: "/lottie/report.json",
  carSafe: "/lottie/car-safe.json",
  insurance: "/lottie/insurance.json",
  reporting: "/lottie/reporting.json",
} as const;
