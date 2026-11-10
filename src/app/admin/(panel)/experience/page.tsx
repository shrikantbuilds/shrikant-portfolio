"use client";

import { CrudAdmin } from "@/components/admin/CrudAdmin";

export default function ExperienceAdminPage() {
  return (
    <CrudAdmin
      table="experience"
      title="Experience"
      labelKey="role_title"
      orderColumn="sort_order"
      fields={[
        { key: "role_title", label: "Role", kind: "text" },
        { key: "org", label: "Organization", kind: "text" },
        { key: "start_label", label: "Start", kind: "text" },
        { key: "end_label", label: "End", kind: "text" },
        { key: "summary", label: "Summary", kind: "textarea", rows: 4 },
        { key: "sort_order", label: "Order", kind: "number" },
        { key: "published", label: "Published", kind: "checkbox" },
      ]}
      blank={() => ({
        role_title: "",
        org: "",
        start_label: "",
        end_label: "",
        summary: "",
        sort_order: 0,
        published: false,
      })}
    />
  );
}
