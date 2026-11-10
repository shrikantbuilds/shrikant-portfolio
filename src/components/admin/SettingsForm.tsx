"use client";

import { FormEvent, useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/types";
import { refreshPublicSite } from "@/lib/revalidate-public";
import { browserSupabase } from "@/lib/supabase/browser";

export function SettingsForm() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = browserSupabase();
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error: loadError }) => {
        if (loadError) {
          setError(loadError.message);
          return;
        }
        setSettings(data as SiteSettings | null);
      });
  }, []);

  function setField(key: keyof SiteSettings, value: string) {
    setSettings((current) => (current ? { ...current, [key]: value } : current));
  }

  async function onSave(event: FormEvent) {
    event.preventDefault();
    const supabase = browserSupabase();
    if (!supabase || !settings) return;
    setBusy(true);
    setError("");
    setNote("");
    const { error: saveError } = await supabase
      .from("site_settings")
      .update({
        name: settings.name,
        role_line: settings.role_line,
        headline: settings.headline,
        intro: settings.intro,
        location: settings.location,
        email: settings.email,
        github_url: settings.github_url,
        linkedin_url: settings.linkedin_url,
        seo_title: settings.seo_title,
        seo_description: settings.seo_description,
      })
      .eq("id", 1);
    setBusy(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    await refreshPublicSite();
    setNote("Saved. Refresh the public site to see it.");
  }

  if (!settings) return <p className="os-muted">{error || "Loading settings…"}</p>;

  return (
    <form onSubmit={onSave} className="os-card">
      <h1 style={{ marginTop: 0 }}>Settings</h1>
      <p className="os-muted">Name, role, intro, and contact links used across the site.</p>
      {(
        [
          ["name", "Name"],
          ["role_line", "Role"],
          ["headline", "Headline"],
          ["intro", "Intro"],
          ["location", "Location"],
          ["email", "Email"],
          ["github_url", "GitHub URL"],
          ["linkedin_url", "LinkedIn URL"],
          ["seo_title", "SEO title"],
          ["seo_description", "SEO description"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="os-field">
          <span>{label}</span>
          {key === "intro" || key === "seo_description" ? (
            <textarea rows={3} value={settings[key]} onChange={(event) => setField(key, event.target.value)} />
          ) : (
            <input value={settings[key]} onChange={(event) => setField(key, event.target.value)} />
          )}
        </label>
      ))}
      <div style={{ marginTop: "1rem" }}>
        <button className="os-button" type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save settings"}
        </button>
      </div>
      {error ? <p className="os-error">{error}</p> : null}
      {note ? <p className="os-ok">{note}</p> : null}
    </form>
  );
}
