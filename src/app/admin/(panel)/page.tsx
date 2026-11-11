import Link from "next/link";

export default function AdminHomePage() {
  return (
    <section className="os-card">
      <h1 style={{ marginTop: 0 }}>Edit on the website</h1>
      <p className="os-muted">
        Content is edited on the public pages. Sign in, open any page, and use <strong>Edit</strong>,{" "}
        <strong>Add</strong>, or <strong>Delete</strong> there.
      </p>
      <ul className="os-muted" style={{ lineHeight: 1.7 }}>
        <li>Home — profile, intro, photo</li>
        <li>About — story, interests, photo</li>
        <li>Projects / Experience / Skills / Blog — add, edit, delete items</li>
        <li>Resume — upload or remove PDF</li>
        <li>Contact — email and social links</li>
      </ul>
      <p>
        <Link className="os-button" href="/">
          Open site
        </Link>
      </p>
    </section>
  );
}
