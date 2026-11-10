import type { Metadata } from "next";
import { ExperienceTimeline } from "@/components/site/ExperienceTimeline";
import { Reveal } from "@/components/site/Reveal";
import { loadBundle } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = { title: "Experience" };

export default async function ExperiencePage() {
  const { experience } = await loadBundle();
  return (
    <Reveal>
      <ExperienceTimeline items={experience} />
    </Reveal>
  );
}
