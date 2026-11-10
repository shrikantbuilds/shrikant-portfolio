"use client";

import { FormEvent, useEffect, useState } from "react";
import { mediaUrl } from "@/lib/media";
import { refreshPublicSite } from "@/lib/revalidate-public";
import { slugify, splitList } from "@/lib/slug";
import { browserSupabase } from "@/lib/supabase/browser";
import { FileButton } from "./FileButton";

export type FieldConfig = {
  key: string;
  label: string;
  kind: "text" | "textarea" | "number" | "checkbox" | "list" | "image" | "images";
  rows?: number;
  hint?: string;
  folder?: string;
};

type Row = Record<string, unknown> & { id?: string };

export function CrudAdmin({
  table,
  title,
  labelKey,
  slugKey,
  orderColumn,
  ascending = true,
  fields,
  blank,
  stampPublish = false,
}: {
  table: string;
  title: string;
  labelKey: string;
  slugKey?: string;
  orderColumn: string;
  ascending?: boolean;
  fields: FieldConfig[];
  blank: () => Row;
  stampPublish?: boolean;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [draft, setDraft] = useState<Row | null>(null);
  const [listText, setListText] = useState<Record<string, string>>({});
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const supabase = browserSupabase();
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    const { data, error: loadError } = await supabase
      .from(table)
      .select("*")
      .order(orderColumn, { ascending });
    if (loadError) {
      setError(loadError.message);
      return;
    }
    setRows((data ?? []) as Row[]);
  }

  useEffect(() => {
    let active = true;
    load().catch(() => {
      if (active) setError("Could not load records.");
    });
    return () => {
      active = false;
    };
    // load closes over the stable table name for this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  function openRow(row: Row) {
    setDraft(structuredClone(row));
    const next: Record<string, string> = {};
    for (const field of fields) {
      if (field.kind === "list") {
        const value = row[field.key];
        next[field.key] = Array.isArray(value) ? value.join(", ") : "";
      }
    }
    setListText(next);
    setIsNew(false);
    setError("");
    setNote("");
  }

  function openNew() {
    const row = blank();
    openRow(row);
    setIsNew(true);
  }

  function setField(key: string, value: unknown) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }

  async function onSave(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    const supabase = browserSupabase();
    if (!supabase) return;

    const payload: Row = { ...draft };
    for (const field of fields) {
      if (field.kind === "list") payload[field.key] = splitList(listText[field.key] ?? "");
      if (field.kind === "number") payload[field.key] = Number(payload[field.key] ?? 0);
    }
    if (slugKey) {
      const typed = String(payload[slugKey] ?? "").trim();
      const slug = slugify(typed || String(payload.title || ""));
      if (!slug) {
        setError("Add a title so a URL slug can be created.");
        return;
      }
      payload[slugKey] = slug;
    }
    if (stampPublish && payload.published && !payload.published_at) {
      payload.published_at = new Date().toISOString();
    }

    setBusy(true);
    setError("");
    setNote("");
    const id = isNew ? crypto.randomUUID() : String(draft.id);
    delete payload.created_at;
    delete payload.updated_at;
    // Keep id only on insert; update matches by .eq("id", id).
    if (!isNew) delete payload.id;

    const { error: saveError } = isNew
      ? await supabase.from(table).insert({ ...payload, id })
      : await supabase.from(table).update(payload).eq("id", id);

    setBusy(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    await refreshPublicSite();
    setNote("Saved. The live site should update now — refresh the page if needed.");
    setIsNew(false);
    setDraft({ ...payload, id });
    await load();
  }

  async function onDelete() {
    if (!draft?.id || isNew) return;
    if (!window.confirm("Delete this record?")) return;
    const supabase = browserSupabase();
    if (!supabase) return;
    setBusy(true);
    const { error: deleteError } = await supabase.from(table).delete().eq("id", draft.id);
    setBusy(false);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setDraft(null);
    await load();
  }

  return (
    <div className="admin-split">
      <aside>
        <button type="button" className="os-button" onClick={openNew}>
          New
        </button>
        <div className="os-list" style={{ marginTop: "0.8rem" }}>
          {rows.map((row) => {
            const active = draft?.id === row.id;
            return (
              <button
                key={String(row.id)}
                type="button"
                className="os-text-button"
                data-active={active ? "true" : "false"}
                style={{
                  textAlign: "left",
                  width: "100%",
                  padding: "0.55rem 0.65rem",
                  borderRadius: "0.7rem",
                  background: active ? "rgba(88, 166, 255, 0.14)" : "transparent",
                }}
                onClick={() => openRow(row)}
              >
                {String(row[labelKey] || "Untitled")}
                {row.published === false ? " · draft" : ""}
              </button>
            );
          })}
          {rows.length === 0 ? <p className="os-muted">Nothing here yet. Click New.</p> : null}
        </div>
      </aside>
      <section className="os-card">
        <h1 style={{ marginTop: 0 }}>{title}</h1>
        {!draft ? <p className="os-muted">Choose a record or start a new one.</p> : null}
        {draft ? (
          <form onSubmit={onSave}>
            {fields.map((field) => {
              if (field.kind === "checkbox") {
                return (
                  <label key={field.key} className="os-field" style={{ gridTemplateColumns: "auto 1fr" }}>
                    <span>
                      <input
                        type="checkbox"
                        checked={Boolean(draft[field.key])}
                        onChange={(event) => setField(field.key, event.target.checked)}
                      />{" "}
                      {field.label}
                    </span>
                  </label>
                );
              }
              if (field.kind === "textarea") {
                return (
                  <label key={field.key} className="os-field">
                    <span>{field.label}</span>
                    <textarea
                      rows={field.rows ?? 8}
                      value={String(draft[field.key] ?? "")}
                      onChange={(event) => setField(field.key, event.target.value)}
                    />
                    {field.hint ? <span>{field.hint}</span> : null}
                  </label>
                );
              }
              if (field.kind === "list") {
                return (
                  <label key={field.key} className="os-field">
                    <span>{field.label}</span>
                    <input
                      value={listText[field.key] ?? ""}
                      onChange={(event) =>
                        setListText((current) => ({ ...current, [field.key]: event.target.value }))
                      }
                    />
                    <span>{field.hint || "Comma separated."}</span>
                  </label>
                );
              }
              if (field.kind === "image") {
                const path = String(draft[field.key] ?? "");
                return (
                  <div key={field.key} className="os-field">
                    <span>{field.label}</span>
                    {path ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={mediaUrl(path)} alt="" style={{ maxWidth: "16rem", borderRadius: "0.6rem" }} />
                    ) : null}
                    <FileButton
                      accept="image/*"
                      folder={field.folder || table}
                      kind="image"
                      label={path ? "Replace image" : "Upload image"}
                      onUploaded={(next) => setField(field.key, next)}
                    />
                    {path ? (
                      <button type="button" className="os-text-button" onClick={() => setField(field.key, "")}>
                        Remove image
                      </button>
                    ) : null}
                  </div>
                );
              }
              if (field.kind === "images") {
                const paths = Array.isArray(draft[field.key]) ? (draft[field.key] as string[]) : [];
                return (
                  <div key={field.key} className="os-field">
                    <span>{field.label}</span>
                    {paths.map((path) => (
                      <div key={path}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={mediaUrl(path)} alt="" style={{ maxWidth: "12rem", borderRadius: "0.6rem" }} />
                        <button
                          type="button"
                          className="os-text-button"
                          onClick={() =>
                            setField(
                              field.key,
                              paths.filter((item) => item !== path),
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <FileButton
                      accept="image/*"
                      folder={field.folder || table}
                      kind="image"
                      label="Add image"
                      onUploaded={(next) => setField(field.key, [...paths, next])}
                    />
                  </div>
                );
              }
              return (
                <label key={field.key} className="os-field">
                  <span>{field.label}</span>
                  <input
                    type={field.kind === "number" ? "number" : "text"}
                    value={String(draft[field.key] ?? "")}
                    onChange={(event) => setField(field.key, event.target.value)}
                  />
                  {field.hint ? <span>{field.hint}</span> : null}
                </label>
              );
            })}
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <button className="os-button" type="submit" disabled={busy}>
                {busy ? "Saving…" : "Save"}
              </button>
              {!isNew ? (
                <button className="os-button-ghost" type="button" onClick={onDelete} disabled={busy}>
                  Delete
                </button>
              ) : null}
            </div>
          </form>
        ) : null}
        {error ? <p className="os-error">{error}</p> : null}
        {note ? <p className="os-ok">{note}</p> : null}
      </section>
    </div>
  );
}
