import "server-only";

/**
 * Website sign-ups for Drumroll, the Friday email (New Music Friday and
 * Squaredrum news), sent with Resend from the radio repo
 * (scripts/newsletter/send.mjs). Each sign-up becomes a Resend contact in the
 * Drumroll segment.
 *
 * Needs two Vercel environment variables, which Robert sets himself:
 *   RESEND_API_KEY     a Resend key with full access
 *   RESEND_SEGMENT_ID  the Drumroll segment (Resend → Audience → Segments)
 * Without them sign-ups are still kept in Supabase (newsletter_signups), to
 * be imported into Resend later.
 */

const API = "https://api.resend.com";

async function call(path: string, method: string, body?: unknown) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  return { ok: res.ok, status: res.status, json: (await res.json().catch(() => ({}))) as { message?: string } };
}

/** Adds (or re-subscribes) an email to the Drumroll list. "skipped" when Resend isn't set up yet. */
export async function addToDrumroll(email: string): Promise<"added" | "skipped"> {
  const segment = process.env.RESEND_SEGMENT_ID;
  if (!process.env.RESEND_API_KEY || !segment) return "skipped";

  const created = await call("/contacts", "POST", { email, unsubscribed: false, segments: [{ id: segment }] });
  if (created.ok) return "added";

  // Already a contact (e.g. a GoSquare sign-in, or signing up twice): they're
  // asking for Drumroll now, so subscribe them and add them to the list.
  if (created.status === 409 || created.status === 422 || /exist/i.test(created.json.message ?? "")) {
    const id = encodeURIComponent(email);
    const updated = await call(`/contacts/${id}`, "PATCH", { unsubscribed: false });
    const joined = await call(`/contacts/${id}/segments/${segment}`, "POST");
    if (updated.ok && (joined.ok || joined.status === 409)) return "added";
    throw new Error(`Resend ${updated.status}/${joined.status}: ${joined.json.message ?? updated.json.message ?? ""}`);
  }
  throw new Error(`Resend ${created.status}: ${created.json.message ?? ""}`);
}
