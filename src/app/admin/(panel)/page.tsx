import Link from "next/link";

const sections = [
  ["Settings", "/admin/settings", "Name, role, intro, location, and links."],
  ["About", "/admin/about", "Story, photo, and interests."],
  ["Resume", "/admin/resume", "Upload the PDF for the Resume page."],
  ["Projects", "/admin/projects", "Case studies, covers, and links."],
  ["System designs", "/admin/designs", "Optional architecture notes."],
  ["Experience", "/admin/experience", "Roles and education."],
  ["Skills", "/admin/skills", "What you use each skill for."],
  ["Blog", "/admin/posts", "Short posts and covers."],
];

export default function AdminHomePage() {
  return (
    <section>
      <h1 style={{ marginTop: 0 }}>Edit your site</h1>
      <p className="os-muted">
        Changes save to Supabase. After Save, refresh the public page to confirm. Drafts stay hidden until Published
        is checked.
      </p>
      <div className="os-list">
        {sections.map(([label, href, text]) => (
          <Link key={href} href={href} className="os-row">
            <h2>{label}</h2>
            <p className="os-muted" style={{ margin: 0 }}>
              {text}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
