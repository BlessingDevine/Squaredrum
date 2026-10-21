import { createHmac, timingSafeEqual } from "node:crypto";
import { FORWARD_TO, type Inbound, address, classify } from "@/lib/reply-filter";

/**
 * Resend calls this for every email that arrives at @gosquare.app (webhook
 * "email.received"). It drops automatic replies, takes "unsubscribe" replies
 * off Drumroll, and forwards the rest to fans@ or support@squaredrum.com with
 * reply-to set to the sender, so answering goes straight back to them.
 *
 * Needs Vercel env vars, set by Robert: RESEND_API_KEY (already there) and
 * RESEND_WEBHOOK_SECRET (Resend → Webhooks → the squaredrum.com/api/inbound
 * webhook → Signing secret).
 */

const API = "https://api.resend.com";
const FROM = "Squaredrum replies <replies@gosquare.app>";
const TAG = { fans: "[Drumroll reply]", support: "[GoSquare support]" } as const;

async function resend(path: string, method = "GET", body?: unknown) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  return { ok: res.ok, status: res.status, json: await res.json().catch(() => ({})) };
}

/** Resend signs webhooks the Svix way: HMAC-SHA256 of "id.timestamp.body" with the secret after "whsec_". */
function signedByResend(req: Request, payload: string, secret: string) {
  const id = req.headers.get("svix-id");
  const ts = req.headers.get("svix-timestamp");
  const sigs = req.headers.get("svix-signature");
  if (!id || !ts || !sigs) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false; // replayed or stale
  const expected = createHmac("sha256", Buffer.from(secret.replace(/^whsec_/, ""), "base64"))
    .update(`${id}.${ts}.${payload}`)
    .digest();
  return sigs.split(" ").some((s) => {
    const got = Buffer.from(s.split(",")[1] ?? "", "base64");
    return got.length === expected.length && timingSafeEqual(got, expected);
  });
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

async function forward(m: Inbound & { attachments?: { filename: string }[] }, box: "fans" | "support") {
  const files = (m.attachments ?? []).map((a) => a.filename).filter(Boolean);
  const note =
    `<div style="font:13px/1.5 sans-serif;color:#555;border-bottom:1px solid #ddd;padding:0 0 10px;margin:0 0 14px">` +
    `From <b>${esc(m.from)}</b> to ${esc(m.to.join(", "))}. Reply to answer them directly.` +
    (files.length ? `<br>Attachments (open in Resend → Inboxes): ${esc(files.join(", "))}` : "") +
    `</div>`;
  const body = m.html ?? `<pre style="font:14px/1.5 sans-serif;white-space:pre-wrap">${esc(m.text ?? "")}</pre>`;
  return resend("/emails", "POST", {
    from: FROM,
    to: [FORWARD_TO[box]],
    reply_to: [address(m.from)],
    subject: `${TAG[box]} ${m.subject || "(no subject)"}`,
    html: note + body,
  });
}

export async function POST(req: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  // Not set up yet: Resend keeps retrying, so nothing is lost while the secret goes in.
  if (!secret || !process.env.RESEND_API_KEY) return new Response("Not configured", { status: 503 });

  const payload = await req.text();
  if (!signedByResend(req, payload, secret)) return new Response("Bad signature", { status: 401 });
  const event = JSON.parse(payload) as { type?: string; data?: { email_id?: string } };
  if (event.type !== "email.received" || !event.data?.email_id) return Response.json({ ignored: true });

  const got = await resend(`/emails/receiving/${event.data.email_id}?html_format=cid`);
  if (!got.ok) return new Response(`Resend ${got.status}`, { status: 502 });
  const m = got.json as Inbound & { attachments?: { filename: string }[] };

  let verdict = classify(m);
  if (verdict === "unsubscribe") {
    const off = await resend(`/contacts/${encodeURIComponent(address(m.from))}`, "PATCH", { unsubscribed: true });
    // Not on the list (e.g. replying to a sign-in code): a person should see it.
    if (!off.ok) verdict = "support";
  }
  if (verdict === "fans" || verdict === "support") {
    const sent = await forward(m, verdict);
    if (!sent.ok) {
      console.error("[inbound] forward failed", sent.status, sent.json);
      return new Response("Forward failed", { status: 502 }); // Resend retries
    }
  }
  console.log("[inbound]", verdict, address(m.from).replace(/^(.).*@/, "$1…@"), m.to.join(","));
  return Response.json({ verdict });
}
