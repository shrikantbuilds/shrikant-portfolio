import type { Metadata } from "next";
import { Reveal } from "@/components/site/Reveal";
import { loadBundle } from "@/lib/content";
import { mediaUrl } from "@/lib/media";

export const revalidate = 60;
export const metadata: Metadata = { title: "Resume" };

export default async function ResumePage() {
  const { settings } = await loadBundle();
  const file = mediaUrl(settings.resume_path);

  return (
    <Reveal>
      <section className="panel panel-pad resume-page">
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
          <p className="muted resume-empty">
            No resume uploaded yet. Add the PDF from Admin / Resume.
          </p>
        )}
      </section>
    </Reveal>
  );
}
