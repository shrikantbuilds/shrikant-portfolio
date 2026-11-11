import type { Metadata } from "next";
import { ContactPage } from "@/components/site/ContactPage";
import { loadBundle } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = { title: "Contact" };

export default async function ContactRoute() {
  const { settings } = await loadBundle();
  return <ContactPage settings={settings} />;
}
