"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TechLogo } from "@/components/site/TechLogo";
import { mediaUrl } from "@/lib/media";
import type { Project } from "@/lib/types";

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const categories = useMemo(() => {
    const set = new Set(projects.map((project) => project.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [projects]);
  const [category, setCategory] = useState("All");
  const visible =
    category === "All" ? projects : projects.filter((project) => project.category === category);

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "1rem" }}>
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className="chip"
            data-active={item === category}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="feature-rail">
        {visible.length === 0 ? <p className="muted">No published projects in this filter.</p> : null}
        {visible.map((project) => (
          <Link key={project.id} href={`/projects/${project.slug}`} className="project-card">
            <div className="project-art">
              {project.cover_path ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl(project.cover_path)} alt="" />
              ) : (
                <span>{project.title.slice(0, 1)}</span>
              )}
            </div>
            <div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                <span className="chip">{project.category || "Work"}</span>
                {project.year ? <span className="chip">{project.year}</span> : null}
              </div>
              <h2 style={{ margin: "0.6rem 0 0.35rem", fontSize: "1.25rem" }}>{project.title}</h2>
              <p className="muted" style={{ margin: 0, lineHeight: 1.55 }}>
                {project.summary}
              </p>
            </div>
            <div className="tech-row">
              {project.stack.map((item) => (
                <TechLogo key={item} label={item} withName />
              ))}
            </div>
            <span className="btn-ghost" style={{ justifySelf: "start", minHeight: "2.2rem" }}>
              View details
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
