"use client";

import { CrudAdmin } from "@/components/admin/CrudAdmin";

export default function DesignsAdminPage() {
  return (
    <CrudAdmin
      table="system_designs"
      title="System designs"
      labelKey="title"
      slugKey="slug"
      orderColumn="sort_order"
      fields={[
        { key: "title", label: "Title", kind: "text" },
        { key: "slug", label: "Slug", kind: "text" },
        { key: "summary", label: "Summary", kind: "textarea", rows: 3 },
        { key: "body_md", label: "Explanation (Markdown)", kind: "textarea", rows: 10 },
        { key: "tradeoffs_md", label: "Trade-offs (Markdown)", kind: "textarea", rows: 6 },
        { key: "diagram_path", label: "Diagram", kind: "image", folder: "diagrams" },
        { key: "sort_order", label: "Order", kind: "number" },
        { key: "published", label: "Published", kind: "checkbox" },
      ]}
      blank={() => ({
        title: "",
        slug: "",
        summary: "",
        body_md: "",
        tradeoffs_md: "",
        diagram_path: "",
        sort_order: 0,
        published: false,
      })}
    />
  );
}
