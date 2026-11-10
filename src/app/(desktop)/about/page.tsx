import type { Metadata } from "next";
import { AboutPage } from "@/components/site/AboutPage";
import { loadBundle } from "@/lib/content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await loadBundle();
  return {
    title: "About",
    description: settings.intro,
  };
}

export default async function AboutRoutePage() {
  const bundle = await loadBundle();
  return <AboutPage bundle={bundle} />;
}
