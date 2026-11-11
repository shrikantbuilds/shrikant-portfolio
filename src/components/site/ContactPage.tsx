"use client";

import { useState } from "react";
import { ContactForm } from "@/components/ContactForm";
import { EditIconButton, EditToolbar } from "@/components/edit/EditControls";
import { SettingsEditor } from "@/components/edit/editors";
import { Reveal } from "@/components/site/Reveal";
import type { SiteSettings } from "@/lib/types";

type ContactLink = {
  href: string;
  label: string;
  kind: "Email" | "LinkedIn" | "GitHub";
};

export function ContactPage({ settings }: { settings: SiteSettings }) {
  const [editing, setEditing] = useState(false);
  const links = [
    settings.email ? { href: `mailto:${settings.email}`, label: settings.email, kind: "Email" as const } : null,
    settings.linkedin_url ? { href: settings.linkedin_url, label: "linkedin.com", kind: "LinkedIn" as const } : null,
    settings.github_url ? { href: settings.github_url, label: "github.com", kind: "GitHub" as const } : null,
  ].filter((link): link is ContactLink => Boolean(link));

  return (
    <Reveal>
      <section className="contact-page">
        <EditToolbar title="Contact">
          <EditIconButton label="Edit contact" kind="edit" onClick={() => setEditing(true)} />
        </EditToolbar>

        <header className="panel panel-pad contact-hero">
          <p className="page-kicker">Contact</p>
          <h1 className="page-title">Let&apos;s talk</h1>
          <p className="page-lead">
            Open to conversations about systems, logistics, and backend work. Prefer email or the form —
            I usually reply within a day.
          </p>
        </header>

        <div className="contact-grid">
          <aside className="panel panel-pad contact-aside">
            <h2 className="contact-aside-title">Reach me</h2>
            <div className="contact-list">
              {links.length === 0 ? (
                <div className="contact-card contact-card-static">
                  <strong>Details</strong>
                  <p className="muted">Add email, LinkedIn, and GitHub with Edit.</p>
                </div>
              ) : null}
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="contact-card"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                >
                  <span className="contact-icon" aria-hidden="true">
                    <ContactIcon kind={link.kind} />
                  </span>
                  <span>
                    <strong>{link.kind}</strong>
                    <span className="muted">{link.label}</span>
                  </span>
                </a>
              ))}
              {settings.location ? (
                <div className="contact-card contact-card-static">
                  <span className="contact-icon" aria-hidden="true">
                    <ContactIcon kind="Location" />
                  </span>
                  <span>
                    <strong>Location</strong>
                    <span className="muted">{settings.location}</span>
                  </span>
                </div>
              ) : null}
            </div>
          </aside>

          <div className="panel panel-pad contact-form-panel">
            <h2 className="contact-aside-title">Send a message</h2>
            <p className="muted contact-form-lead">Tell me a bit about what you&apos;re building.</p>
            <ContactForm email={settings.email} />
          </div>
        </div>

        <SettingsEditor open={editing} onClose={() => setEditing(false)} settings={settings} mode="contact" />
      </section>
    </Reveal>
  );
}

function ContactIcon({ kind }: { kind: "Email" | "LinkedIn" | "GitHub" | "Location" }) {
  if (kind === "Email") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }
  if (kind === "LinkedIn") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.5 8.5A1.8 1.8 0 1 1 6.5 4.9a1.8 1.8 0 0 1 0 3.6ZM4.9 10.2h3.2V19H4.9v-8.8Zm5.4 0h3.1v1.2h.05c.43-.82 1.48-1.4 3.05-1.4 3.26 0 3.86 2.15 3.86 4.94V19h-3.2v-4.3c0-1.03-.02-2.35-1.43-2.35-1.43 0-1.65 1.12-1.65 2.28V19H10.3v-8.8Z" />
      </svg>
    );
  }
  if (kind === "GitHub") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.71.11 2.51.33 1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}
