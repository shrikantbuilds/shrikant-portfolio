"use client";

import { CrudAdmin } from "@/components/admin/CrudAdmin";

export default function PostsAdminPage() {
  return (
    <CrudAdmin
      table="posts"
      title="Blog"
      labelKey="title"
      slugKey="slug"
      orderColumn="published_at"
      ascending={false}
      stampPublish
      fields={[
        { key: "title", label: "Title", kind: "text" },
        { key: "slug", label: "Slug", kind: "text" },
        { key: "excerpt", label: "Excerpt", kind: "textarea", rows: 3 },
        { key: "body_md", label: "Body (Markdown)", kind: "textarea", rows: 14, hint: "Use the cover field for the main image." },
        { key: "cover_path", label: "Cover", kind: "image", folder: "posts" },
        { key: "tags", label: "Tags", kind: "list" },
        { key: "seo_title", label: "SEO title", kind: "text" },
        { key: "seo_description", label: "SEO description", kind: "textarea", rows: 2 },
        { key: "published", label: "Published", kind: "checkbox" },
      ]}
      blank={() => ({
        title: "",
        slug: "",
        excerpt: "",
        body_md: "",
        cover_path: "",
        tags: [],
        seo_title: "",
        seo_description: "",
        published: false,
        published_at: null,
      })}
    />
  );
}
