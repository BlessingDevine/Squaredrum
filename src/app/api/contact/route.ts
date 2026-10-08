import { EMAIL, clip, saveMessage } from "@/lib/inbox";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "Bad request." }, { status: 400 });
  // The hidden "website" field is only ever filled by bots: pretend it worked.
  if (clip(body.website, 200)) return Response.json({ message: "Thanks!" });
  const name = clip(body.name, 120);
  const email = clip(body.email, 200);
  const message = clip(body.message, 5000);
  if (!name || !message) return Response.json({ error: "Please add your name and a message." }, { status: 400 });
  if (!EMAIL.test(email)) return Response.json({ error: "That email address doesn't look right." }, { status: 400 });
  try {
    await saveMessage({ name, email, company: clip(body.company, 200) || null, topic: clip(body.topic, 60) || "General", message });
    return Response.json({ message: "Thanks — we'll be in touch." });
  } catch (err) {
    console.error("[contact]", err);
    return Response.json({ error: "Your message couldn't be sent." }, { status: 500 });
  }
}
