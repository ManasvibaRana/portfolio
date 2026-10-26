"use client";

import { useId, useState, type FormEvent } from "react";
import { site } from "@/data/site";
import { CheckIcon, MailIcon } from "@/components/icons";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

export default function ContactForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fields, setFields] = useState({ name: "", email: "", message: "" });

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
    fields.name ? `Hello from ${fields.name}` : "Hello from your portfolio",
  )}&body=${encodeURIComponent(fields.message)}`;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const company = (form.elements.namedItem("company") as HTMLInputElement | null)?.value ?? "";
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, company }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus({ kind: "sent" });
      setFields({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "Something went wrong." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className="card text-center" role="status">
        <CheckIcon width={32} height={32} className="mx-auto text-mint-deep" />
        <p className="mt-2 font-display text-xl font-semibold">Message sent!</p>
        <p className="mt-1">Thanks for reaching out, I&apos;ll reply soon.</p>
        <button type="button" className="btn btn-soft mt-4" onClick={() => setStatus({ kind: "idle" })}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="field-label">
            Name
          </label>
          <input
            id={`${id}-name`}
            name="name"
            required
            maxLength={100}
            autoComplete="name"
            className="field"
            value={fields.name}
            onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="field-label">
            Email
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            className="field"
            value={fields.email}
            onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
          />
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-message`} className="field-label">
          Message
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={4}
          className="field resize-y"
          value={fields.message}
          onChange={(e) => setFields((f) => ({ ...f, message: e.target.value }))}
        />
      </div>
      {/* honeypot for bots — hidden from people and assistive tech */}
      <div aria-hidden className="hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {status.kind === "error" && (
        <p role="alert" className="rounded-xl bg-[#ffe1e6] px-3 py-2 text-sm text-[#8a1f3a] dark:bg-[#ff8fa3]/15 dark:text-[#ffc2cd]">
          {status.message} You can also email me directly using the button below.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : "Send message"}
        </button>
        <a href={mailto} className="btn btn-soft">
          <MailIcon width={16} height={16} />
          Open in email app
        </a>
      </div>
    </form>
  );
}
