import type { Metadata } from "next";
import { BlogListClient } from "./BlogListClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Ghiduri practice despre evaluări auto, despăgubiri și pașii de urmat după un accident — explicate pe înțelesul tuturor de un expert tehnic judiciar autorizat.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return <BlogListClient />;
}
