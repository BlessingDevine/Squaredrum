import type { Catalog, Song } from "./catalog";
import { sized } from "./catalog";

/** A catalogue song as something the player and track lists understand. */
export function toRow(s: Song, c: Catalog) {
  return {
    id: s.id,
    title: s.title,
    artist: s.artist,
    artistHref: s.artistSlug && c.artistBySlug.has(s.artistSlug) ? `/artists/${s.artistSlug}` : null,
    cover: sized(s.cover, 300),
    src: s.src,
    album: s.album,
    albumHref: `/releases/${s.albumSlug}`,
    durationMs: s.durationMs,
    explicit: s.explicit,
  };
}
