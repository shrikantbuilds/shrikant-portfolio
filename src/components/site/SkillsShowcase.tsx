import Link from "next/link";
import { TechIcon } from "@/components/site/TechIcon";
import { resolveTech, SKILL_GROUPS } from "@/lib/tech";
import type { Project, Skill } from "@/lib/types";

export function SkillsShowcase({
  skills,
  projects,
}: {
  skills: Skill[];
  projects: Project[];
}) {
  const byName = new Map(skills.map((skill) => [skill.name.toLowerCase(), skill]));

  return (
    <div className="skills-page">
      <header className="panel panel-pad">
        <p className="page-kicker">Skills</p>
        <h1 className="page-title">Technologies I work with</h1>
        <p className="page-lead">Grouped by craft. No percentage bars. Linked to projects when relevant.</p>
      </header>

      <div className="skills-groups">
        {SKILL_GROUPS.map((group) => (
          <section key={group.title} className="skills-group panel panel-pad">
            <div className="skills-group-head">
              <h2>{group.title}</h2>
            </div>
            <div className="skills-tile-grid">
              {group.items.map((item) => {
                const skill = byName.get(item.toLowerCase());
                const tech = resolveTech(item);
                return (
                  <article key={item} className="skills-tile">
                    <div className="skills-tile-top">
                      <span className="skills-tile-logo">
                        <TechIcon label={item} size={22} />
                      </span>
                      <h3>{tech.name}</h3>
                    </div>
                    {skill?.usage ? <p className="muted">{skill.usage}</p> : null}
                    {skill?.project_slugs?.length ? (
                      <div className="skills-projects">
                        {skill.project_slugs.map((slug) => {
                          const project = projects.find((entry) => entry.slug === slug);
                          return project ? (
                            <Link key={slug} href={`/projects/${slug}`} className="chip">
                              {project.title}
                            </Link>
                          ) : null;
                        })}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
