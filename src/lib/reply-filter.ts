/**
 * Sorting email that arrives at @gosquare.app (Resend receiving → the
 * webhook at /api/inbound). Drumroll goes out from drumroll@gosquare.app with
 * reply-to fans@gosquare.app; GoSquare sign-in codes come from
 * hello@gosquare.app. Replies are sorted into:
 *   auto         out-of-office, bounces, "no longer monitored"… dropped
 *   unsubscribe  a short "unsubscribe"/"stop" reply: taken off Drumroll
 *   fans         a person replying to Drumroll → fans@squaredrum.com
 *   support      anything else → support@squaredrum.com
 * Kept apart from the route so it can be tested with sample emails.
 */

export type Inbound = {
  from: string;
  to: string[];
  subject: string;
  text: string | null;
  html: string | null;
  headers: Record<string, string>;
};

export type Verdict = "auto" | "unsubscribe" | "fans" | "support" | "loop";

export const FORWARD_TO = { fans: "fans@squaredrum.com", support: "support@squaredrum.com" } as const;

const AUTO_SENDER = /^(mailer-daemon|postmaster|no-?reply|do-?not-?reply|bounces?)[@+]/i;
const AUTO_SUBJECT =
  /^(auto(matic)?[ -]?reply|out of (the )?office|ooo\b|away from|on (vacation|holiday|leave)|undeliver|delivery status|mail delivery|returned mail|delivery failure|abwesenheit|r[ée]ponse automatique|respuesta autom[áa]tica)/i;
const UNSUBSCRIBE = /^(please\s+)?(unsubscribe|stop|remove( me)?|take me off|opt[ -]?out|cancel)\b/i;

/** The address part of "Name <a@b.c>", lower-cased. */
export const address = (s: string) => (s.match(/<([^>]+)>/)?.[1] ?? s).trim().toLowerCase();

/** What the person wrote, without the quoted email below it. */
export function ownWords(text: string | null, html: string | null): string {
  const body = text ?? (html ?? "").replace(/<(br|\/p|\/div)[^>]*>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ");
  const lines: string[] = [];
  for (const line of body.split(/\r?\n/)) {
    // Where mail apps start quoting: "> …", "On Fri … wrote:", "-----Original Message-----", "From: …".
    if (/^\s*>/.test(line) || /^\s*on .{4,200} wrote:\s*$/i.test(line) || /^-{2,}\s*original message/i.test(line) || /^\s*from:\s/i.test(line)) break;
    lines.push(line);
  }
  return lines.join("\n").trim();
}

export function classify(m: Inbound): Verdict {
  const h = Object.fromEntries(Object.entries(m.headers ?? {}).map(([k, v]) => [k.toLowerCase(), String(v)]));
  const from = address(m.from);
  // Our own addresses: a bounce or forward coming back round. Never pass it on.
  if (from.endsWith("@gosquare.app") || from.endsWith("@squaredrum.com")) return "loop";

  if (
    (h["auto-submitted"] && h["auto-submitted"].toLowerCase() !== "no") ||
    h["x-autoreply"] ||
    h["x-autorespond"] ||
    h["x-auto-response-suppress"]?.toLowerCase().includes("all") ||
    /^(auto_reply|bulk|junk)$/i.test(h["precedence"] ?? "") ||
    AUTO_SENDER.test(from) ||
    AUTO_SUBJECT.test(m.subject.replace(/^(re|aw|fwd?):\s*/i, ""))
  )
    return "auto";

  const words = ownWords(m.text, m.html);
  // Strict on purpose: only a short reply that leads with the request. A longer
  // message that mentions "unsubscribe" goes to a person instead.
  if (words.split(/\s+/).filter(Boolean).length <= 12 && UNSUBSCRIBE.test(words)) return "unsubscribe";

  // fans@ is Drumroll's reply-to; issues sent before it was set reply to drumroll@ itself.
  return m.to.some((t) => /^(fans|drumroll)@/.test(address(t))) ? "fans" : "support";
}
