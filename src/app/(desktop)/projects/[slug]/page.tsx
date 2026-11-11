import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/site/ProjectDetail";
import { findBySlug, loadBundle } from "@/lib/content";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { projects } = await loadBundle();
  const project = findBySlug(projects, slug);
  if (!project) return { title: "Project" };
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bundle = await loadBundle();
  const project = findBySlug(bundle.projects, slug);
  if (!project) {
    if (bundle.source === "unavailable") {
      return <p className="banner">This project could not be loaded.</p>;
    }
    notFound();
  }

  return <ProjectDetail project={project} />;
}
