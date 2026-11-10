"use client";

import { CrudAdmin } from "@/components/admin/CrudAdmin";

export default function SkillsAdminPage() {
  return (
    <CrudAdmin
      table="skills"
      title="Skills"
      labelKey="name"
      orderColumn="sort_order"
      fields={[
        { key: "name", label: "Skill", kind: "text" },
        { key: "usage", label: "What you used it for", kind: "textarea", rows: 4 },
        { key: "project_slugs", label: "Project slugs", kind: "list", hint: "Comma separated slugs, like control-tower." },
        { key: "sort_order", label: "Order", kind: "number" },
        { key: "published", label: "Published", kind: "checkbox" },
      ]}
      blank={() => ({
        name: "",
        usage: "",
        project_slugs: [],
        sort_order: 0,
        published: false,
      })}
    />
  );
}
