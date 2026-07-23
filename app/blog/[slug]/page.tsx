import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllPosts, getPostBySlug } from "@/lib/posts-server";
import { COMPANY } from "@/lib/products";
import { PostPageClient } from "./PostPageClient";

type Props = { params: Promise<{ slug: string }> };

/**
 * Toate articolele existente la momentul build-ului se prerandează (inclusiv cele
 * scrise din panou). Cele publicate ulterior se randează la prima cerere —
 * `dynamicParams` e `true` implicit.
 */
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Articol inexistent", robots: { index: false, follow: false } };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      locale: "ro_RO",
      siteName: "CarEval",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.date || undefined,
      authors: [COMPANY.expert],
      images: [{ url: "/images/og-careval.png", width: 1200, height: 630, alt: post.title }],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  // Caută întâi în cod, apoi în Firestore. 404 real doar dacă nu există în niciuna.
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  // Trimitem articolul deja rezolvat, ca să apară în HTML-ul servit (indexabil),
  // nu abia după ce Firestore răspunde în browser.
  return <PostPageClient slug={slug} initialPost={post} />;
}
