"use client";

import { useState } from "react";
import { browserSupabase } from "@/lib/supabase/browser";

export async function uploadMedia(file: File, folder: string, kind: "image" | "pdf") {
  const supabase = browserSupabase();
  if (!supabase) throw new Error("Supabase is not configured.");

  const limit = kind === "pdf" ? 8_000_000 : 5_000_000;
  if (file.size > limit) {
    throw new Error(kind === "pdf" ? "Keep the PDF under 8 MB." : "Keep images under 5 MB.");
  }

  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type || (kind === "pdf" ? "application/pdf" : "application/octet-stream"),
  });
  if (uploadError) throw new Error(uploadError.message);

  const { error: rowError } = await supabase.from("media").insert({ path, alt: file.name, kind });
  if (rowError) {
    await supabase.storage.from("media").remove([path]);
    throw new Error(rowError.message);
  }
  return path;
}

export function FileButton({
  accept,
  folder,
  kind,
  label,
  onUploaded,
}: {
  accept: string;
  folder: string;
  kind: "image" | "pdf";
  label: string;
  onUploaded: (path: string) => void;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div>
      <label className="os-button-ghost" style={{ display: "inline-flex", cursor: "pointer" }}>
        {busy ? "Uploading…" : label}
        <input
          type="file"
          accept={accept}
          style={{ display: "none" }}
          disabled={busy}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            setBusy(true);
            setError("");
            try {
              onUploaded(await uploadMedia(file, folder, kind));
            } catch (reason) {
              setError(reason instanceof Error ? reason.message : "Upload failed.");
            } finally {
              setBusy(false);
            }
          }}
        />
      </label>
      {error ? <p className="os-error">{error}</p> : null}
    </div>
  );
}
