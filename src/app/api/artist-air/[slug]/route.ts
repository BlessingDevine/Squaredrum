import { getArtistAir } from "@/lib/catalog";

export const dynamic = "force-dynamic";

/** An artist's songs on the radio channels: on air now, or next within three hours (artist-on-air.tsx). */
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  return Response.json(await getArtistAir(slug), { headers: { "Cache-Control": "no-store" } });
}
