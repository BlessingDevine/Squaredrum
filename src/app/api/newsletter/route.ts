import { EMAIL, clip, saveSignup } from "@/lib/inbox";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = clip(body?.email, 200);
  if (!EMAIL.test(email)) return Response.json({ error: "That email address doesn't look right." }, { status: 400 });
  try {
    await saveSignup(email, "squaredrum.com");
    return Response.json({ message: "You're on the list." });
  } catch (err) {
    console.error("[newsletter]", err);
    return Response.json({ error: "Couldn't sign you up just now — try again later." }, { status: 500 });
  }
}
