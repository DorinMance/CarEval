"use client";

import { useMemo, useState } from "react";
import { useAllReviews, setReviewStatus, deleteReview, type ReviewStatus, type Review } from "@/lib/reviews";
import { products as seedProducts } from "@/lib/products";
import { cn } from "@/components/ui";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Star, Check, X, Trash, Clock, Spinner } from "@/components/icons";

const STATUS_META: Record<ReviewStatus, { label: string; cls: string }> = {
  pending: { label: "În așteptare", cls: "bg-amber-100 text-amber-700" },
  approved: { label: "Aprobată", cls: "bg-lime-100 text-lime-700" },
  rejected: { label: "Respinsă", cls: "bg-red-100 text-red-700" },
};

function productName(slug: string): string {
  return seedProducts.find((p) => p.slug === slug)?.name ?? slug;
}

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={cn("h-4 w-4", value >= n ? "text-amber-400" : "text-navy-200")} />
      ))}
    </span>
  );
}

export function ReviewsPanel() {
  const reviews = useAllReviews();
  const [filter, setFilter] = useState<ReviewStatus | "all">("pending");
  // `busy` = "<id>:<acțiune>" cât timp scrie în bază (previne dublu-clic).
  const [busy, setBusy] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Review | null>(null);

  async function changeStatus(id: string, status: ReviewStatus) {
    if (busy) return;
    setBusy(`${id}:${status}`);
    try { await setReviewStatus(id, status); } finally { setBusy(null); }
  }
  async function confirmDelete() {
    if (!toDelete) return;
    setBusy(`${toDelete.id}:del`);
    try { await deleteReview(toDelete.id); } finally { setBusy(null); setToDelete(null); }
  }

  const counts = useMemo(() => {
    return {
      all: reviews.length,
      pending: reviews.filter((r) => r.status === "pending").length,
      approved: reviews.filter((r) => r.status === "approved").length,
      rejected: reviews.filter((r) => r.status === "rejected").length,
    };
  }, [reviews]);

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  const FILTERS: { key: ReviewStatus | "all"; label: string }[] = [
    { key: "pending", label: `În așteptare (${counts.pending})` },
    { key: "approved", label: `Aprobate (${counts.approved})` },
    { key: "rejected", label: `Respinse (${counts.rejected})` },
    { key: "all", label: `Toate (${counts.all})` },
  ];

  return (
    <div>
      <div className="mb-2 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-navy-800">Recenzii</h2>
          <p className="text-sm text-navy-400">
            Recenziile apar pe site doar după ce le aprobi aici.
          </p>
        </div>
        {counts.pending > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-700">
            <Clock className="h-4 w-4" /> {counts.pending} de verificat
          </span>
        )}
      </div>

      {/* Filtre */}
      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-medium transition-all sm:min-h-0 sm:py-1.5",
              filter === f.key
                ? "bg-navy-800 text-white shadow-sm"
                : "border border-mist bg-white text-navy-500 hover:border-navy-300 hover:bg-mist hover:text-navy-800 hover:shadow-sm"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Listă */}
      <div className="mt-5 space-y-4">
        {filtered.length === 0 && (
          <div className="grid place-items-center rounded-2xl border border-dashed border-navy-200 p-10 text-center text-navy-400">
            Nicio recenzie pentru acest filtru.
          </div>
        )}

        {filtered.map((r) => (
          <article key={r.id} className="rounded-2xl border border-mist bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-heading font-semibold text-navy-800">{r.author}</p>
                  <Stars value={r.rating} />
                  <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold", STATUS_META[r.status].cls)}>
                    {STATUS_META[r.status].label}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-navy-400">
                  {productName(r.productSlug)} · {new Date(r.createdAt).toLocaleString("ro-RO", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
            </div>

            <p className="mt-3 whitespace-pre-wrap rounded-xl bg-cloud p-3.5 text-sm leading-relaxed text-navy-700">
              {r.text}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {r.status !== "approved" && (
                <button
                  type="button"
                  onClick={() => changeStatus(r.id, "approved")}
                  disabled={!!busy}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-lime-500 px-4 py-2 text-xs font-semibold text-navy-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-lime-400 hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:min-h-0"
                >
                  {busy === `${r.id}:approved` ? <Spinner className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  {busy === `${r.id}:approved` ? "Se publică…" : "Aprobă (publică)"}
                </button>
              )}
              {r.status !== "rejected" && (
                <button
                  type="button"
                  onClick={() => changeStatus(r.id, "rejected")}
                  disabled={!!busy}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-mist bg-white px-4 py-2 text-xs font-semibold text-navy-600 transition-all hover:-translate-y-0.5 hover:border-navy-200 hover:bg-mist hover:shadow-sm active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:min-h-0"
                >
                  {busy === `${r.id}:rejected` ? <Spinner className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                  {busy === `${r.id}:rejected` ? "Se ascunde…" : "Respinge (ascunde)"}
                </button>
              )}
              <button
                type="button"
                onClick={() => setToDelete(r)}
                disabled={!!busy}
                className="ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs font-semibold text-danger transition-all hover:border-danger/50 hover:bg-danger/10 hover:shadow-sm active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-0"
              >
                <Trash className="h-3.5 w-3.5" /> Șterge
              </button>
            </div>
          </article>
        ))}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Ștergi recenzia?"
        message={toDelete ? `Recenzia lui ${toDelete.author} se șterge definitiv.` : undefined}
        confirmLabel="Șterge definitiv"
        danger
        busy={!!busy && busy.endsWith(":del")}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
