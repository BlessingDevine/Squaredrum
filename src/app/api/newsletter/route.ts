import { addToDrumroll } from "@/lib/drumroll";
import { EMAIL, clip, saveSignup } from "@/lib/inbox";

const DONE = "You're in — see you Friday.";

/** Drumroll sign-up: kept in Supabase and added to the Resend list. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  // The hidden "website" field is only ever filled by bots: pretend it worked.
  if (clip(body?.website, 200)) return Response.json({ message: DONE });
  const email = clip(body?.email, 200).toLowerCase();
  if (!EMAIL.test(email)) return Response.json({ error: "That email address doesn't look right." }, { status: 400 });

  const source = clip(body?.source, 40) || "squaredrum.com";
  const [kept, listed] = await Promise.allSettled([saveSignup(email, source), addToDrumroll(email)]);
  if (kept.status === "rejected") console.error("[drumroll] supabase", kept.reason);
  if (listed.status === "rejected") console.error("[drumroll] resend", listed.reason);
  // Either copy is enough: a Supabase-only sign-up is imported into Resend later.
  if (kept.status === "fulfilled" || (listed.status === "fulfilled" && listed.value === "added")) {
    return Response.json({ message: DONE });
  }
  return Response.json({ error: "Couldn't sign you up just now — try again later." }, { status: 500 });
}
