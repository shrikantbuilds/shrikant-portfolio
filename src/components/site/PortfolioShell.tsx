"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { DesktopBundle } from "@/lib/types";
import { NavIcon } from "./NavIcon";
import { isActive, publicNav } from "./nav";
import { SearchModal, type SearchItem } from "./SearchModal";

export function PortfolioShell({
  bundle,
  children,
}: {
  bundle: DesktopBundle;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.dataset.navOpen = open ? "true" : "false";
    return () => {
      delete document.body.dataset.navOpen;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearch(true);
      }
      if (event.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const items = useMemo<SearchItem[]>(() => {
    return [
      ...publicNav.map((item) => ({ title: item.label, href: item.href, kind: "Page" })),
      ...bundle.projects.map((project) => ({
        title: project.title,
        href: `/projects/${project.slug}`,
        kind: "Project",
      })),
      ...bundle.posts.map((post) => ({
        title: post.title,
        href: `/blog/${post.slug}`,
        kind: "Blog",
      })),
      { title: "System Design", href: "/system-design", kind: "Page" },
    ];
  }, [bundle]);

  return (
    <div className="site-root">
      {open ? <button type="button" className="site-overlay" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}
      <aside className="site-sidebar" data-open={open} aria-label="Primary">
        <div className="site-sidebar-top">
          <Link href="/" className="site-brand">
            <span className="site-mark">S</span>
            <span>
              <strong>{bundle.settings.name || "Portfolio"}</strong>
              <span>{bundle.settings.role_line || "Software Developer"}</span>
            </span>
          </Link>
          <button type="button" className="icon-btn site-close-btn" aria-label="Close menu" onClick={() => setOpen(false)}>
            <NavIcon name="close" />
          </button>
        </div>
        <nav className="site-nav">
          {publicNav.map((item) => (
            <Link key={item.href} href={item.href} data-active={isActive(pathname, item.href)}>
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <header className="site-top">
        <button type="button" className="icon-btn site-menu-btn" aria-label="Open menu" onClick={() => setOpen(true)}>
          <NavIcon name="menu" />
        </button>
        <div className="site-top-actions">
          <span className="status-pill">
            <i />
            <span className="status-pill-full">Open to work</span>
            <span className="status-pill-short">Open</span>
          </span>
          <button type="button" className="icon-btn" aria-label="Search" onClick={() => setSearch(true)}>
            <NavIcon name="search" />
          </button>
        </div>
      </header>

      <main className="site-main">
        {bundle.source === "preview" ? (
          <p className="banner">
            Preview mode. Add Supabase keys from <code>.env.example</code> to load and edit live content.
          </p>
        ) : null}
        {bundle.source === "unavailable" ? (
          <p className="banner">Live content did not load. Check Supabase and resume the project if it paused.</p>
        ) : null}
        {children}
      </main>

      {search ? <SearchModal items={items} onClose={() => setSearch(false)} /> : null}
    </div>
  );
}
