import { getOnAir } from "@/lib/catalog";

export const dynamic = "force-dynamic";

/**
 * What every Musicsquare Radio channel is playing right now, or at `?at=`
 * (ms, up to an hour ahead) so the player can line up the next song early.
 */
export async function GET(req: Request) {
  const now = Date.now();
  const asked = Number(new URL(req.url).searchParams.get("at"));
  const at = Number.isFinite(asked) && asked > now && asked < now + 3_600_000 ? asked : now;
  return Response.json(await getOnAir(at), { headers: { "Cache-Control": "no-store" } });
}
