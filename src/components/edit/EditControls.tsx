"use client";

import { useAdminMode } from "@/components/edit/AdminModeContext";

export function EditIconButton({
  label,
  onClick,
  kind = "edit",
}: {
  label: string;
  onClick: () => void;
  kind?: "edit" | "add" | "delete";
}) {
  const { isAdmin, ready } = useAdminMode();
  if (!ready || !isAdmin) return null;

  return (
    <button
      type="button"
      className={`inline-edit-btn inline-edit-btn-${kind}`}
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
    >
      {kind === "add" ? <PlusIcon /> : null}
      {kind === "edit" ? <PencilIcon /> : null}
      {kind === "delete" ? <TrashIcon /> : null}
      <span>{label}</span>
    </button>
  );
}

export function EditToolbar({ title, children }: { title?: string; children: React.ReactNode }) {
  const { isAdmin, ready } = useAdminMode();
  if (!ready || !isAdmin) return null;
  return (
    <div className="inline-edit-toolbar">
      {title ? <span className="inline-edit-toolbar-title">{title}</span> : null}
      <div className="inline-edit-toolbar-actions">{children}</div>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 6h18M8 6V4h8v2M9 10v8M15 10v8M6 6l1 14h10l1-14" />
    </svg>
  );
}
