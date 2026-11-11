"use client";

import { FormEvent, useEffect, useState } from "react";
import { FileButton } from "@/components/admin/FileButton";
import { EditModal } from "@/components/edit/EditModal";
import { useAdminMode } from "@/components/edit/AdminModeContext";
import { mediaUrl } from "@/lib/media";
import { slugify, splitList } from "@/lib/slug";
import { browserSupabase } from "@/lib/supabase/browser";
import type { ExperienceItem, Post, Project, SiteSettings, Skill } from "@/lib/types";

type Notice = { error: string; note: string };

function useNotice() {
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  return { error, setError, note, setNote, busy, setBusy, clear: () => { setError(""); setNote(""); } };
}

function Status({ error, note }: Notice) {
  return (
    <>
      {error ? <p className="os-error">{error}</p> : null}
      {note ? <p className="os-ok">{note}</p> : null}
    </>
  );
}

/** Home + contact shared settings. */
export function SettingsEditor({
  open,
  onClose,
  settings,
  mode = "home",
}: {
  open: boolean;
  onClose: () => void;
  settings: SiteSettings;
  mode?: "home" | "contact";
}) {
  const { refreshSite } = useAdminMode();
  const notice = useNotice();
  const [draft, setDraft] = useState(settings);

  useEffect(() => {
    if (open) setDraft(settings);
  }, [open, settings]);

  async function onSave(event: FormEvent) {
    event.preventDefault();
    const supabase = browserSupabase();
    if (!supabase) return;
    notice.setBusy(true);
    notice.clear();
    const payload =
      mode === "contact"
        ? {
            email: draft.email,
            github_url: draft.github_url,
            linkedin_url: draft.linkedin_url,
            location: draft.location,
          }
        : {
            name: draft.name,
            role_line: draft.role_line,
            headline: draft.headline,
            intro: draft.intro,
            location: draft.location,
            email: draft.email,
            github_url: draft.github_url,
            linkedin_url: draft.linkedin_url,
            seo_title: draft.seo_title,
            seo_description: draft.seo_description,
            photo_path: draft.photo_path,
          };
    const { error } = await supabase.from("site_settings").update(payload).eq("id", 1);
    notice.setBusy(false);
    if (error) {
      notice.setError(error.message);
      return;
    }
    await refreshSite();
    notice.setNote("Saved.");
    onClose();
  }

  return (
    <EditModal
      open={open}
      title={mode === "contact" ? "Edit contact details" : "Edit home profile"}
      onClose={onClose}
      footer={
        <button className="btn" type="submit" form="settings-editor" disabled={notice.busy}>
          {notice.busy ? "Saving…" : "Save"}
        </button>
      }
    >
      <form id="settings-editor" onSubmit={onSave}>
        {mode === "home" ? (
          <>
            <label className="os-field"><span>Name</span><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
            <label className="os-field"><span>Role</span><input value={draft.role_line} onChange={(e) => setDraft({ ...draft, role_line: e.target.value })} /></label>
            <label className="os-field"><span>Headline</span><input value={draft.headline} onChange={(e) => setDraft({ ...draft, headline: e.target.value })} /></label>
            <label className="os-field"><span>Intro</span><textarea rows={4} value={draft.intro} onChange={(e) => setDraft({ ...draft, intro: e.target.value })} /></label>
            <label className="os-field"><span>Location</span><input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} /></label>
            <div className="os-field">
              <span>Photo</span>
              {draft.photo_path ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl(draft.photo_path)} alt="" style={{ width: "6rem", borderRadius: "0.7rem" }} />
              ) : null}
              <FileButton accept="image/*" folder="photos" kind="image" label="Upload photo" onUploaded={(path) => setDraft({ ...draft, photo_path: path })} />
              {draft.photo_path ? <button type="button" className="os-text-button" onClick={() => setDraft({ ...draft, photo_path: "" })}>Remove photo</button> : null}
            </div>
          </>
        ) : (
          <>
            <label className="os-field"><span>Email</span><input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></label>
            <label className="os-field"><span>LinkedIn URL</span><input value={draft.linkedin_url} onChange={(e) => setDraft({ ...draft, linkedin_url: e.target.value })} /></label>
            <label className="os-field"><span>GitHub URL</span><input value={draft.github_url} onChange={(e) => setDraft({ ...draft, github_url: e.target.value })} /></label>
            <label className="os-field"><span>Location</span><input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} /></label>
          </>
        )}
        <Status error={notice.error} note={notice.note} />
      </form>
    </EditModal>
  );
}

export function AboutEditor({
  open,
  onClose,
  settings,
}: {
  open: boolean;
  onClose: () => void;
  settings: SiteSettings;
}) {
  const { refreshSite } = useAdminMode();
  const notice = useNotice();
  const [about, setAbout] = useState(settings.about_md);
  const [location, setLocation] = useState(settings.location);
  const [interests, setInterests] = useState(settings.interests.join(", "));
  const [photo, setPhoto] = useState(settings.photo_path);

  useEffect(() => {
    if (!open) return;
    setAbout(settings.about_md);
    setLocation(settings.location);
    setInterests(settings.interests.join(", "));
    setPhoto(settings.photo_path);
  }, [open, settings]);

  async function onSave(event: FormEvent) {
    event.preventDefault();
    const supabase = browserSupabase();
    if (!supabase) return;
    notice.setBusy(true);
    notice.clear();
    const { error } = await supabase
      .from("site_settings")
      .update({
        about_md: about,
        location,
        interests: splitList(interests),
        photo_path: photo,
      })
      .eq("id", 1);
    notice.setBusy(false);
    if (error) {
      notice.setError(error.message);
      return;
    }
    await refreshSite();
    onClose();
  }

  return (
    <EditModal
      open={open}
      title="Edit about"
      onClose={onClose}
      footer={
        <button className="btn" type="submit" form="about-editor" disabled={notice.busy}>
          {notice.busy ? "Saving…" : "Save"}
        </button>
      }
    >
      <form id="about-editor" onSubmit={onSave}>
        <label className="os-field"><span>Location</span><input value={location} onChange={(e) => setLocation(e.target.value)} /></label>
        <label className="os-field"><span>Interests</span><input value={interests} onChange={(e) => setInterests(e.target.value)} /><span>Comma separated</span></label>
        <label className="os-field"><span>Story (Markdown)</span><textarea rows={10} value={about} onChange={(e) => setAbout(e.target.value)} /></label>
        <div className="os-field">
          <span>Photo</span>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(photo)} alt="" style={{ width: "6rem", borderRadius: "0.7rem" }} />
          ) : null}
          <FileButton accept="image/*" folder="photos" kind="image" label="Upload photo" onUploaded={setPhoto} />
        </div>
        <Status error={notice.error} note={notice.note} />
      </form>
    </EditModal>
  );
}

export function ResumeEditor({
  open,
  onClose,
  path,
}: {
  open: boolean;
  onClose: () => void;
  path: string;
}) {
  const { refreshSite } = useAdminMode();
  const notice = useNotice();
  const [resumePath, setResumePath] = useState(path);

  useEffect(() => {
    if (open) setResumePath(path);
  }, [open, path]);

  async function save(next: string) {
    const supabase = browserSupabase();
    if (!supabase) return;
    notice.clear();
    const { error } = await supabase.from("site_settings").update({ resume_path: next }).eq("id", 1);
    if (error) {
      notice.setError(error.message);
      return;
    }
    setResumePath(next);
    await refreshSite();
    notice.setNote(next ? "Resume saved." : "Resume removed.");
  }

  const file = mediaUrl(resumePath);

  return (
    <EditModal open={open} title="Edit resume" onClose={onClose}>
      {file ? (
        <p>
          <a href={file} target="_blank" rel="noreferrer">
            Open current PDF
          </a>
        </p>
      ) : (
        <p className="muted">No PDF yet.</p>
      )}
      <FileButton accept="application/pdf" folder="resume" kind="pdf" label="Upload PDF" onUploaded={(next) => void save(next)} />
      {resumePath ? (
        <button type="button" className="os-text-button" onClick={() => void save("")}>
          Remove resume
        </button>
      ) : null}
      <Status error={notice.error} note={notice.note} />
    </EditModal>
  );
}

type ProjectDraft = Partial<Project> & { stackText?: string };

export function ProjectEditor({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial: Project | null;
}) {
  const { refreshSite } = useAdminMode();
  const notice = useNotice();
  const isNew = !initial;
  const [draft, setDraft] = useState<ProjectDraft>({});

  useEffect(() => {
    if (!open) return;
    notice.clear();
    if (initial) {
      setDraft({ ...initial, stackText: initial.stack.join(", ") });
    } else {
      setDraft({
        title: "",
        slug: "",
        summary: "",
        role: "",
        year: "",
        category: "",
        stackText: "",
        body_md: "",
        cover_path: "",
        gallery: [],
        live_url: "",
        github_url: "",
        sort_order: 0,
        published: true,
      });
    }
    // Reset draft when the modal opens for a given record.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial]);

  async function onSave(event: FormEvent) {
    event.preventDefault();
    const supabase = browserSupabase();
    if (!supabase) return;
    const slug = slugify(String(draft.slug || draft.title || ""));
    if (!slug) {
      notice.setError("Add a title.");
      return;
    }
    notice.setBusy(true);
    notice.clear();
    const payload = {
      title: draft.title ?? "",
      slug,
      summary: draft.summary ?? "",
      role: draft.role ?? "",
      year: draft.year ?? "",
      category: draft.category ?? "",
      stack: splitList(draft.stackText ?? ""),
      body_md: draft.body_md ?? "",
      cover_path: draft.cover_path ?? "",
      gallery: Array.isArray(draft.gallery) ? draft.gallery : [],
      live_url: draft.live_url ?? "",
      github_url: draft.github_url ?? "",
      sort_order: Number(draft.sort_order ?? 0),
      published: Boolean(draft.published),
    };
    const { error } = isNew
      ? await supabase.from("projects").insert({ ...payload, id: crypto.randomUUID() })
      : await supabase.from("projects").update(payload).eq("id", initial!.id);
    notice.setBusy(false);
    if (error) {
      notice.setError(error.message);
      return;
    }
    await refreshSite();
    onClose();
  }

  async function onDelete() {
    if (!initial || !window.confirm("Delete this project?")) return;
    const supabase = browserSupabase();
    if (!supabase) return;
    notice.setBusy(true);
    const { error } = await supabase.from("projects").delete().eq("id", initial.id);
    notice.setBusy(false);
    if (error) {
      notice.setError(error.message);
      return;
    }
    await refreshSite();
    onClose();
  }

  return (
    <EditModal
      open={open}
      title={isNew ? "Add project" : "Edit project"}
      onClose={onClose}
      footer={
        <div className="edit-modal-actions">
          {!isNew ? (
            <button type="button" className="btn-ghost" onClick={() => void onDelete()} disabled={notice.busy}>
              Delete
            </button>
          ) : null}
          <button className="btn" type="submit" form="project-editor" disabled={notice.busy}>
            {notice.busy ? "Saving…" : "Save"}
          </button>
        </div>
      }
    >
      <form id="project-editor" onSubmit={onSave}>
        <label className="os-field"><span>Title</span><input value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
        <label className="os-field"><span>Slug</span><input value={draft.slug ?? ""} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} /><span>Leave blank to build from title</span></label>
        <label className="os-field"><span>Summary</span><textarea rows={3} value={draft.summary ?? ""} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} /></label>
        <label className="os-field"><span>Role</span><input value={draft.role ?? ""} onChange={(e) => setDraft({ ...draft, role: e.target.value })} /></label>
        <label className="os-field"><span>Year</span><input value={draft.year ?? ""} onChange={(e) => setDraft({ ...draft, year: e.target.value })} /></label>
        <label className="os-field"><span>Category</span><input value={draft.category ?? ""} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /></label>
        <label className="os-field"><span>Stack</span><input value={draft.stackText ?? ""} onChange={(e) => setDraft({ ...draft, stackText: e.target.value })} /><span>Comma separated</span></label>
        <label className="os-field"><span>Write-up (Markdown)</span><textarea rows={10} value={draft.body_md ?? ""} onChange={(e) => setDraft({ ...draft, body_md: e.target.value })} /></label>
        <div className="os-field">
          <span>Cover</span>
          {draft.cover_path ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(draft.cover_path)} alt="" style={{ maxWidth: "12rem", borderRadius: "0.6rem" }} />
          ) : null}
          <FileButton accept="image/*" folder="covers" kind="image" label="Upload cover" onUploaded={(path) => setDraft({ ...draft, cover_path: path })} />
        </div>
        <label className="os-field"><span>Live URL</span><input value={draft.live_url ?? ""} onChange={(e) => setDraft({ ...draft, live_url: e.target.value })} /></label>
        <label className="os-field"><span>GitHub URL</span><input value={draft.github_url ?? ""} onChange={(e) => setDraft({ ...draft, github_url: e.target.value })} /></label>
        <label className="os-field"><span>Order</span><input type="number" value={Number(draft.sort_order ?? 0)} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} /></label>
        <label className="os-field" style={{ gridTemplateColumns: "auto 1fr" }}>
          <span>
            <input type="checkbox" checked={Boolean(draft.published)} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> Published
          </span>
        </label>
        <Status error={notice.error} note={notice.note} />
      </form>
    </EditModal>
  );
}

export function ExperienceEditor({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial: ExperienceItem | null;
}) {
  const { refreshSite } = useAdminMode();
  const notice = useNotice();
  const isNew = !initial;
  const [draft, setDraft] = useState<Partial<ExperienceItem>>({});

  useEffect(() => {
    if (!open) return;
    setDraft(
      initial ?? {
        role_title: "",
        org: "",
        start_label: "",
        end_label: "",
        summary: "",
        sort_order: 0,
        published: true,
      },
    );
  }, [open, initial]);

  async function onSave(event: FormEvent) {
    event.preventDefault();
    const supabase = browserSupabase();
    if (!supabase) return;
    notice.setBusy(true);
    notice.clear();
    const payload = {
      role_title: draft.role_title ?? "",
      org: draft.org ?? "",
      start_label: draft.start_label ?? "",
      end_label: draft.end_label ?? "",
      summary: draft.summary ?? "",
      sort_order: Number(draft.sort_order ?? 0),
      published: Boolean(draft.published),
    };
    const { error } = isNew
      ? await supabase.from("experience").insert({ ...payload, id: crypto.randomUUID() })
      : await supabase.from("experience").update(payload).eq("id", initial!.id);
    notice.setBusy(false);
    if (error) {
      notice.setError(error.message);
      return;
    }
    await refreshSite();
    onClose();
  }

  async function onDelete() {
    if (!initial || !window.confirm("Delete this experience item?")) return;
    const supabase = browserSupabase();
    if (!supabase) return;
    const { error } = await supabase.from("experience").delete().eq("id", initial.id);
    if (error) {
      notice.setError(error.message);
      return;
    }
    await refreshSite();
    onClose();
  }

  return (
    <EditModal
      open={open}
      title={isNew ? "Add experience" : "Edit experience"}
      onClose={onClose}
      footer={
        <div className="edit-modal-actions">
          {!isNew ? (
            <button type="button" className="btn-ghost" onClick={() => void onDelete()}>
              Delete
            </button>
          ) : null}
          <button className="btn" type="submit" form="experience-editor" disabled={notice.busy}>
            {notice.busy ? "Saving…" : "Save"}
          </button>
        </div>
      }
    >
      <form id="experience-editor" onSubmit={onSave}>
        <label className="os-field"><span>Role / title</span><input value={draft.role_title ?? ""} onChange={(e) => setDraft({ ...draft, role_title: e.target.value })} /></label>
        <label className="os-field"><span>Organization</span><input value={draft.org ?? ""} onChange={(e) => setDraft({ ...draft, org: e.target.value })} /></label>
        <label className="os-field"><span>Start</span><input value={draft.start_label ?? ""} onChange={(e) => setDraft({ ...draft, start_label: e.target.value })} /></label>
        <label className="os-field"><span>End</span><input value={draft.end_label ?? ""} onChange={(e) => setDraft({ ...draft, end_label: e.target.value })} /></label>
        <label className="os-field"><span>Summary</span><textarea rows={6} value={draft.summary ?? ""} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} /><span>One point per line</span></label>
        <label className="os-field"><span>Order</span><input type="number" value={Number(draft.sort_order ?? 0)} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} /></label>
        <label className="os-field" style={{ gridTemplateColumns: "auto 1fr" }}>
          <span>
            <input type="checkbox" checked={Boolean(draft.published)} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> Published
          </span>
        </label>
        <Status error={notice.error} note={notice.note} />
      </form>
    </EditModal>
  );
}

export function SkillEditor({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial: Skill | null;
}) {
  const { refreshSite } = useAdminMode();
  const notice = useNotice();
  const isNew = !initial;
  const [draft, setDraft] = useState<Partial<Skill> & { slugsText?: string }>({});

  useEffect(() => {
    if (!open) return;
    setDraft(
      initial
        ? { ...initial, slugsText: initial.project_slugs.join(", ") }
        : { name: "", usage: "", slugsText: "", sort_order: 0, published: true },
    );
  }, [open, initial]);

  async function onSave(event: FormEvent) {
    event.preventDefault();
    const supabase = browserSupabase();
    if (!supabase) return;
    notice.setBusy(true);
    const payload = {
      name: draft.name ?? "",
      usage: draft.usage ?? "",
      project_slugs: splitList(draft.slugsText ?? ""),
      sort_order: Number(draft.sort_order ?? 0),
      published: Boolean(draft.published),
    };
    const { error } = isNew
      ? await supabase.from("skills").insert({ ...payload, id: crypto.randomUUID() })
      : await supabase.from("skills").update(payload).eq("id", initial!.id);
    notice.setBusy(false);
    if (error) {
      notice.setError(error.message);
      return;
    }
    await refreshSite();
    onClose();
  }

  async function onDelete() {
    if (!initial || !window.confirm("Delete this skill?")) return;
    const supabase = browserSupabase();
    if (!supabase) return;
    const { error } = await supabase.from("skills").delete().eq("id", initial.id);
    if (error) {
      notice.setError(error.message);
      return;
    }
    await refreshSite();
    onClose();
  }

  return (
    <EditModal
      open={open}
      title={isNew ? "Add skill" : "Edit skill"}
      onClose={onClose}
      footer={
        <div className="edit-modal-actions">
          {!isNew ? (
            <button type="button" className="btn-ghost" onClick={() => void onDelete()}>
              Delete
            </button>
          ) : null}
          <button className="btn" type="submit" form="skill-editor" disabled={notice.busy}>
            {notice.busy ? "Saving…" : "Save"}
          </button>
        </div>
      }
    >
      <form id="skill-editor" onSubmit={onSave}>
        <label className="os-field"><span>Name</span><input value={draft.name ?? ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
        <label className="os-field"><span>Usage</span><textarea rows={3} value={draft.usage ?? ""} onChange={(e) => setDraft({ ...draft, usage: e.target.value })} /></label>
        <label className="os-field"><span>Project slugs</span><input value={draft.slugsText ?? ""} onChange={(e) => setDraft({ ...draft, slugsText: e.target.value })} /><span>Comma separated</span></label>
        <label className="os-field"><span>Order</span><input type="number" value={Number(draft.sort_order ?? 0)} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} /></label>
        <label className="os-field" style={{ gridTemplateColumns: "auto 1fr" }}>
          <span>
            <input type="checkbox" checked={Boolean(draft.published)} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> Published
          </span>
        </label>
        <Status error={notice.error} note={notice.note} />
      </form>
    </EditModal>
  );
}

export function PostEditor({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial: Post | null;
}) {
  const { refreshSite } = useAdminMode();
  const notice = useNotice();
  const isNew = !initial;
  const [draft, setDraft] = useState<Partial<Post> & { tagsText?: string }>({});

  useEffect(() => {
    if (!open) return;
    setDraft(
      initial
        ? { ...initial, tagsText: initial.tags.join(", ") }
        : {
            title: "",
            slug: "",
            excerpt: "",
            cover_path: "",
            body_md: "",
            tagsText: "",
            seo_title: "",
            seo_description: "",
            published: true,
          },
    );
  }, [open, initial]);

  async function onSave(event: FormEvent) {
    event.preventDefault();
    const supabase = browserSupabase();
    if (!supabase) return;
    const slug = slugify(String(draft.slug || draft.title || ""));
    if (!slug) {
      notice.setError("Add a title.");
      return;
    }
    notice.setBusy(true);
    const published = Boolean(draft.published);
    const payload = {
      title: draft.title ?? "",
      slug,
      excerpt: draft.excerpt ?? "",
      cover_path: draft.cover_path ?? "",
      body_md: draft.body_md ?? "",
      tags: splitList(draft.tagsText ?? ""),
      seo_title: draft.seo_title || draft.title || "",
      seo_description: draft.seo_description || draft.excerpt || "",
      published,
      published_at: published ? draft.published_at || new Date().toISOString() : null,
    };
    const { error } = isNew
      ? await supabase.from("posts").insert({ ...payload, id: crypto.randomUUID() })
      : await supabase.from("posts").update(payload).eq("id", initial!.id);
    notice.setBusy(false);
    if (error) {
      notice.setError(error.message);
      return;
    }
    await refreshSite();
    onClose();
  }

  async function onDelete() {
    if (!initial || !window.confirm("Delete this post?")) return;
    const supabase = browserSupabase();
    if (!supabase) return;
    const { error } = await supabase.from("posts").delete().eq("id", initial.id);
    if (error) {
      notice.setError(error.message);
      return;
    }
    await refreshSite();
    onClose();
  }

  return (
    <EditModal
      open={open}
      title={isNew ? "Add post" : "Edit post"}
      onClose={onClose}
      footer={
        <div className="edit-modal-actions">
          {!isNew ? (
            <button type="button" className="btn-ghost" onClick={() => void onDelete()}>
              Delete
            </button>
          ) : null}
          <button className="btn" type="submit" form="post-editor" disabled={notice.busy}>
            {notice.busy ? "Saving…" : "Save"}
          </button>
        </div>
      }
    >
      <form id="post-editor" onSubmit={onSave}>
        <label className="os-field"><span>Title</span><input value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
        <label className="os-field"><span>Slug</span><input value={draft.slug ?? ""} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} /></label>
        <label className="os-field"><span>Excerpt</span><textarea rows={3} value={draft.excerpt ?? ""} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} /></label>
        <label className="os-field"><span>Body (Markdown)</span><textarea rows={10} value={draft.body_md ?? ""} onChange={(e) => setDraft({ ...draft, body_md: e.target.value })} /></label>
        <label className="os-field"><span>Tags</span><input value={draft.tagsText ?? ""} onChange={(e) => setDraft({ ...draft, tagsText: e.target.value })} /></label>
        <div className="os-field">
          <span>Cover</span>
          {draft.cover_path ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(draft.cover_path)} alt="" style={{ maxWidth: "12rem", borderRadius: "0.6rem" }} />
          ) : null}
          <FileButton accept="image/*" folder="covers" kind="image" label="Upload cover" onUploaded={(path) => setDraft({ ...draft, cover_path: path })} />
        </div>
        <label className="os-field" style={{ gridTemplateColumns: "auto 1fr" }}>
          <span>
            <input type="checkbox" checked={Boolean(draft.published)} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> Published
          </span>
        </label>
        <Status error={notice.error} note={notice.note} />
      </form>
    </EditModal>
  );
}
