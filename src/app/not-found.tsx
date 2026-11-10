import Link from "next/link";
import { PortfolioShell } from "@/components/site/PortfolioShell";
import { loadBundle } from "@/lib/content";

export default async function NotFound() {
  const bundle = await loadBundle();
  return (
    <PortfolioShell bundle={bundle}>
      <section className="panel panel-pad">
        <p className="page-kicker">404</p>
        <h1 className="page-title">Page not found</h1>
        <p className="page-lead">That route is not part of this portfolio.</p>
        <Link className="btn" href="/">
          Back home
        </Link>
      </section>
    </PortfolioShell>
  );
}
