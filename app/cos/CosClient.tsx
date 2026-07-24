"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { saveLead } from "@/lib/db";
import { fieldLabel } from "@/lib/labels";
import type { Lead, Contact } from "@/lib/types";
import { products, COMPANY, lineTotal, PRINT_FEE } from "@/lib/products";
import { FormField } from "@/components/FormField";
import type { FieldStatus } from "@/components/FormField";
import { Section, Eyebrow, btnPrimary, btnOutline, cn } from "@/components/ui";
import { Lottie } from "@/components/Lottie";
import { X, ArrowRight, Shield, Phone } from "@/components/icons";

type Phase = "cart" | "sending" | "paying" | "success";

export function CosClient() {
  const { items, total, removeItem, clear, ready, storageFull, getOrderID } = useCart();
  const [phase, setPhase] = useState<Phase>("cart");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [emailAsync, setEmailAsync] = useState<FieldStatus>("idle");
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [payError, setPayError] = useState("");

  // pre-fill contact din ultimul item care are date de contact
  const prefill = useMemo<Contact>(() => {
    const withContact = [...items].reverse().find((i) => i.data.email || i.data.telefon);
    const d = withContact?.data ?? {};
    return {
      nume: (d.nume as string) ?? "",
      telefon: (d.telefon as string) ?? "",
      email: (d.email as string) ?? "",
      localitate: (d.localitate as string) ?? "",
      mesaj: (d.mesaj as string) ?? "",
    };
  }, [items]);

  const [contact, setContact] = useState<Contact>(prefill);
  // pre-completează din datele wizardului când coșul s-a încărcat (o singură dată, dacă e gol)
  useEffect(() => {
    setContact((c) => (c.nume || c.email || c.telefon ? c : prefill));
  }, [prefill]);

  function set(name: keyof Contact, v: string) {
    setContact((c) => ({ ...c, [name]: v }));
    setErrors((e) => ({ ...e, [name]: false }));
  }

  function handleEmailChange(v: string) {
    set("email", v);
    if (emailAsync !== "idle") setEmailAsync("idle");
  }

  function handleEmailBlur() {
    // Marchează formatul ca valid imediat — nu există verificare pe server, deci
    // nu simulăm una cu spinner (ar sugera o validare care nu se întâmplă).
    setEmailAsync(/.+@.+\..+/.test(contact.email) ? "success" : "idle");
  }

  function validate(): boolean {
    const next: Record<string, boolean> = {};
    if (!contact.nume.trim()) next.nume = true;
    // Telefonul era verificat doar cu .trim() — trecea „aaa”. Același regex ca în FormField.
    if (!contact.telefon.trim() || !/^[+\d\s\-()]{7,}$/.test(contact.telefon)) next.telefon = true;
    if (!contact.email.trim() || !/.+@.+\..+/.test(contact.email)) next.email = true;
    setErrors(next);
    setConsentError(!consent);
    return Object.keys(next).length === 0 && consent;
  }

  /** Mesaj corect: „obligatoriu” doar când e gol, altfel eroarea de format. */
  function errMsg(v: string, invalid: string) {
    return v.trim() ? invalid : "Câmp obligatoriu.";
  }

  // Trimite comanda către Netlify Forms → notificare pe email (POST către fișierul static /__forms.html).
  async function submitToNetlify(lead: Lead) {
    const detalii = lead.items
      .map((it) => {
        const rows = Object.entries(it.data)
          .filter(([, v]) => v !== "" && v !== false)
          .map(([k, v]) => `  ${fieldLabel(k)}: ${v === true ? "Da" : v}`)
          .join("\n");
        const imgs = Object.values(it.images).reduce((n, a) => n + a.length, 0);
        const pretRand = lineTotal(it);
        const pretText = pretRand != null
          ? pretRand + " Lei" + (it.data.raportTiparit ? ` (include raport tipărit +${PRINT_FEE})` : "")
          : "la cerere";
        return `• ${it.productName} (${it.code}) — ${pretText}\n${rows}\n  Fotografii încărcate: ${imgs} (vizibile în panoul admin)`;
      })
      .join("\n\n");

    const params = new URLSearchParams();
    params.append("form-name", "comanda");
    params.append("nume", lead.contact.nume);
    params.append("telefon", lead.contact.telefon);
    params.append("email", lead.contact.email);
    params.append("localitate", lead.contact.localitate || "");
    params.append("produse", lead.items.map((i) => `${i.productName} (${i.code})`).join(", "));
    params.append("total", lead.total != null ? `${lead.total} Lei` : "La cerere");
    params.append("detalii", detalii);
    params.append("mesaj", lead.contact.mesaj || "");

    await fetch("/__forms.html", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
  }

  /** Toate serviciile au preț fix? Altfel nu se poate încasa o sumă în avans. */
  const platibil = items.length > 0 && items.every((i) => i.price != null) && total > 0;

  async function platesteCuCardul() {
    if (!validate()) return;
    setPayError("");
    setPhase("paying");

    // Numărul de comandă vine din coș și e STABIL: o plată reluată folosește același
    // număr, deci suprascrie același lead în loc să creeze duplicate. Se resetează
    // abia după o comandă finalizată (clear()).
    const orderID = getOrderID();

    const lead: Lead = {
      id: `lead-${Date.now()}`,
      createdAt: Date.now(),
      status: "nou",
      contact,
      total,
      orderID,
      items: items.map(({ uid: _uid, ...rest }) => rest),
    };

    try {
      // Comanda se salvează ÎNAINTE de plată: dacă utilizatorul abandonează la
      // banca, datele și pozele nu se pierd, iar expertul poate relua legătura.
      await saveLead(lead);
      try { await submitToNetlify(lead); } catch { /* email best-effort */ }

      const res = await fetch("/api/plata/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderID,
          amount: total,
          description: items.map((i) => i.productName).join(", "),
          contact,
        }),
      });
      const data = await res.json();
      if (!data?.ok || !data.paymentURL) {
        setPhase("cart");
        setPayError(data?.message ?? "Nu am putut porni plata. Încearcă din nou sau sună-ne.");
        return;
      }
      // NU golim coșul aici. Dacă utilizatorul apasă „Înapoi" pe pagina băncii
      // fără să plătească, trebuie să-și regăsească serviciile. Coșul se golește
      // abia după confirmarea plății, pe pagina de rezultat.
      window.location.href = data.paymentURL;
    } catch {
      setPhase("cart");
      setPayError("A apărut o eroare la inițierea plății. Încearcă din nou sau sună-ne.");
    }
  }

  async function submit() {
    if (!validate()) return;
    setPhase("sending");
    const lead: Lead = {
      id: `lead-${Date.now()}`,
      createdAt: Date.now(),
      status: "nou",
      contact,
      total: items.some((i) => i.price == null) ? null : total,
      items: items.map(({ uid: _uid, ...rest }) => rest),
    };

    try {
      await saveLead(lead); // Firestore (+ poze în Storage) sau localStorage în demo
      // Notificare pe email prin Netlify Forms (secundară — nu blocăm comanda dacă pică)
      try { await submitToNetlify(lead); } catch { /* email best-effort */ }
      clear();
      setPhase("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setPhase("cart");
      alert("A apărut o eroare. Încearcă din nou. Dacă persistă, sună-ne.");
    }
  }

  if (!ready) {
    return <Section className="bg-white"><div className="h-40" /></Section>;
  }

  if (phase === "success") {
    return (
      <Section className="bg-mesh-light min-h-[70vh]">
        <div className="mx-auto max-w-xl text-center">
          <Lottie src="/lottie/success-check.lottie" size={160} loop={false} className="mx-auto" />
          <h1 className="mt-2 font-heading text-3xl font-bold text-navy-800">Comanda a fost trimisă!</h1>
          <p className="mt-3 text-navy-500">
            Am primit cererea ta împreună cu toate datele și fotografiile. Un expert te contactează
            în cel mai scurt timp cu oferta, pe telefon sau email. Verifică-ți inbox-ul, inclusiv folderul Spam.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/produse" className={btnPrimary}>Înapoi la servicii <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/" className={btnOutline}>Pagina principală</Link>
          </div>
          <p className="mt-8 flex items-center justify-center gap-2 text-sm text-navy-500">
            <Phone className="h-4 w-4 text-lime-600" /> Ai o întrebare urgentă?{" "}
            <a href={COMPANY.phoneHref} className="font-semibold text-navy-800 hover:text-lime-600">{COMPANY.phone}</a>
          </p>
        </div>
      </Section>
    );
  }

  if (items.length === 0) {
    return (
      <Section className="bg-white min-h-[70vh]">
        <div className="mx-auto max-w-md text-center">
          <Lottie src="/lottie/empty-box.lottie" size={180} className="mx-auto" />
          <h1 className="mt-2 font-heading text-2xl font-bold text-navy-800">Coșul tău e gol</h1>
          <p className="mt-2 text-navy-500">Alege un serviciu de evaluare și completează formularul în câțiva pași.</p>
          <Link href="/produse" className={cn(btnPrimary, "mt-6")}>Vezi serviciile <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </Section>
    );
  }


  return (
    <Section className="bg-white">
      <Eyebrow>Coșul tău</Eyebrow>
      <h1 className="mt-4 font-heading text-3xl font-bold text-navy-800 sm:text-4xl">
        Finalizează comanda
      </h1>
      <p className="mt-2 text-navy-500">Verifică serviciile alese și trimite cererea. Te contactăm cu oferta.</p>

      {storageFull && (
        <div role="alert" className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-navy-700">
          <strong className="font-semibold">Coșul nu poate fi salvat pe acest dispozitiv</strong> — pozele
          încărcate ocupă prea mult spațiu. Comanda funcționează normal, dar
          <strong> nu închide și nu reîncărca pagina</strong> până nu o trimiți.
        </div>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => {
            const product = products.find((p) => p.slug === item.productSlug);
            const dataEntries = Object.entries(item.data).filter(([, v]) => v !== "" && v !== false);
            const imgCount = Object.values(item.images).reduce((n, a) => n + a.length, 0);
            return (
              <div key={item.uid} className="rounded-2xl border border-mist bg-white p-5 shadow-[0_2px_10px_rgba(11,25,48,0.03)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-medium text-navy-400">{product?.category} · Cod {item.code}</span>
                    <h3 className="font-heading text-lg font-semibold text-navy-800">{item.productName}</h3>
                    {item.data.raportTiparit && item.price != null && (
                      <p className="mt-0.5 text-xs text-navy-500">
                        include raport tipărit <span className="font-medium">+{PRINT_FEE} Lei</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-bold text-navy-800">
                      {item.price == null
                        ? "La cerere"
                        : `${(lineTotal(item) ?? item.price).toLocaleString("ro-RO")} Lei`}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.uid)}
                      aria-label="Elimină din coș"
                      className="grid h-11 w-11 place-items-center rounded-lg text-navy-400 hover:bg-cloud hover:text-danger"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {dataEntries.length > 0 && (
                  <dl className="mt-4 grid gap-x-6 gap-y-1.5 border-t border-mist pt-4 sm:grid-cols-2">
                    {dataEntries.slice(0, 8).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3 text-sm">
                        <dt className="text-navy-400">{fieldLabel(k)}</dt>
                        <dd className="truncate text-right font-medium text-navy-700">{v === true ? "Da" : String(v)}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {imgCount > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-mist pt-3">
                    {Object.values(item.images).flat().slice(0, 8).map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={src} alt="" className="h-12 w-12 rounded-lg border border-mist object-cover" />
                    ))}
                    <span className="self-center text-xs text-navy-400">{imgCount} imagini</span>
                  </div>
                )}
              </div>
            );
          })}
          <button type="button" onClick={clear} className="text-sm font-medium text-navy-400 hover:text-danger">
            Golește coșul
          </button>
        </div>

        {/* Checkout panel */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-mist bg-cloud p-6">
            <div className="flex items-center justify-between border-b border-mist pb-4">
              <span className="text-navy-500">Total estimativ</span>
              <span className="font-heading text-2xl font-bold text-navy-800">
                {total > 0 ? `${total.toLocaleString("ro-RO")} Lei` : "La cerere"}
              </span>
            </div>
            <p className="mt-3 text-xs text-navy-400">
              Prețul final se confirmă în ofertă. Serviciile „la cerere" se tarifează după caz.
            </p>

            <div className="mt-5 space-y-3">
              <FormField
                label="Nume și prenume"
                type="text"
                name="nume"
                autoComplete="name"
                value={contact.nume}
                placeholder="Ion Popescu"
                required
                externalError={errors.nume}
                onChange={(v) => set("nume", v)}
              />
              <FormField
                label="Telefon"
                type="tel"
                name="telefon"
                autoComplete="tel"
                value={contact.telefon}
                placeholder="07xx xxx xxx"
                required
                externalError={errors.telefon}
                externalErrorMsg={errMsg(contact.telefon, "Număr de telefon invalid.")}
                onChange={(v) => set("telefon", v)}
              />
              <FormField
                label="Email"
                type="email"
                name="email"
                autoComplete="email"
                value={contact.email}
                placeholder="nume@email.ro"
                required
                externalError={errors.email}
                externalErrorMsg={errMsg(contact.email, "Format email invalid — verifică simbolul @")}
                externalStatus={emailAsync !== "idle" ? emailAsync : undefined}
                successMsg="Adresă validă — te contactăm aici."
                loadingMsg="Verificăm adresa…"
                onChange={handleEmailChange}
                onBlurCallback={handleEmailBlur}
              />
              <FormField
                label="Localitate"
                type="text"
                name="localitate"
                autoComplete="address-level2"
                value={contact.localitate ?? ""}
                placeholder="Timișoara"
                onChange={(v) => set("localitate", v)}
              />
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-navy-600">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => { setConsent(e.target.checked); setConsentError(false); }}
                className="mt-0.5 h-4 w-4 shrink-0 accent-lime-500"
              />
              <span>
                Sunt de acord cu{" "}
                <Link href="/termeni-si-conditii" className="font-medium text-lime-600 underline-offset-2 hover:underline">Termenii și condițiile</Link>{" "}
                și cu{" "}
                <Link href="/politica-confidentialitate" className="font-medium text-lime-600 underline-offset-2 hover:underline">Politica de confidențialitate</Link>{" "}
                și îmi exprim acordul pentru prelucrarea datelor în scopul realizării evaluării.
              </span>
            </label>
            {consentError && (
              <p className="mt-1.5 text-xs text-danger">Trebuie să accepți termenii pentru a trimite cererea.</p>
            )}

            {/* Plata cu cardul apare doar când toate serviciile din coș au preț fix.
                Consultanța e la oră, deci nu se poate încasa în avans. */}
            {platibil && (
              <>
                <button
                  type="button"
                  onClick={platesteCuCardul}
                  disabled={phase === "sending" || phase === "paying"}
                  className={cn(btnPrimary, "mt-4 w-full", (phase === "sending" || phase === "paying") && "opacity-70")}
                >
                  {phase === "paying" ? "Te ducem la plată…" : (<>Plătește {total.toLocaleString("ro-RO")} Lei cu cardul <ArrowRight className="h-4 w-4" /></>)}
                </button>
                {payError && <p role="alert" className="mt-2 text-xs text-danger">{payError}</p>}
              </>
            )}

            {/* Serviciile „la cerere" (Consultanța) n-au preț fix, deci nu se pot
                încasa în avans — pentru ele rămâne trimiterea cererii spre ofertă. */}
            {!platibil && (
              <button
                type="button"
                onClick={submit}
                disabled={phase === "sending"}
                className={cn(btnPrimary, "mt-4 w-full", phase === "sending" && "opacity-70")}
              >
                {phase === "sending" ? "Se trimite…" : (<>Trimite cererea <ArrowRight className="h-4 w-4" /></>)}
              </button>
            )}

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-navy-400">
              <Shield className="h-3.5 w-3.5 text-lime-600" /> Datele tale sunt confidențiale.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
