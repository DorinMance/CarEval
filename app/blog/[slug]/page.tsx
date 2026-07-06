"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { usePosts } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { Section, btnPrimary } from "@/components/ui";
import { ChevronRight, ArrowRight, Clock } from "@/components/icons";

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const posts = usePosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold text-navy-800">Articol inexistent</h1>
        <p className="mt-2 text-navy-500">Articolul căutat nu există sau a fost șters.</p>
        <Link href="/blog" className={`${btnPrimary} mt-6`}>Înapoi la blog <ArrowRight className="h-4 w-4" /></Link>
      </div>
    );
  }

  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const hasHtml = !!post.content;

  return (
    <>
      <div className="border-b border-mist bg-cloud">
        <nav className="mx-auto flex max-w-3xl items-center gap-1.5 px-4 py-3 text-sm text-navy-400 sm:px-6">
          <Link href="/" className="hover:text-navy-700">Acasă</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/blog" className="hover:text-navy-700">Blog</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="truncate font-medium text-navy-700">{post.title}</span>
        </nav>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <Reveal>
          <div className="flex items-center gap-3 text-xs text-navy-400">
            <span className="rounded-md bg-lime-100 px-2 py-0.5 font-semibold text-lime-700">{post.category}</span>
            <span>{new Date(post.date).toLocaleDateString("ro-RO", { dateStyle: "long" })}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readingTime}</span>
          </div>
          <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-navy-800 sm:text-4xl">{post.title}</h1>
          <p className="mt-4 text-lg text-navy-500">{post.excerpt}</p>
        </Reveal>

        <div className="mt-8 border-t border-mist pt-8">
          {hasHtml ? (
            <div className="article-html text-lg text-navy-700" dangerouslySetInnerHTML={{ __html: post.content! }} />
          ) : (
            <div className="space-y-5">
              {post.body.map((p, i) => (
                <p key={i} className="text-lg leading-relaxed text-navy-700">{p}</p>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl bg-navy-gradient px-6 py-10 text-center text-white">
          <h2 className="font-heading text-2xl font-bold">Vrei o evaluare corectă pentru mașina ta?</h2>
          <Link href="/produse" className={btnPrimary}>Vezi serviciile <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </article>

      {more.length > 0 && (
        <Section className="bg-cloud pt-0">
          <h2 className="mb-6 font-heading text-2xl font-bold text-navy-800">Continuă să citești</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {more.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group rounded-2xl border border-mist bg-white p-6 transition-all hover:border-lime-200 hover:shadow-lg">
                <span className="rounded-md bg-lime-100 px-2 py-0.5 text-xs font-semibold text-lime-700">{p.category}</span>
                <h3 className="mt-3 font-heading text-lg font-semibold text-navy-800">{p.title}</h3>
                <p className="mt-2 text-sm text-navy-500">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
