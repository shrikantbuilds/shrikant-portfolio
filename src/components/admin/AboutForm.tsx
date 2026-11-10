"use client";

import { FormEvent, useEffect, useState } from "react";
import { FileButton } from "@/components/admin/FileButton";
import { mediaUrl } from "@/lib/media";
import { refreshPublicSite } from "@/lib/revalidate-public";
import { splitList } from "@/lib/slug";
import { browserSupabase } from "@/lib/supabase/browser";
import type { SiteSettings } from "@/lib/types";

export function AboutForm() {
  const [about, setAbout] = useState("");
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState("");
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = browserSupabase();
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    supabase
      .from("site_settings")
      .select("about_md, location, interests, photo_path")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error: loadError }) => {
        if (loadError) {
          setError(loadError.message);
          return;
        }
        const row = data as Pick<SiteSettings, "about_md" | "location" | "interests" | "photo_path"> | null;
        setAbout(row?.about_md ?? "");
        setLocation(row?.location ?? "");
        setInterests((row?.interests ?? []).join(", "));
        setPhoto(row?.photo_path ?? "");
        setReady(true);
      });
  }, []);

  async function persist(next: {
    about_md?: string;
    location?: string;
    interests?: string[];
    photo_path?: string;
  }) {
    const supabase = browserSupabase();
    if (!supabase) return "Supabase is not configured.";
    const { error: saveError } = await supabase.from("site_settings").update(next).eq("id", 1);
    if (saveError) return saveError.message;
    await refreshPublicSite();
    return "";
  }

  async function onSave(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNote("");
    const message = await persist({
      about_md: about,
      location,
      interests: splitList(interests),
      photo_path: photo,
    });
    setBusy(false);
    if (message) {
      setError(message);
      return;
    }
    setNote("Saved. Refresh the public About page to see it.");
  }

  async function onPhotoUploaded(next: string) {
    setPhoto(next);
    setError("");
    setNote("");
    const message = await persist({ photo_path: next });
    if (message) {
      setError(message);
      return;
    }
    setNote("Photo uploaded and saved.");
  }

  async function onRemovePhoto() {
    setPhoto("");
    const message = await persist({ photo_path: "" });
    if (message) {
      setError(message);
      return;
    }
    setNote("Photo removed.");
  }

  if (!ready) return <p className="os-muted">{error || "Loading about…"}</p>;

  return (
    <form onSubmit={onSave} className="os-card">
      <h1 style={{ marginTop: 0 }}>About</h1>
      <p className="os-muted">Story, photo, location, and interests for the About page.</p>
      <label className="os-field">
        <span>Location</span>
        <input value={location} onChange={(event) => setLocation(event.target.value)} />
      </label>
      <label className="os-field">
        <span>Interests</span>
        <input value={interests} onChange={(event) => setInterests(event.target.value)} />
        <span>Comma separated.</span>
      </label>
      <label className="os-field">
        <span>Story (Markdown)</span>
        <textarea rows={12} value={about} onChange={(event) => setAbout(event.target.value)} />
      </label>
      <div className="os-field">
        <span>Photo</span>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl(photo)} alt="" style={{ width: "8rem", borderRadius: "0.8rem" }} />
        ) : (
          <p className="os-muted" style={{ margin: 0 }}>
            No photo yet. Upload one for Home and About.
          </p>
        )}
        <FileButton accept="image/*" folder="photos" kind="image" label="Upload photo" onUploaded={onPhotoUploaded} />
        {photo ? (
          <button type="button" className="os-text-button" onClick={() => void onRemovePhoto()}>
            Remove photo
          </button>
        ) : null}
      </div>
      <button className="os-button" type="submit" disabled={busy}>
        {busy ? "Saving…" : "Save about"}
      </button>
      {error ? <p className="os-error">{error}</p> : null}
      {note ? <p className="os-ok">{note}</p> : null}
    </form>
  );
}
