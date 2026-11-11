"use client";

import { useState } from "react";
import { MarkdownView } from "@/components/MarkdownView";
import { EditIconButton, EditToolbar } from "@/components/edit/EditControls";
import { AboutEditor } from "@/components/edit/editors";
import { Reveal } from "@/components/site/Reveal";
import { mediaUrl } from "@/lib/media";
import type { DesktopBundle } from "@/lib/types";

export function AboutPage({ bundle }: { bundle: DesktopBundle }) {
  const { settings } = bundle;
  const photo = mediaUrl(settings.photo_path);
  const [editing, setEditing] = useState(false);
  const initials = (settings.name || "AR")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <Reveal>
      <section className="about-page">
        <EditToolbar title="About">
          <EditIconButton label="Edit about" kind="edit" onClick={() => setEditing(true)} />
        </EditToolbar>

        <header className="panel panel-pad about-hero">
          <p className="page-kicker">About Me</p>
          <div className="about-layout">
            <div className="about-photo-wrap">
              <div className="about-photo-ring" aria-hidden="true" />
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt={settings.name} className="about-photo" />
              ) : (
                <div className="about-photo about-photo-empty" role="img" aria-label="Photo placeholder">
                  <span className="about-photo-initials">{initials || "AR"}</span>
                  <span className="about-photo-hint">Add your photo with Edit</span>
                </div>
              )}
            </div>

            <div className="about-copy">
              <h1 className="page-title">{settings.name}</h1>
              <p className="about-role">{settings.role_line || "Software Developer"}</p>
              {settings.location ? (
                <p className="about-location">
                  <LocationPin />
                  {settings.location}
                </p>
              ) : null}
            </div>
          </div>
        </header>

        <div className="panel panel-pad about-story">
          <h2 className="about-section-title">My story</h2>
          <div className="about-body">
            <MarkdownView source={settings.about_md || settings.intro} />
          </div>
          {settings.interests.length > 0 ? (
            <div className="about-interests-block">
              <h3 className="about-section-title about-section-title-sm">Interests</h3>
              <div className="about-interests">
                {settings.interests.map((interest) => (
                  <span key={interest} className="chip">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <AboutEditor open={editing} onClose={() => setEditing(false)} settings={settings} />
      </section>
    </Reveal>
  );
}

function LocationPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}
