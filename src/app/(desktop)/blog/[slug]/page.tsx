import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownView } from "@/components/MarkdownView";
import { Reveal } from "@/components/site/Reveal";
import { findBySlug, loadBundle } from "@/lib/content";
import { mediaUrl } from "@/lib/media";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { posts } = await loadBundle();
  const post = findBySlug(posts, slug);
  if (!post) return { title: "Blog" };
  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bundle = await loadBundle();
  const post = findBySlug(bundle.posts, slug);
  if (!post) {
    if (bundle.source === "unavailable") {
      return <p className="banner">This post could not be loaded.</p>;
    }
    notFound();
  }

  const cover = mediaUrl(post.cover_path);

  return (
    <Reveal>
      <article className="panel panel-pad">
        <p className="page-kicker">
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString("en", { dateStyle: "medium" })
            : "Note"}
        </p>
        <h1 className="page-title">{post.title}</h1>
        <p className="page-lead">{post.excerpt}</p>
        {post.tags.length > 0 ? (
          <p>
            {post.tags.map((tag) => (
              <span key={tag} className="chip" style={{ marginRight: "0.35rem" }}>
                {tag}
              </span>
            ))}
          </p>
        ) : null}
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" style={{ width: "100%", borderRadius: "1rem", marginTop: "0.8rem" }} />
        ) : null}
        <div style={{ marginTop: "1rem" }}>
          <MarkdownView source={post.body_md} />
        </div>
        <Link className="btn-ghost" href="/blog" style={{ marginTop: "1.2rem" }}>
          All notes
        </Link>
      </article>
    </Reveal>
  );
}
