"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { browserSupabase } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = browserSupabase();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/admin");
    });
  }, [router]);

  async function onLink(event: FormEvent) {
    event.preventDefault();
    const supabase = browserSupabase();
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setBusy(false);
    setMessage(error ? error.message : "Check your email for the login link.");
  }

  return (
    <div className="lock">
      <form className="os-card" onSubmit={onLink}>
        <p className="os-kicker">Admin</p>
        <h1 style={{ marginTop: 0 }}>Admin login</h1>
        <p className="os-muted" style={{ marginTop: 0 }}>
          Enter your email. We&apos;ll send a one-time link — no password.
        </p>
        {!isSupabaseConfigured() ? (
          <p className="os-muted">
            Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
            <code>.env.local</code> first.
          </p>
        ) : null}
        <label className="os-field">
          <span>Email</span>
          <input
            type="email"
            required
            value={email}
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <button className="os-button" type="submit" disabled={busy || !isSupabaseConfigured() || !email}>
          {busy ? "Sending…" : "Email me a link"}
        </button>
        {message ? <p className={message.includes("Check your email") ? "os-ok" : "os-error"}>{message}</p> : null}
        <p>
          <Link href="/">Back to site</Link>
        </p>
      </form>
    </div>
  );
}
