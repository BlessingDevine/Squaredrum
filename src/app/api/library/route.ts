import { getCatalog } from "@/lib/catalog";
import { img } from "@/lib/img";
import { toRow } from "@/lib/rows";

/**
 * Song and artist details for a listener's library (the Account page asks
 * for the ids it got from their likes, playlists and follows). Only public
 * catalogue data; the ids themselves come from the listener's own browser.
 *   GET /api/library?songs=<id>,<id>&artists=<id>,<id>
 */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const list = (k: string) => (q.get(k) ?? "").split(",").filter(Boolean).slice(0, 2000);
  const c = await getCatalog();
  const songs = list("songs").flatMap((id) => {
    const s = c.songById.get(id);
    return s ? [toRow(s, c)] : [];
  });
  const byId = new Map(c.artists.map((a) => [a.id, a]));
  const artists = list("artists").flatMap((id) => {
    const a = byId.get(id);
    return a ? [{ id: a.id, slug: a.slug, name: a.name, genre: a.genre, portrait: a.portrait ? img(a.portrait, 640) : null }] : [];
  });
  return Response.json({ songs, artists });
}
