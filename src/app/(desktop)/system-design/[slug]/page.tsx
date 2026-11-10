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
  const { designs } = await loadBundle();
  const design = findBySlug(designs, slug);
  if (!design) return { title: "System Design" };
  return { title: design.title, description: design.summary };
}

export default async function DesignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bundle = await loadBundle();
  const design = findBySlug(bundle.designs, slug);
  if (!design) {
    if (bundle.source === "unavailable") {
      return <p className="banner">This design could not be loaded.</p>;
    }
    notFound();
  }

  const diagram = mediaUrl(design.diagram_path);

  return (
    <Reveal>
      <article className="panel panel-pad">
        <p className="page-kicker">System design</p>
        <h1 className="page-title">{design.title}</h1>
        <p className="page-lead">{design.summary}</p>
        {diagram ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={diagram} alt="" style={{ width: "100%", borderRadius: "1rem" }} />
        ) : null}
        <MarkdownView source={design.body_md} />
        {design.tradeoffs_md ? (
          <>
            <h2>Trade-offs</h2>
            <MarkdownView source={design.tradeoffs_md} />
          </>
        ) : null}
        <Link className="btn-ghost" href="/system-design">
          All designs
        </Link>
      </article>
    </Reveal>
  );
}
