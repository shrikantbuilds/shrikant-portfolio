import type { Metadata } from "next";
import { Reveal } from "@/components/site/Reveal";
import { SkillsShowcase } from "@/components/site/SkillsShowcase";
import { loadBundle } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = { title: "Skills" };

export default async function SkillsPage() {
  const { skills, projects } = await loadBundle();
  return (
    <Reveal>
      <SkillsShowcase skills={skills} projects={projects} />
    </Reveal>
  );
}
