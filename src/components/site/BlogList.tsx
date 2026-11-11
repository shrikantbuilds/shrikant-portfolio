"use client";

import Link from "next/link";
import { useState } from "react";
import { EditIconButton, EditToolbar } from "@/components/edit/EditControls";
import { PostEditor } from "@/components/edit/editors";
import { Reveal } from "@/components/site/Reveal";
import type { Post } from "@/lib/types";

function readingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 180))} min read`;
}

export function BlogList({ posts }: { posts: Post[] }) {
  const [editing, setEditing] = useState<Post | null | undefined>(undefined);

  return (
    <Reveal>
      <section className="panel panel-pad">
        <EditToolbar title="Blog">
          <EditIconButton label="Add post" kind="add" onClick={() => setEditing(null)} />
        </EditToolbar>
        <p className="page-kicker">Blog</p>
        <h1 className="page-title">Engineering notes</h1>
        <p className="page-lead">Short writing on systems, routing, caching, and observability.</p>

        <div className="blog-list" style={{ marginTop: "1.3rem" }}>
          {posts.length === 0 ? <p className="muted">No published posts yet.</p> : null}
          {posts.map((post) => (
            <div key={post.id} className="blog-item-wrap">
              <div className="inline-edit-card-actions">
                <EditIconButton label="Edit post" kind="edit" onClick={() => setEditing(post)} />
              </div>
              <Link href={`/blog/${post.slug}`} className="blog-item blog-item-plain">
                <div>
                  <h2 style={{ margin: "0 0 0.35rem", fontSize: "1.15rem" }}>{post.title}</h2>
                  <p className="muted" style={{ margin: 0 }}>
                    {post.excerpt}
                  </p>
                  <p className="muted" style={{ margin: "0.45rem 0 0", fontSize: "0.85rem" }}>
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString("en", { dateStyle: "medium" })
                      : ""}
                    {" · "}
                    {readingTime(post.body_md)}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <PostEditor
        open={editing !== undefined}
        onClose={() => setEditing(undefined)}
        initial={editing === undefined ? null : editing}
      />
    </Reveal>
  );
}
