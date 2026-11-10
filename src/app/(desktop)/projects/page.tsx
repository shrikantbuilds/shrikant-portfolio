import type { Metadata } from "next";
import { ProjectShowcase } from "@/components/site/ProjectShowcase";
import { Reveal } from "@/components/site/Reveal";
import { loadBundle } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const { projects } = await loadBundle();
  return (
    <Reveal>
      <section className="panel panel-pad">
        <p className="page-kicker">Projects</p>
        <h1 className="page-title">Selected systems work</h1>
        <p className="page-lead">
          Logistics visibility, routing, and observability — public detail only.
        </p>
        <div style={{ marginTop: "1.4rem" }}>
          <ProjectShowcase projects={projects} />
        </div>
      </section>
    </Reveal>
  );
}
