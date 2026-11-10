import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import { loadBundle } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = { title: "System Design" };

export default async function DesignsPage() {
  const { designs } = await loadBundle();
  return (
    <Reveal>
      <section className="panel panel-pad">
        <p className="page-kicker">System design</p>
        <h1 className="page-title">Architecture notes</h1>
        <p className="page-lead">Optional deep-dives. Edit them in Admin.</p>
        <div className="blog-list" style={{ marginTop: "1.2rem" }}>
          {designs.length === 0 ? <p className="muted">No published designs yet.</p> : null}
          {designs.map((design) => (
            <Link key={design.id} href={`/system-design/${design.slug}`} className="blog-item blog-item-plain">
              <div>
                <h2 style={{ margin: "0 0 0.35rem", fontSize: "1.15rem" }}>{design.title}</h2>
                <p className="muted" style={{ margin: 0 }}>
                  {design.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
