import { getRotation } from "@/lib/catalog";

export const revalidate = 300;

/** A channel's full rotation, which the player needs to mix into each next song. */
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const data = await getRotation(slug);
  if (!data) return Response.json({ error: "No such channel" }, { status: 404 });
  return Response.json(data, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
}
