"use client";

import { useState } from "react";
import { EditIconButton, EditToolbar } from "@/components/edit/EditControls";
import { ResumeEditor } from "@/components/edit/editors";
import { Reveal } from "@/components/site/Reveal";
import { mediaUrl } from "@/lib/media";

export function ResumeView({ resumePath }: { resumePath: string }) {
  const file = mediaUrl(resumePath);
  const [editing, setEditing] = useState(false);

  return (
    <Reveal>
      <section className="panel panel-pad resume-page">
        <EditToolbar title="Resume">
          <EditIconButton label="Edit resume" kind="edit" onClick={() => setEditing(true)} />
        </EditToolbar>
        <p className="page-kicker">Resume</p>
        <h1 className="page-title">Resume</h1>
        <p className="page-lead">A short PDF overview of my experience and skills.</p>

        {file ? (
          <>
            <div className="resume-actions">
              <a className="btn" href={file} target="_blank" rel="noreferrer">
                Open PDF
              </a>
              <a className="btn-ghost" href={file} download>
                Download
              </a>
            </div>
            <iframe title="Resume PDF" src={file} className="resume-frame" />
          </>
        ) : (
          <p className="muted resume-empty">No resume uploaded yet. Sign in and use Edit to add a PDF.</p>
        )}
      </section>

      <ResumeEditor open={editing} onClose={() => setEditing(false)} path={resumePath} />
    </Reveal>
  );
}
