"use client";

/**
 * Ultima plasă: prinde erorile din root layout, unde `app/error.tsx` nu mai ajunge.
 * Trebuie să-și randeze propriile <html> și <body> — nu moștenește layout-ul.
 * Fără dependențe de componente, ca să nu poată eșua la rândul ei.
 */
export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="ro">
      <body
        style={{
          minHeight: "100dvh", margin: 0, display: "grid", placeItems: "center",
          background: "#283e64", color: "#fff", padding: "24px",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif", textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 440 }}>
          <p style={{ fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8fd02f", margin: 0 }}>
            CarEval
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: "14px 0 0" }}>
            Site-ul întâmpină o problemă
          </h1>
          <p style={{ margin: "12px 0 0", lineHeight: 1.6, color: "#d2def0" }}>
            Lucrăm la remediere. Poți reîncerca sau ne poți suna direct.
          </p>
          <div style={{ marginTop: 26, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => unstable_retry()}
              style={{
                minHeight: 44, padding: "0 22px", borderRadius: 12, border: 0, cursor: "pointer",
                background: "#8fd02f", color: "#0b1930", fontWeight: 600, fontSize: 15,
              }}
            >
              Încearcă din nou
            </button>
            <a
              href="tel:+40750483935"
              style={{
                minHeight: 44, padding: "0 22px", borderRadius: 12, display: "inline-flex",
                alignItems: "center", border: "1px solid rgba(255,255,255,0.45)",
                color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: 15,
              }}
            >
              +40 750 483 935
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
