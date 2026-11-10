"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ensureAdmin } from "@/lib/supabase/ensure-admin";
import { browserSupabase } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/resume", label: "Resume" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/designs", label: "System designs" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/posts", label: "Blog" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ready" | "denied" | "off">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setStatus("off");
      return;
    }
    const supabase = browserSupabase();
    if (!supabase) {
      setStatus("off");
      return;
    }
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      if (!data.session) {
        router.replace("/admin/login");
        return;
      }
      const result = await ensureAdmin(supabase);
      if (!active) return;
      setStatus(result.ok ? "ready" : "denied");
      setMessage(result.message);
    });
    return () => {
      active = false;
    };
  }, [router]);

  async function signOut() {
    await browserSupabase()?.auth.signOut();
    router.replace("/admin/login");
  }

  if (status === "off") {
    return (
      <main className="admin-main">
        <h1>Admin needs Supabase</h1>
        <p className="os-muted">
          Copy <code>.env.example</code> to <code>.env.local</code> and add the project URL and anon key. Then run the
          SQL in <code>supabase/migrations</code>.
        </p>
        <Link href="/">Back to site</Link>
      </main>
    );
  }

  if (status === "loading") return <main className="admin-main">Checking the admin session…</main>;

  if (status === "denied") {
    return (
      <main className="admin-main">
        <h1>Not the admin</h1>
        <p className="os-error">{message}</p>
        <button type="button" className="os-button" onClick={() => void signOut()}>
          Sign out
        </button>
      </main>
    );
  }

  return (
    <div className="admin-shell">
      <nav className="admin-nav" aria-label="Admin">
        {links.map((link) => (
          <Link key={link.href} href={link.href} data-active={pathname === link.href}>
            {link.label}
          </Link>
        ))}
        <Link href="/">View site</Link>
        <button type="button" className="os-text-button" onClick={() => void signOut()}>
          Sign out
        </button>
      </nav>
      <div className="admin-main">{children}</div>
    </div>
  );
}
