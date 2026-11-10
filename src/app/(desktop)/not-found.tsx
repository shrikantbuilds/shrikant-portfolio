import Link from "next/link";

export default function SiteNotFound() {
  return (
    <section className="panel panel-pad">
      <p className="page-kicker">404</p>
      <h1 className="page-title">Page not found</h1>
      <p className="page-lead">That route is not part of this portfolio.</p>
      <Link className="btn" href="/">
        Back home
      </Link>
    </section>
  );
}
