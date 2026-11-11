"use client";

import Link from "next/link";
import { useAdminMode } from "@/components/edit/AdminModeContext";

export function AdminBar() {
  const { ready, isAdmin, email, signOut } = useAdminMode();
  if (!ready || !isAdmin) return null;

  return (
    <div className="admin-bar">
      <span>
        Edit mode{email ? ` · ${email}` : ""}
      </span>
      <span className="admin-bar-hint">Use Edit / Add / Delete on each page</span>
      <button type="button" className="os-text-button" onClick={() => void signOut()}>
        Sign out
      </button>
      <Link href="/admin/login" className="os-text-button">
        Login page
      </Link>
    </div>
  );
}
