"use client";

import { CrudAdmin } from "@/components/admin/CrudAdmin";

export default function ProjectsAdminPage() {
  return (
    <CrudAdmin
      table="projects"
      title="Projects"
      labelKey="title"
      slugKey="slug"
      orderColumn="sort_order"
      fields={[
        { key: "title", label: "Title", kind: "text" },
        { key: "slug", label: "Slug", kind: "text", hint: "Lowercase URL, like control-tower. Leave blank to build it from the title." },
        { key: "summary", label: "Summary", kind: "textarea", rows: 3 },
        { key: "role", label: "Your role", kind: "text" },
        { key: "year", label: "Year", kind: "text" },
        { key: "category", label: "Category", kind: "text", hint: "Used as a filter. Example: Platform." },
        { key: "stack", label: "Stack", kind: "list" },
        { key: "body_md", label: "Write-up (Markdown)", kind: "textarea", rows: 12 },
        { key: "cover_path", label: "Cover", kind: "image", folder: "covers" },
        { key: "gallery", label: "Gallery", kind: "images", folder: "gallery" },
        { key: "live_url", label: "Live URL", kind: "text" },
        { key: "github_url", label: "GitHub URL", kind: "text" },
        { key: "sort_order", label: "Order", kind: "number" },
        { key: "published", label: "Published", kind: "checkbox" },
      ]}
      blank={() => ({
        title: "",
        slug: "",
        summary: "",
        role: "",
        year: "",
        category: "",
        stack: [],
        body_md: "",
        cover_path: "",
        gallery: [],
        live_url: "",
        github_url: "",
        sort_order: 0,
        published: false,
      })}
    />
  );
}
