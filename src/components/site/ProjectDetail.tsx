"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MarkdownView } from "@/components/MarkdownView";
import { EditIconButton, EditToolbar } from "@/components/edit/EditControls";
import { ProjectEditor } from "@/components/edit/editors";
import { Reveal } from "@/components/site/Reveal";
import { TechLogo } from "@/components/site/TechLogo";
import { mediaUrl } from "@/lib/media";
import type { Project } from "@/lib/types";

export function ProjectDetail({ project }: { project: Project }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const cover = mediaUrl(project.cover_path);

  return (
    <Reveal>
      <article className="panel panel-pad">
        <EditToolbar title="Project">
          <EditIconButton label="Edit project" kind="edit" onClick={() => setEditing(true)} />
        </EditToolbar>
        <p className="page-kicker">
          {[project.category, project.year, project.role].filter(Boolean).join(" · ")}
        </p>
        <h1 className="page-title">{project.title}</h1>
        <p className="page-lead">{project.summary}</p>
        <div className="tech-row" style={{ marginTop: "1rem" }}>
          {project.stack.map((item) => (
            <TechLogo key={item} label={item} withName />
          ))}
        </div>
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            style={{ width: "100%", borderRadius: "1rem", marginTop: "1.2rem", border: "1px solid var(--line)" }}
          />
        ) : null}
        <div style={{ marginTop: "1.2rem" }}>
          <MarkdownView source={project.body_md} />
        </div>
        {project.gallery.length > 0 ? (
          <div className="grid gap-3" style={{ marginTop: "1rem" }}>
            {project.gallery.map((path) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={path} src={mediaUrl(path)} alt="" style={{ width: "100%", borderRadius: "0.9rem" }} />
            ))}
          </div>
        ) : null}
        <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap", marginTop: "1.4rem" }}>
          {project.live_url ? (
            <a className="btn" href={project.live_url} target="_blank" rel="noreferrer">
              Live
            </a>
          ) : null}
          {project.github_url ? (
            <a className="btn-ghost" href={project.github_url} target="_blank" rel="noreferrer">
              GitHub
            </a>
          ) : null}
          <Link className="btn-ghost" href="/projects">
            All projects
          </Link>
        </div>
      </article>

      <ProjectEditor
        open={editing}
        onClose={() => {
          setEditing(false);
          router.refresh();
        }}
        initial={project}
      />
    </Reveal>
  );
}
