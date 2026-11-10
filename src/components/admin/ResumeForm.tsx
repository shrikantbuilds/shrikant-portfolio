"use client";

import { useEffect, useState } from "react";
import { FileButton } from "@/components/admin/FileButton";
import { mediaUrl } from "@/lib/media";
import { refreshPublicSite } from "@/lib/revalidate-public";
import { browserSupabase } from "@/lib/supabase/browser";

export function ResumeForm() {
  const [path, setPath] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = browserSupabase();
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    supabase
      .from("site_settings")
      .select("resume_path")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error: loadError }) => {
        if (loadError) {
          setError(loadError.message);
          return;
        }
        setPath((data as { resume_path?: string } | null)?.resume_path ?? "");
        setReady(true);
      });
  }, []);

  async function save(next: string) {
    const supabase = browserSupabase();
    if (!supabase) return;
    setError("");
    setNote("");
    const { error: saveError } = await supabase.from("site_settings").update({ resume_path: next }).eq("id", 1);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setPath(next);
    await refreshPublicSite();
    setNote(next ? "Resume saved. Refresh /resume to see it." : "Resume removed.");
  }

  if (!ready) return <p className="os-muted">{error || "Loading resume…"}</p>;

  const file = mediaUrl(path);

  return (
    <section className="os-card">
      <h1 style={{ marginTop: 0 }}>Resume</h1>
      <p className="os-muted">PDF only, under 8 MB. Shown on the public Resume page.</p>
      {file ? (
        <p>
          <a href={file} target="_blank" rel="noreferrer">
            Open current PDF
          </a>
        </p>
      ) : (
        <p className="os-muted">No file yet.</p>
      )}
      <FileButton
        accept="application/pdf"
        folder="resume"
        kind="pdf"
        label="Upload PDF"
        onUploaded={(next) => {
          void save(next);
        }}
      />
      {path ? (
        <button type="button" className="os-text-button" onClick={() => void save("")}>
          Remove resume
        </button>
      ) : null}
      {error ? <p className="os-error">{error}</p> : null}
      {note ? <p className="os-ok">{note}</p> : null}
    </section>
  );
}
