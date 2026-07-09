"use client";

import { useState, useEffect } from "react";
import { usePosts, savePost, deletePost, resetPosts, seedPostsIfEmpty } from "@/lib/content";
import { slugify } from "@/lib/products";
import type { Post as BlogPost } from "@/lib/blog";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Lottie } from "@/components/Lottie";
import { Plus, Pencil, Trash, Search, RefreshCw } from "@/components/icons";

// slugify e exportat din products.ts; tipul Post vine din blog.ts
type Article = BlogPost;

function initialHtml(post: Article): string {
  if (post.content) return post.content;
  if (post.body?.length) return post.body.map((p) => `<p>${p}</p>`).join("");
  return "";
}

function readingTimeFromHtml(html: string): string {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
}

function blankArticle(): Article {
  return {
    slug: "",
    title: "",
    excerpt: "",
    category: "Ghid",
    date: new Date().toISOString().slice(0, 10),
    readingTime: "1 min",
    body: [],
    content: "",
  };
}

export function BlogPanel() {
  const posts = usePosts();
  const [editing, setEditing] = useState<Article | null>(null);
  const [query, setQuery] = useState("");

  // La deschiderea panoului (admin logat), populăm Firestore cu articolele-seed dacă e gol.
  useEffect(() => { seedPostsIfEmpty(); }, []);

  const filtered = posts.filter((p) =>
    (p.title + p.category + p.excerpt).toLowerCase().includes(query.trim().toLowerCase())
  );

  if (editing) return <ArticleForm article={editing} onClose={() => setEditing(null)} />;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-navy-800">Articole blog</h2>
          <p className="text-sm text-navy-400">{posts.length} articole · modificările apar live pe /blog</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { if (confirm("Revii la articolele originale? Modificările se pierd.")) resetPosts(); }}
            className="flex items-center gap-1.5 rounded-xl border border-mist bg-white px-3 py-2.5 text-sm font-medium text-navy-500 hover:bg-cloud"
          >
            <RefreshCw className="h-4 w-4" /> Reset
          </button>
          <button
            onClick={() => setEditing(blankArticle())}
            className="flex items-center gap-1.5 rounded-xl bg-lime-500 px-4 py-2.5 text-sm font-semibold text-navy-900 hover:bg-lime-400"
          >
            <Plus className="h-4 w-4" /> Articol nou
          </button>
        </div>
      </div>

      <div className="relative mt-5 w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Caută articol…"
          className="w-full rounded-xl border border-navy-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-lime-400"
        />
      </div>

      <div className="mt-5 space-y-3">
        {filtered.map((p) => (
          <div key={p.slug} className="flex items-center gap-4 rounded-2xl border border-mist bg-white p-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs text-navy-400">
                <span className="rounded bg-lime-100 px-2 py-0.5 font-semibold text-lime-700">{p.category}</span>
                <span>{new Date(p.date).toLocaleDateString("ro-RO", { dateStyle: "medium" })}</span>
                <span>· {p.readingTime}</span>
              </div>
              <h3 className="mt-1 truncate font-heading font-semibold text-navy-800">{p.title || "(fără titlu)"}</h3>
              <p className="truncate text-sm text-navy-500">{p.excerpt}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setEditing(p)} title="Editează" className="grid h-9 w-9 place-items-center rounded-lg text-navy-500 hover:bg-mist"><Pencil className="h-4 w-4" /></button>
              <button
                onClick={() => { if (confirm(`Ștergi „${p.title}"?`)) deletePost(p.slug); }}
                title="Șterge"
                className="grid h-9 w-9 place-items-center rounded-lg text-navy-500 hover:bg-danger/10 hover:text-danger"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="grid place-items-center rounded-2xl border border-dashed border-navy-200 p-8 text-center text-navy-400">
            <Lottie src="/lottie/empty-box.lottie" size={130} />
            <p className="mt-1">Niciun articol.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-lime-400";

function ArticleForm({ article, onClose }: { article: Article; onClose: () => void }) {
  const isNew = !article.slug;
  const originalSlug = article.slug;
  const [title, setTitle] = useState(article.title);
  const [slug, setSlug] = useState(article.slug);
  const [category, setCategory] = useState(article.category);
  const [excerpt, setExcerpt] = useState(article.excerpt);
  const [date, setDate] = useState(article.date);
  const [html, setHtml] = useState(initialHtml(article));

  function save() {
    if (!title.trim()) { alert("Titlul e obligatoriu."); return; }
    const finalSlug = slug || slugify(title);
    const post: Article = {
      slug: finalSlug,
      title: title.trim(),
      excerpt: excerpt.trim(),
      category: category.trim() || "Ghid",
      date,
      readingTime: readingTimeFromHtml(html),
      body: article.body ?? [],
      content: html,
    };
    savePost(post, isNew ? undefined : originalSlug);
    onClose();
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button onClick={onClose} className="text-sm text-navy-400 hover:text-navy-700">← Înapoi la articole</button>
          <h2 className="mt-1 font-heading text-xl font-bold text-navy-800">{isNew ? "Articol nou" : "Editează articol"}</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="rounded-xl border border-mist bg-white px-4 py-2.5 text-sm font-medium text-navy-500 hover:bg-cloud">Anulează</button>
          <button onClick={save} className="rounded-xl bg-lime-500 px-5 py-2.5 text-sm font-semibold text-navy-900 hover:bg-lime-400">Publică</button>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-mist bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block lg:col-span-2">
            <span className="mb-1 block text-xs font-semibold text-navy-600">Titlu</span>
            <input className={inputCls + " text-lg font-semibold"} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titlul articolului" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-navy-600">Slug (URL)</span>
            <input className={inputCls} value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="auto din titlu" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-navy-600">Categorie</span>
            <input className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="ex. Ghid, Despăgubiri" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-navy-600">Data</span>
            <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="block lg:col-span-2">
            <span className="mb-1 block text-xs font-semibold text-navy-600">Rezumat (pe card + SEO)</span>
            <textarea rows={2} className={inputCls} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          </label>
        </div>

        <div>
          <span className="mb-1 block text-xs font-semibold text-navy-600">Conținut</span>
          <RichTextEditor value={html} onChange={setHtml} />
        </div>
      </div>
    </div>
  );
}
