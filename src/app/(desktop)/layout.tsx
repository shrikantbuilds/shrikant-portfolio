import { PortfolioShell } from "@/components/site/PortfolioShell";
import { loadBundle } from "@/lib/content";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const bundle = await loadBundle();
  return <PortfolioShell bundle={bundle}>{children}</PortfolioShell>;
}
