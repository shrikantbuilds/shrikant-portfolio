"use client";

import { FormEvent, useState } from "react";

export function ContactForm({ email }: { email: string }) {
  const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [note, setNote] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!key) return;
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    setNote("");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: key,
          subject: `Portfolio note from ${form.get("name") || "someone"}`,
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message"),
          botcheck: form.get("botcheck") || "",
        }),
      });
      const payload = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !payload.success) {
        setStatus("error");
        setNote(payload.message || "The form service did not accept that.");
        return;
      }
      setStatus("sent");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
      setNote("The form could not be sent. Try the email address instead.");
    }
  }

  if (!key) {
    return (
      <p className="muted contact-form-fallback">
        The contact form is waiting for <code>NEXT_PUBLIC_WEB3FORMS_KEY</code>.
        {email ? (
          <>
            {" "}
            Until then, write to <a href={`mailto:${email}`}>{email}</a>.
          </>
        ) : null}
      </p>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />
      <div className="contact-form-row">
        <label className="field">
          <span>Name</span>
          <input name="name" required autoComplete="name" placeholder="Your name" />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="you@email.com" />
        </label>
      </div>
      <label className="field">
        <span>Message</span>
        <textarea name="message" required rows={6} placeholder="What would you like to talk about?" />
      </label>
      <button className="btn" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
      {status === "sent" ? <p className="os-ok">Sent. I will read it from email.</p> : null}
      {status === "error" ? <p className="os-error">{note}</p> : null}
    </form>
  );
}
