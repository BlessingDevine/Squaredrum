import { getCatalog } from "@/lib/catalog";
import { toRow } from "@/lib/rows";

/**
 * /api/album/<slug>: an album's songs as player items, in track order. The stack picker uses it to
 * play an album straight from a stack without opening its page.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCatalog();
  const al = c.albumBySlug.get(slug);
  if (!al) return Response.json({ error: "not found" }, { status: 404 });
  const items = al.songIds.map((id) => toRow(c.songById.get(id)!, c));
  return Response.json({ items }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
}
