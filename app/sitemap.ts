import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { getAllPosts } from "@/lib/posts-server";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const now = new Date();

  const statice: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["", 1, "weekly"],
    ["/produse", 0.9, "weekly"],
    ["/cum-functioneaza", 0.7, "monthly"],
    ["/model-raport", 0.7, "monthly"],
    ["/despre-noi", 0.6, "monthly"],
    ["/independenta", 0.6, "monthly"],
    ["/companii", 0.6, "monthly"],
    ["/blog", 0.6, "weekly"],
    ["/contact", 0.7, "monthly"],
    // Paginile legale rămân indexabile: Google le folosește ca semnal de
    // legitimitate pentru site-uri YMYL (aici, financiar).
    ["/termeni-si-conditii", 0.2, "yearly"],
    ["/politica-confidentialitate", 0.2, "yearly"],
    ["/politica-cookies", 0.2, "yearly"],
    ["/politica-livrare", 0.3, "yearly"],
    ["/politica-anulare", 0.3, "yearly"],
  ];

  return [
    ...statice.map(([path, priority, changeFrequency]) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...products.map((p) => ({
      url: `${SITE_URL}/produs/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
