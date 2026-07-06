"use client";

import { useEffect, useRef, useState } from "react";
import { Link2, ImagePlus } from "./icons";

/* Editor „tip Word" — contentEditable + toolbar complet. Emite HTML prin onChange. */

const FONTS = [
  "Space Grotesk", "DM Sans", "Arial", "Helvetica", "Georgia", "Times New Roman",
  "Garamond", "Palatino", "Verdana", "Tahoma", "Trebuchet MS", "Courier New",
  "Roboto", "Open Sans", "Lato", "Montserrat", "Merriweather", "Comic Sans MS", "Impact",
];

const SIZES = [12, 13, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64];

const COLORS = [
  "#0b1930", "#12305a", "#1d3f66", "#3f5d96", "#8fd02f", "#599013",
  "#dc2626", "#d97706", "#16a34a", "#7c3aed", "#0891b2", "#db2777",
  "#111827", "#6b7280", "#9ca3af", "#ffffff",
];

const BLOCKS = [
  { label: "Text normal", value: "P" },
  { label: "Titlu 1", value: "H2" },
  { label: "Titlu 2", value: "H3" },
  { label: "Subtitlu", value: "H4" },
  { label: "Citat", value: "BLOCKQUOTE" },
];

function ToolBtn({
  onClick, title, active, children,
}: {
  onClick: () => void; title: string; active?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`grid h-9 min-w-9 place-items-center rounded-md px-2 text-sm transition-colors ${
        active ? "bg-navy-800 text-white" : "text-navy-600 hover:bg-mist"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-6 w-px shrink-0 bg-mist" />;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Scrie articolul aici…",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<"#111827" | string>("#dc2626");
  const [highlight, setHighlight] = useState("#fef08a");

  // Inițializare o singură dată (necontrolat după mount → fără sărituri de cursor).
  useEffect(() => {
    if (ref.current && value && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
    try { document.execCommand("styleWithCSS", false, "true"); } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function emit() {
    if (ref.current) onChange(ref.current.innerHTML);
  }

  function exec(cmd: string, val?: string) {
    ref.current?.focus();
    try { document.execCommand("styleWithCSS", false, "true"); } catch {}
    document.execCommand(cmd, false, val);
    emit();
  }

  function setFontSize(px: number) {
    ref.current?.focus();
    document.execCommand("fontSize", false, "7");
    ref.current?.querySelectorAll('font[size="7"]').forEach((f) => {
      const el = f as HTMLElement;
      el.removeAttribute("size");
      el.style.fontSize = `${px}px`;
    });
    emit();
  }

  function insertLink() {
    const url = window.prompt("Adresa linkului (URL):", "https://");
    if (url) exec("createLink", url);
  }

  function insertImageUrl() {
    const url = window.prompt("Adresa imaginii (URL):", "https://");
    if (url) exec("insertImage", url);
  }

  const fileRef = useRef<HTMLInputElement>(null);
  function onFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") exec("insertImage", reader.result); };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="overflow-hidden rounded-xl border border-navy-200 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-mist bg-cloud px-2 py-2">
        <select
          onChange={(e) => { exec("formatBlock", e.target.value); e.target.selectedIndex = 0; }}
          className="h-8 rounded-md border border-navy-200 bg-white px-2 text-sm text-navy-700 outline-none"
          title="Stil paragraf"
          defaultValue=""
        >
          <option value="" disabled>Stil</option>
          {BLOCKS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
        </select>

        <select
          onChange={(e) => { exec("fontName", e.target.value); e.target.selectedIndex = 0; }}
          className="h-8 w-32 rounded-md border border-navy-200 bg-white px-2 text-sm text-navy-700 outline-none"
          title="Font"
          defaultValue=""
        >
          <option value="" disabled>Font</option>
          {FONTS.map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
        </select>

        <select
          onChange={(e) => { setFontSize(Number(e.target.value)); e.target.selectedIndex = 0; }}
          className="h-8 rounded-md border border-navy-200 bg-white px-2 text-sm text-navy-700 outline-none"
          title="Mărime"
          defaultValue=""
        >
          <option value="" disabled>Px</option>
          {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <Divider />

        <ToolBtn title="Bold" onClick={() => exec("bold")}><b>B</b></ToolBtn>
        <ToolBtn title="Italic" onClick={() => exec("italic")}><i>I</i></ToolBtn>
        <ToolBtn title="Subliniat" onClick={() => exec("underline")}><u>U</u></ToolBtn>
        <ToolBtn title="Tăiat" onClick={() => exec("strikeThrough")}><s>S</s></ToolBtn>

        <Divider />

        {/* Culoare text */}
        <label className="flex h-8 cursor-pointer items-center gap-1 rounded-md px-1.5 text-navy-600 hover:bg-mist" title="Culoare text">
          <span className="text-sm font-bold" style={{ color: text }}>A</span>
          <input
            type="color"
            value={text}
            onChange={(e) => { setText(e.target.value); exec("foreColor", e.target.value); }}
            className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent p-0"
          />
        </label>
        {/* Highlight */}
        <label className="flex h-8 cursor-pointer items-center gap-1 rounded-md px-1.5 text-navy-600 hover:bg-mist" title="Evidențiere">
          <span className="rounded px-1 text-sm font-bold" style={{ background: highlight }}>H</span>
          <input
            type="color"
            value={highlight}
            onChange={(e) => { setHighlight(e.target.value); exec("hiliteColor", e.target.value); }}
            className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent p-0"
          />
        </label>

        {/* Paletă rapidă */}
        <div className="ml-1 hidden items-center gap-0.5 sm:flex">
          {COLORS.slice(0, 8).map((c) => (
            <button
              key={c}
              type="button"
              title={c}
              onMouseDown={(e) => { e.preventDefault(); exec("foreColor", c); }}
              className="h-5 w-5 rounded-full border border-black/10"
              style={{ background: c }}
            />
          ))}
        </div>

        <Divider />

        <ToolBtn title="Aliniere stânga" onClick={() => exec("justifyLeft")}>≡</ToolBtn>
        <ToolBtn title="Centrat" onClick={() => exec("justifyCenter")}>≡</ToolBtn>
        <ToolBtn title="Aliniere dreapta" onClick={() => exec("justifyRight")}>≡</ToolBtn>
        <ToolBtn title="Justify" onClick={() => exec("justifyFull")}>≣</ToolBtn>

        <Divider />

        <ToolBtn title="Listă cu buline" onClick={() => exec("insertUnorderedList")}>•—</ToolBtn>
        <ToolBtn title="Listă numerotată" onClick={() => exec("insertOrderedList")}>1.</ToolBtn>

        <Divider />

        <ToolBtn title="Link" onClick={insertLink}><Link2 className="h-4 w-4" /></ToolBtn>
        <ToolBtn title="Imagine din URL" onClick={insertImageUrl}><ImagePlus className="h-4 w-4" /></ToolBtn>
        <ToolBtn title="Încarcă imagine" onClick={() => fileRef.current?.click()}>⤒</ToolBtn>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFilePicked} />

        <Divider />

        <ToolBtn title="Curăță formatarea" onClick={() => exec("removeFormat")}>⌫</ToolBtn>
      </div>

      {/* Suprafață editabilă */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        data-placeholder={placeholder}
        className="rte-surface min-h-[340px] max-w-none px-5 py-4 text-navy-700 outline-none"
      />
    </div>
  );
}
