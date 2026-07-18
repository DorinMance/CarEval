"use client";

import { useRef, useState, useCallback, type DragEvent } from "react";
import type { ImageGroup } from "@/lib/products";
import { Upload, X, RefreshCw, Check, FileImage } from "./icons";
import { cn } from "./ui";

interface QueueEntry {
  id: string;
  file: File;
  preview: string;        // object URL for instant thumbnail
  progress: number;       // 0-100
  status: "uploading" | "done" | "error";
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileTypeIcon({ type }: { type: string }) {
  return (
    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-lime-50 border border-lime-100">
      <FileImage className="h-4.5 w-4.5 text-lime-600" />
    </div>
  );
}

/* ═════════════════════════════════════════════
   CORE UPLOADER — shared logic
═════════════════════════════════════════════ */
export function ImageUploader({
  group,
  files,
  onAdd,
  onRemove,
}: {
  group: ImageGroup;
  files: string[];
  onAdd: (dataUrl: string) => void;
  onRemove: (idx: number) => void;
}) {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const metaRef = useRef<Map<string, { name: string; size: number; type: string }>>(new Map());

  const activeCount = queue.filter(q => q.status === "uploading").length;
  const remaining = group.max - files.length - activeCount;
  const full = remaining <= 0;

  /* ── process a batch of File objects ── */
  const processFiles = useCallback(
    (batch: File[]) => {
      const allowed = batch
        .filter(f => f.type.startsWith("image/"))
        .slice(0, Math.max(0, remaining));

      if (!allowed.length) return;

      const newEntries: QueueEntry[] = allowed.map(file => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: "uploading" as const,
      }));

      setQueue(prev => [...prev, ...newEntries]);
      newEntries.forEach(e => startReader(e.id, e.file, e.preview));
    },
    [remaining]   // eslint-disable-line react-hooks/exhaustive-deps
  );

  function startReader(id: string, file: File, preview: string) {
    const reader = new FileReader();
    let progVal = 0;
    let dataUrl: string | null = null;
    let readerDone = false;

    const interval = setInterval(() => {
      progVal = Math.min(progVal + Math.random() * 14 + 6, 88);
      setQueue(prev => prev.map(q =>
        q.id === id ? { ...q, progress: Math.round(progVal) } : q
      ));
      if (readerDone && dataUrl) {
        clearInterval(interval);
        commit(id, dataUrl, file, preview);
      }
    }, 65);

    reader.onload = () => {
      dataUrl = reader.result as string;
      readerDone = true;
      if (progVal >= 88) {
        clearInterval(interval);
        commit(id, dataUrl, file, preview);
      }
    };

    reader.onerror = () => {
      clearInterval(interval);
      setQueue(prev => prev.map(q =>
        q.id === id ? { ...q, status: "error", progress: 0 } : q
      ));
    };

    reader.readAsDataURL(file);
  }

  function commit(id: string, dataUrl: string, file: File, _preview: string) {
    metaRef.current.set(dataUrl, { name: file.name, size: file.size, type: file.type });
    setQueue(prev => prev.map(q =>
      q.id === id ? { ...q, progress: 100, status: "done" } : q
    ));
    onAdd(dataUrl);
  }

  function retryEntry(entry: QueueEntry) {
    const newId = `r-${Math.random().toString(36).slice(2)}`;
    const newPreview = URL.createObjectURL(entry.file);
    setQueue(prev => [
      ...prev.filter(q => q.id !== entry.id),
      { id: newId, file: entry.file, preview: newPreview, progress: 0, status: "uploading" },
    ]);
    startReader(newId, entry.file, newPreview);
  }

  /* ── drag events ── */
  function onDragOver(e: DragEvent) { e.preventDefault(); }
  function onDragEnter(e: DragEvent) { e.preventDefault(); setIsDragging(true); }
  function onDragLeave(e: DragEvent<HTMLElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
  }
  function onDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (full) return;
    processFiles(Array.from(e.dataTransfer.files));
  }

  /* ── choose component by slot mode ── */
  if (group.max === 1) {
    return (
      <SingleSlot
        group={group}
        committed={files[0]}
        queueEntry={queue[0]}
        isDragging={isDragging}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onBrowse={() => inputRef.current?.click()}
        onRemove={() => onRemove(0)}
        inputRef={inputRef}
        onFileInput={(fl) => processFiles(Array.from(fl ?? []))}
      />
    );
  }

  return (
    <MultiSlot
      group={group}
      committed={files}
      queue={queue}
      isDragging={isDragging}
      full={full}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onBrowse={() => inputRef.current?.click()}
      onRemove={onRemove}
      onRetry={retryEntry}
      inputRef={inputRef}
      onFileInput={(fl) => processFiles(Array.from(fl ?? []))}
    />
  );
}

/* ═════════════════════════════════════════════
   SINGLE SLOT (Față, Spate, Bord…)
   Compact card — drag + progress overlay
═════════════════════════════════════════════ */
function SingleSlot({
  group, committed, queueEntry, isDragging,
  onDragOver, onDragEnter, onDragLeave, onDrop,
  onBrowse, onRemove, inputRef, onFileInput,
}: {
  group: ImageGroup;
  committed?: string;
  queueEntry?: QueueEntry;
  isDragging: boolean;
  onDragOver: (e: DragEvent) => void;
  onDragEnter: (e: DragEvent) => void;
  onDragLeave: (e: DragEvent<HTMLElement>) => void;
  onDrop: (e: DragEvent) => void;
  onBrowse: () => void;
  onRemove: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileInput: (fl: FileList | null) => void;
}) {
  const hasCommitted = !!committed;
  const isUploading = queueEntry?.status === "uploading";
  const isDone = queueEntry?.status === "done";
  const isError = queueEntry?.status === "error";
  const previewSrc = queueEntry?.preview ?? committed;

  return (
    <div data-anim className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-navy-500">
        {group.label}
      </span>
      <div
        role="button"
        tabIndex={0}
        aria-label={`Încarcă ${group.label}`}
        className={cn(
          "group relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all cursor-pointer",
          isDragging
            ? "border-lime-400 bg-lime-50 shadow-[0_0_0_3px_rgba(143,208,47,0.18)]"
            : previewSrc
            ? "border-mist"
            : "border-dashed border-navy-200 bg-cloud hover:border-lime-400 hover:bg-lime-50/40"
        )}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={onBrowse}
        onKeyDown={(e) => e.key === "Enter" && onBrowse()}
      >
        {/* Preview */}
        {previewSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewSrc} alt={group.label} className="h-full w-full object-cover" />
        )}

        {/* Empty state */}
        {!previewSrc && !isDragging && (
          <div className="flex h-full flex-col items-center justify-center gap-1.5 text-navy-400 group-hover:text-lime-600 transition-colors">
            <Upload className="h-5 w-5" />
            <span className="text-[11px] font-medium">Adaugă</span>
          </div>
        )}

        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-lime-50/80">
            <Upload className="h-5 w-5 text-lime-600" />
            <span className="text-[10px] font-bold text-lime-700">Lasă aici</span>
          </div>
        )}

        {/* Upload progress overlay */}
        {(isUploading || isDone) && (
          <div className="absolute inset-0 flex flex-col items-end justify-end bg-navy-900/40">
            {isDone ? (
              <div className="m-2 grid h-6 w-6 place-items-center rounded-full bg-lime-400">
                <Check className="h-3.5 w-3.5 text-navy-900" />
              </div>
            ) : (
              <div className="w-full px-2 pb-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-lime-400 transition-all duration-150"
                    style={{ width: `${queueEntry?.progress ?? 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error overlay */}
        {isError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-navy-900/60">
            <span className="text-[10px] font-bold text-danger">Eroare</span>
          </div>
        )}

        {/* Remove button (committed file) */}
        {hasCommitted && !queueEntry && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            aria-label="Șterge"
            className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full bg-navy-900/80 text-white opacity-100 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFileInput(e.target.files)}
      />
    </div>
  );
}

/* ═════════════════════════════════════════════
   MULTI SLOT (avarii, PV…)
   Drop zone + per-file queue rows
═════════════════════════════════════════════ */
function MultiSlot({
  group, committed, queue, isDragging, full,
  onDragOver, onDragEnter, onDragLeave, onDrop,
  onBrowse, onRemove, onRetry, inputRef, onFileInput,
}: {
  group: ImageGroup;
  committed: string[];
  queue: QueueEntry[];
  isDragging: boolean;
  full: boolean;
  onDragOver: (e: DragEvent) => void;
  onDragEnter: (e: DragEvent) => void;
  onDragLeave: (e: DragEvent<HTMLElement>) => void;
  onDrop: (e: DragEvent) => void;
  onBrowse: () => void;
  onRemove: (idx: number) => void;
  onRetry: (entry: QueueEntry) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileInput: (fl: FileList | null) => void;
}) {
  const totalFiles = committed.length + queue.filter(q => q.status === "uploading").length;
  const errorCount = queue.filter(q => q.status === "error").length;
  const hasQueue = queue.length > 0;

  return (
    <div data-anim>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-medium text-navy-700">{group.label}</label>
        <div className="flex items-center gap-2">
          {errorCount > 0 && (
            <span className="rounded-full bg-danger/10 px-2 py-0.5 text-[11px] font-bold text-danger">
              {errorCount} eșuate
            </span>
          )}
          <span className="text-xs text-navy-400">{totalFiles}/{group.max}</span>
        </div>
      </div>

      {group.help && <p className="mb-3 text-xs text-navy-400">{group.help}</p>}

      {/* Drop zone */}
      {!full && (
        <div
          role="button"
          tabIndex={0}
          aria-label={`Adaugă imagini pentru ${group.label}`}
          className={cn(
            "mb-4 flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 px-6 py-7 text-center transition-all",
            isDragging
              ? "border-lime-400 bg-lime-50 shadow-[0_0_0_3px_rgba(143,208,47,0.18)]"
              : "border-dashed border-navy-200 bg-cloud hover:border-lime-400 hover:bg-lime-50/40"
          )}
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={onBrowse}
          onKeyDown={(e) => e.key === "Enter" && onBrowse()}
        >
          {isDragging ? (
            <>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-lime-400/20">
                <Upload className="h-5 w-5 text-lime-600" />
              </div>
              <p className="text-sm font-bold text-lime-700">Lasă fișierele aici</p>
            </>
          ) : (
            <>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-navy-100/60">
                <Upload className="h-5 w-5 text-navy-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-navy-700">
                  Trage imaginile aici{" "}
                  <span className="text-lime-600 underline underline-offset-2">sau selectează</span>
                </p>
                <p className="mt-0.5 text-[11px] text-navy-400">
                  JPG, PNG, WEBP · max {group.max} fișiere
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Queue — per-file rows */}
      {hasQueue && (
        <div className="mb-4 space-y-2">
          {queue.map((entry) => (
            <QueueRow
              key={entry.id}
              entry={entry}
              onRetry={onRetry}
            />
          ))}
        </div>
      )}

      {/* Committed thumbnails (persisted across re-renders) */}
      {committed.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {committed.map((src, i) => (
            <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-xl border border-mist">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${group.label} ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                aria-label="Șterge imaginea"
                className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-navy-900/80 text-white opacity-100 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onFileInput(e.target.files)}
      />
    </div>
  );
}

/* ═════════════════════════════════════════════
   QUEUE ROW — single file in independent lane
═════════════════════════════════════════════ */
function QueueRow({ entry, onRetry }: { entry: QueueEntry; onRetry: (e: QueueEntry) => void }) {
  const { file, preview, progress, status } = entry;

  const isUploading = status === "uploading";
  const isDone = status === "done";
  const isError = status === "error";

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors",
        isDone
          ? "border-lime-200 bg-lime-50/40"
          : isError
          ? "border-danger/20 bg-danger/5"
          : "border-navy-100 bg-white"
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="" className="h-full w-full object-cover" />
        {isDone && (
          <div className="absolute inset-0 flex items-center justify-center bg-lime-400/80">
            <Check className="h-4 w-4 text-navy-900" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[12px] font-semibold text-navy-800">{file.name}</p>
          <span className="shrink-0 text-[11px] text-navy-400">{formatBytes(file.size)}</span>
        </div>
        {/* Progress bar */}
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-navy-100">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-150",
              isDone ? "bg-lime-500" : isError ? "bg-danger" : "bg-lime-500"
            )}
            style={{ width: isError ? "100%" : `${progress}%` }}
          />
        </div>
      </div>

      {/* Action / Status */}
      <div className="shrink-0 w-14 text-right">
        {isUploading && (
          <span className="text-[12px] font-bold tabular-nums text-navy-500">{progress}%</span>
        )}
        {isDone && (
          <span className="text-[11px] font-medium text-lime-600">✓ Gata</span>
        )}
        {isError && (
          <button
            type="button"
            onClick={() => onRetry(entry)}
            className="inline-flex items-center gap-1 rounded-lg bg-danger/10 px-2 py-1 text-[11px] font-bold text-danger hover:bg-danger/20 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
