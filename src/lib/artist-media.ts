import "server-only";
import { createClient } from "@supabase/supabase-js";
import { AUDIO_BASE, SUPABASE_KEY, SUPABASE_URL } from "./config";

/**
 * An artist's own page material beyond the music: the photos and bio from
 * their Photos/ and Press Kit/ folders (put on the CDN by the radio repo's
 * scripts/catalog/photos.mjs) and the videos made for their songs.
 * Artists without a photo index keep the simple page.
 */

export type Photo = {
  id: string;
  role: "hero" | "gallery";
  shape: "tall" | "wide" | "square";
  width: number;
  height: number;
  name: string;
  srcSet: string;
  /** ~960 px wide, for grids. */
  src: string;
  /** The largest size, for full screen. */
  full: string;
};

export type Video = { songId: string; title: string; kind: string; src: string; poster: string | null; width: number; height: number };

export type ArtistMedia = { photos: Photo[]; bio: string | null; videos: Video[] };

type Index = { bio: string | null; photos: { id: string; role: Photo["role"]; shape: Photo["shape"]; width: number; height: number; widths: number[]; name: string }[] };

const db = createClient(new URL(SUPABASE_URL).origin, SUPABASE_KEY, { auth: { persistSession: false } });

async function photoIndex(slug: string): Promise<Index | null> {
  try {
    const r = await fetch(`${AUDIO_BASE}/audio/photos/${slug}/index.json`, { next: { revalidate: 300 } });
    return r.ok ? ((await r.json()) as Index) : null;
  } catch {
    return null;
  }
}

const KIND_ORDER = ["music_video", "lyric_video", "clip"];

export async function getArtistMedia(slug: string, songs: { id: string; title: string }[]): Promise<ArtistMedia | null> {
  const index = await photoIndex(slug);
  if (!index?.photos.length) return null;
  const base = `${AUDIO_BASE}/audio/photos/${slug}`;
  const photos = index.photos.map((p) => ({
    id: p.id,
    role: p.role,
    shape: p.shape,
    width: p.width,
    height: p.height,
    name: p.name,
    srcSet: p.widths.map((w) => `${base}/${p.id}-${w}.jpg ${w}w`).join(", "),
    src: `${base}/${p.id}-${p.widths.find((w) => w >= 960) ?? p.widths.at(-1)}.jpg`,
    full: `${base}/${p.id}-${p.widths.at(-1)}.jpg`,
  }));

  const titles = new Map(songs.map((s) => [s.id, s.title]));
  const { data } = await db
    .from("song_videos")
    .select("song_id, kind, storage_key, poster_key, width, height")
    .in("song_id", [...titles.keys()])
    .in("kind", KIND_ORDER);
  const videos = (data ?? [])
    .map((v) => ({
      songId: v.song_id as string,
      title: titles.get(v.song_id) ?? "",
      kind: v.kind as string,
      src: `${AUDIO_BASE}/${v.storage_key}`,
      poster: v.poster_key ? `${AUDIO_BASE}/${v.poster_key}` : null,
      width: v.width as number,
      height: v.height as number,
    }))
    .sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind));

  return { photos, bio: index.bio, videos };
}
