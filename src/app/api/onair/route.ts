import { getOnAir } from "@/lib/catalog";

export const dynamic = "force-dynamic";

/** What every Musicsquare Radio channel is playing right now. */
export async function GET() {
  return Response.json(await getOnAir(), { headers: { "Cache-Control": "no-store" } });
}
