import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import { loadBundle } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = { title: "Blog" };

function readingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 180))} min read`;
}

export default async function BlogPage() {
  const { posts } = await loadBundle();

  return (
    <Reveal>
      <section className="panel panel-pad">
        <p className="page-kicker">Blog</p>
        <h1 className="page-title">Engineering notes</h1>
        <p className="page-lead">Short writing on systems, routing, caching, and observability.</p>

        <div className="blog-list" style={{ marginTop: "1.3rem" }}>
          {posts.length === 0 ? <p className="muted">No published posts yet.</p> : null}
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="blog-item blog-item-plain">
              <div>
                <h2 style={{ margin: "0 0 0.35rem", fontSize: "1.15rem" }}>{post.title}</h2>
                <p className="muted" style={{ margin: 0 }}>
                  {post.excerpt}
                </p>
                <p className="muted" style={{ margin: "0.45rem 0 0", fontSize: "0.85rem" }}>
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString("en", { dateStyle: "medium" })
                    : ""}
                  {" · "}
                  {readingTime(post.body_md)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
