"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(result?.error || "Could not send your message.");
      }
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send your message.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">Message sent</h2>
        <p className="mt-2 text-sm text-slate-600">
          Thanks {name.trim()}. We will reply to {email.trim()}.
        </p>
        <button
          type="button"
          className="btn btn-light mt-6"
          onClick={() => {
            setSent(false);
            setName("");
            setEmail("");
            setMessage("");
          }}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6 sm:p-8">
      <div>
        <label className="label" htmlFor="contact-name">
          Name
        </label>
        <input
          id="contact-name"
          className="field"
          name="name"
          autoComplete="name"
          required
          maxLength={80}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="contact-email">
          Email
        </label>
        <input
          id="contact-email"
          className="field"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={120}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          className="field min-h-36 resize-y"
          name="message"
          required
          maxLength={2000}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
