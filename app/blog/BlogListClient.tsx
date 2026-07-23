"use client";

import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/ui";
import { usePosts } from "@/lib/content";
import { ArrowRight, Clock } from "@/components/icons";

export function BlogListClient() {
  const posts = usePosts();

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title={<>Ghiduri pentru <span className="text-gradient-lime">șoferi informați</span></>}
        subtitle="Sfaturi practice despre evaluări, despăgubiri și ce să faci după un accident."
      />

      <Section className="bg-white">
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-mist bg-white p-6 shadow-[0_2px_12px_rgba(11,25,48,0.04)] transition-all hover:-translate-y-1 hover:border-lime-200 hover:shadow-[0_24px_50px_-24px_rgba(11,25,48,0.4)]"
            >
              <div className="flex items-center gap-3 text-xs text-navy-400">
                <span className="rounded-md bg-lime-100 px-2 py-0.5 font-semibold text-lime-700">{post.category}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readingTime}</span>
              </div>
              <h2 className="mt-4 font-heading text-xl font-semibold leading-snug text-navy-800">{post.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-500">{post.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-lime-600">
                Citește <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
          {posts.length === 0 && (
            <p className="col-span-full text-center text-navy-400">Niciun articol publicat momentan.</p>
          )}
        </div>
      </Section>
    </>
  );
}
