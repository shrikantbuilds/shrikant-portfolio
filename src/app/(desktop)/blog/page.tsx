import type { Metadata } from "next";
import { BlogList } from "@/components/site/BlogList";
import { loadBundle } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = { title: "Blog" };

export default async function BlogPage() {
  const { posts } = await loadBundle();
  return <BlogList posts={posts} />;
}
