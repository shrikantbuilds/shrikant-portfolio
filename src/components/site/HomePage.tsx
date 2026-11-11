"use client";

import Link from "next/link";
import { useState } from "react";
import { EditIconButton, EditToolbar } from "@/components/edit/EditControls";
import { SettingsEditor } from "@/components/edit/editors";
import { HomePortraitOrbit } from "@/components/site/HomePortraitOrbit";
import { mediaUrl } from "@/lib/media";
import type { DesktopBundle } from "@/lib/types";

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "Alex", last: "Rivera" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

export function HomePage({ bundle }: { bundle: DesktopBundle }) {
  const { settings } = bundle;
  const photo = mediaUrl(settings.photo_path);
  const { first, last } = splitName(settings.name || "Alex Rivera");
  const role = settings.role_line || "Software Developer";
  const [editing, setEditing] = useState(false);

  return (
    <section className="home-hero">
      <EditToolbar title="Home">
        <EditIconButton label="Edit profile" kind="edit" onClick={() => setEditing(true)} />
      </EditToolbar>

      <div className="home-hero-grid">
        <div className="home-copy">
          <p className="home-hi">Hi, I&apos;m</p>
          <h1 className="home-name">
            {first}
            {last ? (
              <>
                {" "}
                <span className="home-name-accent">{last}</span>
              </>
            ) : null}
          </h1>

          <p className="home-role">{role}</p>
          <p className="page-lead home-intro">{settings.intro}</p>

          {settings.location ? (
            <p className="home-meta">
              <span>
                <MetaPin />
                {settings.location}
              </span>
            </p>
          ) : null}

          <div className="home-actions">
            <Link className="btn home-btn-primary" href="/projects">
              View projects
            </Link>
            <Link className="btn-ghost" href="/about">
              About
            </Link>
            <Link className="btn-ghost" href="/contact">
              Contact
            </Link>
          </div>
        </div>

        <HomePortraitOrbit photoUrl={photo} name={settings.name} />
      </div>

      <SettingsEditor open={editing} onClose={() => setEditing(false)} settings={settings} mode="home" />
    </section>
  );
}

function MetaPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}
