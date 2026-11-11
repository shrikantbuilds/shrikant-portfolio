import type { Metadata } from "next";
import { ResumeView } from "@/components/site/ResumeView";
import { loadBundle } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = { title: "Resume" };

export default async function ResumePage() {
  const { settings } = await loadBundle();
  return <ResumeView resumePath={settings.resume_path} />;
}
