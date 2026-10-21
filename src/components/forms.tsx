"use client";

import Link from "next/link";
import { useState } from "react";
import { CONTACT_EMAIL } from "@/lib/config";
import { TOPICS } from "@/lib/site";

type Status = { kind: "idle" | "sending" | "ok" | "err"; text?: string };

async function post(url: string, body: unknown): Promise<Status> {
  try {
    const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json().catch(() => ({}));
    return res.ok ? { kind: "ok", text: json.message } : { kind: "err", text: json.error };
  } catch {
    return { kind: "err" };
  }
}

/** Drumroll, the Friday email: new music every Friday plus Squaredrum news. */
export function DrumrollForm({ source = "squaredrum.com", tone = "dark" }: { source?: string; tone?: "dark" | "light" }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  if (status.kind === "ok") {
    return <p className={`drumroll-done mono ${tone}`}>{status.text ?? "You're in — see you Friday."}</p>;
  }
  return (
    <>
      <form
        className={`news ${tone}`}
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          setStatus({ kind: "sending" });
          const data = new FormData(form);
          setStatus(await post("/api/newsletter", { email: data.get("email"), website: data.get("website"), source }));
        }}
      >
        <input type="email" name="email" required placeholder="Your email" aria-label="Email for Drumroll" autoComplete="email" />
        <button className="mono" type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "…" : "Join →"}
        </button>
        {/* Bots fill every field; people never see this one. */}
        <input name="website" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: -9999 }} aria-hidden="true" />
      </form>
      <p className={`news-note ${tone}`}>
        Every Friday: new releases and Squaredrum news. Unsubscribe any time.{" "}
        <Link href="/privacy">Privacy</Link>
      </p>
      {status.kind === "err" && <p className="form-note mono" style={{ color: "#e5847f", marginTop: 10 }}>{status.text ?? "Something went wrong — try again."}</p>}
    </>
  );
}

export function ContactForm({ topic }: { topic?: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  if (status.kind === "ok") {
    return (
      <div className="form-note ok">
        <b className="display" style={{ fontSize: 40, display: "block", color: "var(--ink)" }}>Message received.</b>
        Thanks — we&apos;ll get back to you soon.
      </div>
    );
  }
  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        setStatus({ kind: "sending" });
        setStatus(await post("/api/contact", data));
      }}
    >
      <div className="row">
        <div className="field">
          <label htmlFor="c-name">Name</label>
          <input id="c-name" name="name" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="c-email">Email</label>
          <input id="c-email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label htmlFor="c-company">Company (optional)</label>
          <input id="c-company" name="company" autoComplete="organization" />
        </div>
        <div className="field">
          <label htmlFor="c-topic">Topic</label>
          <select id="c-topic" name="topic" defaultValue={topic ?? "General"}>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="c-msg">Message</label>
        <textarea id="c-msg" name="message" required />
      </div>
      {/* Bots fill every field; people never see this one. */}
      <input name="website" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: -9999 }} aria-hidden="true" />
      <p className="form-note">
        We only use your details to reply to you. See our <Link href="/privacy">privacy policy</Link>.
      </p>
      <div>
        <button className="btn btn-ink" type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : "Send message →"}
        </button>
      </div>
      {status.kind === "err" && (
        <p className="form-note err">
          {status.text ?? "Your message couldn't be sent."} You can also email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      )}
    </form>
  );
}
