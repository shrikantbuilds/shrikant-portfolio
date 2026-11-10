import { TechLogo } from "@/components/site/TechLogo";
import type { ExperienceItem } from "@/lib/types";

function isEducation(item: ExperienceItem) {
  const hay = `${item.role_title} ${item.org}`.toLowerCase();
  return /b\.?e\.?|bachelor|graduate|university|college|education|degree/.test(hay);
}

function isCurrent(item: ExperienceItem) {
  return /present|now|current/i.test(item.end_label || "");
}

function techFor(item: ExperienceItem) {
  const hay = `${item.role_title} ${item.org} ${item.summary}`.toLowerCase();
  if (hay.includes("control tower") || hay.includes("observability") || hay.includes("ftms")) {
    return ["Python", "Frappe", "JavaScript", "Grafana", "Docker"];
  }
  if (hay.includes("intern") || hay.includes("web development")) {
    return ["JavaScript", "Vue.js", "Python"];
  }
  return [];
}

function bullets(summary: string) {
  return summary
    .split("\n")
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
}

function orgInitials(org: string) {
  const parts = org.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "•";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function ExperienceTimeline({ items }: { items: ExperienceItem[] }) {
  const work = items.filter((item) => !isEducation(item));
  const education = items.filter((item) => isEducation(item));

  return (
    <div className="exp-page">
      <header className="exp-banner exp-banner-simple">
        <div className="exp-banner-copy">
          <p className="exp-pill">Experience</p>
          <h1 className="exp-title">Work experience</h1>
          <p className="page-lead">Roles and the systems I shipped along the way.</p>
        </div>
      </header>

      {work.length > 0 ? (
        <section className="exp-section">
          <div className="exp-rail">
            {work.map((item, index) => (
              <WorkCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </section>
      ) : null}

      {education.length > 0 ? (
        <section className="exp-section">
          <div className="exp-section-head">
            <p className="exp-pill">Education</p>
            <h2 className="exp-title exp-title-sm">Education</h2>
          </div>
          <div className="exp-edu-list">
            {education.map((item) => (
              <EducationCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      {items.length === 0 ? <p className="muted panel panel-pad">No published experience yet.</p> : null}
    </div>
  );
}

function WorkCard({ item, index }: { item: ExperienceItem; index: number }) {
  const current = isCurrent(item);
  const tech = techFor(item);
  const points = bullets(item.summary);

  return (
    <article className="exp-work" data-current={current ? "true" : "false"}>
      <div className="exp-marker" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </div>
      <div className="exp-work-card exp-work-card-plain">
        <div className="exp-work-main">
          <div className="exp-work-head">
            <div className="exp-org-badge" aria-hidden="true">
              {orgInitials(item.org || item.role_title)}
            </div>
            <div>
              <h3>{item.role_title}</h3>
              {item.org ? <p className="exp-org">{item.org}</p> : null}
              <div className="exp-date-row">
                <span className="chip">
                  {item.start_label}
                  {item.end_label ? ` – ${item.end_label}` : ""}
                </span>
                {current ? (
                  <span className="chip exp-live">
                    <i /> Current
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {points.length > 0 ? (
            <ul className="exp-points">
              {points.map((point) => (
                <li key={point}>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {tech.length > 0 ? (
            <div className="exp-stack">
              <p className="exp-stack-label">Tech Stack</p>
              <div className="tech-row">
                {tech.map((label) => (
                  <TechLogo key={label} label={label} withName />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function EducationCard({ item }: { item: ExperienceItem }) {
  const major = item.role_title.replace(/^b\.?e\.?\s*(in)?\s*/i, "").trim() || "Computer Engineering";
  const degree = /b\.?e\.?/i.test(item.role_title) ? "Bachelor of Engineering (B.E.)" : item.role_title;

  return (
    <article className="exp-edu-card">
      <div className="exp-edu-copy">
        <h3>{degree}</h3>
        <p className="exp-org">{major}</p>
        {item.org ? <p className="muted">{item.org}</p> : null}
      </div>
      <div className="exp-edu-meta">
        <span className="chip">
          {item.start_label}
          {item.end_label ? ` – ${item.end_label}` : ""}
        </span>
      </div>
    </article>
  );
}
