import type { Artist, Catalog } from "./catalog";
import { LYRIC_LINES } from "./lyric-lines";
import { ARTIST_MOODS } from "./moods";
import { OWN_WORDS } from "./own-words";
import { toRow } from "./rows";
import { seededShuffle } from "./seeded";
import { START_HERE } from "./start-here";

const fold = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** An artist's "Start here" picks (start-here.ts) found among their songs, as player rows. */
export function startPicks(slug: string, all: ReturnType<typeof toRow>[]) {
  return (START_HERE[slug] ?? []).flatMap(({ title, why, album, show }) => {
    const row = all.find((r) => fold(r.title) === fold(title) && (!album || r.album === album));
    return row ? [{ ...row, title: show ?? row.title, why }] : [];
  });
}

export type RosterExtras = {
  /** Newest album's Canvas loop, as on the artist page. */
  canvas: string | null;
  lines: { line: string; title: string }[];
  /** First Start here song, ready for the player. */
  start: ReturnType<typeof toRow> | null;
  /** One "In their own words" answer, a different one each day. */
  words: { q: string; a: string } | null;
  /** Has an album out in the last seven days (New Music Friday). */
  isNew: boolean;
  moods: string[];
};

/** What /artists shows on top of the photo for each artist: all from content already approved. */
export function rosterExtras(a: Artist, c: Catalog, now = Date.now()): RosterExtras {
  const albums = a.albumSlugs.map((s) => c.albumBySlug.get(s)).filter((al) => !!al);
  const all = albums.flatMap((al) => al.songIds.map((id) => toRow(c.songById.get(id)!, c)));
  const day = new Date(now).toISOString().slice(0, 10);
  const week = new Date(now - 7 * 86_400_000).toISOString().slice(0, 10);
  const qa = OWN_WORDS[a.slug] ?? [];
  return {
    canvas: albums.find((al) => al.canvas)?.canvas ?? null,
    lines: LYRIC_LINES[a.slug] ?? [],
    start: startPicks(a.slug, all)[0] ?? null,
    words: qa.length ? seededShuffle(qa, `words:${a.slug}:${day}`)[0] : null,
    // Only full dates count ("2026-10-23"); a bare year or month is an old release.
    isNew: albums.some((al) => /^\d{4}-\d\d-\d\d$/.test(al.released) && al.released >= week && al.released <= day),
    moods: ARTIST_MOODS[a.slug] ?? [],
  };
}
