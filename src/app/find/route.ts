import { getCatalog } from "@/lib/catalog";
import { SITE_URL } from "@/lib/config";

/**
 * squaredrum.com/find?title=…&artist=…: Musicsquare Radio's "on air" links
 * land here. The radio's main stream (RadioKing) only knows a song's title and
 * artist name, so this finds the song in the catalogue and sends the listener
 * to its album page. No match: the Releases page.
 */
const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const title = norm(q.get("title") ?? "");
  const artist = norm(q.get("artist") ?? "");
  let to = `${SITE_URL}/releases`;
  if (title) {
    const c = await getCatalog();
    const hits = c.songs.filter((s) => norm(s.title) === title);
    const song = hits.find((s) => artist && norm(s.artist) === artist) ?? hits[0];
    if (song) to = `${SITE_URL}/releases/${song.albumSlug}`;
  }
  return new Response(null, { status: 302, headers: { Location: to, "Cache-Control": "public, max-age=300" } });
}
