import "server-only";
import { createClient } from "@supabase/supabase-js";
import { AUDIO_BASE, SUPABASE_KEY, SUPABASE_URL } from "./config";
import { type ChannelTrack, type Rotation, onAirAt } from "./live-channel";
import { hashString } from "./seeded";
import { IMPRINTS, portraitFor, slugify } from "./site";

/**
 * The whole released catalogue, read from the Supabase project Musicsquare
 * Radio and GoSquare share, so anything added there shows up here too.
 *
 * ~2,600 songs is small enough to hold in memory. It is refetched at most
 * every five minutes; the last good copy is served if Supabase blips.
 * (Adapted from GoSquare's src/lib/catalog.ts — albums are derived from songs
 * because there is no albums table.)
 */

export type Song = {
  id: string;
  code: string;
  title: string;
  artist: string;
  artistSlug: string | null;
  album: string;
  albumSlug: string;
  trackNumber: number | null;
  durationMs: number;
  imprintSlug: string | null;
  src: string;
  cover: string | null;
  /** Marked explicit in the catalogue (songs.clean_explicit); shown with an E badge. */
  explicit: boolean;
};

export type Artist = {
  slug: string;
  name: string;
  genre: string | null;
  imprintSlug: string | null;
  imprintName: string | null;
  portrait: string | null;
  songCount: number;
  albumSlugs: string[];
};

export type Album = {
  slug: string;
  title: string;
  artist: string;
  artistSlug: string | null;
  imprintSlug: string | null;
  songIds: string[];
  durationMs: number;
  cover: string | null;
};

export type Imprint = {
  slug: string;
  name: string;
  genre: string;
  blurb: string;
  cover: string | null;
  logo: string | null;
  songCount: number;
  artistSlugs: string[];
  albumSlugs: string[];
  channelSlug: string | null;
};

export type Channel = {
  slug: string;
  name: string;
  imprintSlug: string | null;
  rotation: Rotation;
};

export type Catalog = {
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  imprints: Imprint[];
  channels: Channel[];
  songById: Map<string, Song>;
  songByCode: Map<string, Song>;
  artistBySlug: Map<string, Artist>;
  albumBySlug: Map<string, Album>;
  imprintBySlug: Map<string, Imprint>;
};

const PAGE = 1000; // PostgREST's default row cap per request
const TTL_MS = 5 * 60_000;

type ImprintRow = { imprint_id: string; imprint_name: string; slug: string; primary_genre: string };
type ArtistRow = { artist_id: string; artist_name: string; slug: string; genre: string | null; primary_imprint_id: string | null };
type SongRow = {
  song_id: string;
  song_code: string;
  title: string;
  album_title: string | null;
  track_number: number | null;
  duration_ms: number | null;
  primary_artist_id: string | null;
  primary_imprint_id: string | null;
  clean_explicit: string;
  song_files: { storage_key: string; file_type: string }[];
};
type StationRow = { slug: string; station_name: string; epoch: string; imprints: { slug: string } | null };
type TrackRow = {
  station_slug: string;
  song_code: string;
  title: string;
  artist_name: string | null;
  album_title: string | null;
  duration_ms: number;
  storage_key: string;
  cue_in_ms: number | null;
  cue_out_ms: number | null;
};
type CoverRow = { song_id: string; cover_key: string };
type ArtRow = { slug: string; cover_key: string | null; logo_key: string | null };

const db = createClient(new URL(SUPABASE_URL).origin, SUPABASE_KEY, { auth: { persistSession: false } });

async function paged<T>(page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>) {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await page(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) break;
  }
  return rows;
}

async function fetchAll() {
  return Promise.all([
    paged<ImprintRow>((a, b) => db.from("imprints").select("imprint_id, imprint_name, slug, primary_genre").order("imprint_name").range(a, b)),
    paged<ArtistRow>((a, b) => db.from("artists").select("artist_id, artist_name, slug, genre, primary_imprint_id").order("artist_name").range(a, b)),
    paged<SongRow>((a, b) =>
      db
        .from("songs")
        .select("song_id, song_code, title, album_title, track_number, duration_ms, primary_artist_id, primary_imprint_id, clean_explicit, song_files(storage_key, file_type)")
        .eq("song_files.file_type", "mp3")
        .order("song_code")
        .range(a, b),
    ),
    paged<StationRow>((a, b) =>
      db.from("radio_stations").select("slug, station_name, epoch, imprints(slug)").order("sort_order").range(a, b).returns<StationRow[]>(),
    ),
    paged<TrackRow>((a, b) =>
      db
        .from("channel_tracks")
        .select("station_slug, song_code, title, artist_name, album_title, duration_ms, storage_key, cue_in_ms, cue_out_ms")
        .order("station_slug")
        .order("sort_order")
        .range(a, b),
    ),
    paged<CoverRow>((a, b) => db.from("song_covers").select("song_id, cover_key").order("song_id").range(a, b)),
    paged<ArtRow>((a, b) => db.from("imprint_art").select("slug, cover_key, logo_key").order("slug").range(a, b)),
  ]);
}

/** Covers and label art exist on the CDN at 300, 600 and full size. */
export function sized(url: string | null, px: 300 | 600 | "full"): string | null {
  if (!url || px === "full") return url;
  return /\/audio\/(covers|imprints)\/[0-9a-f]+\.jpg$/.test(url) ? url.replace(/\.jpg$/, `-${px}.jpg`) : url;
}

function build([imprintRows, artistRows, songRows, stations, tracks, covers, art]: Awaited<ReturnType<typeof fetchAll>>): Catalog {
  const url = (key: string) => `${AUDIO_BASE}/${key}`;
  const imprintById = new Map(imprintRows.map((i) => [i.imprint_id, i]));
  const artistById = new Map(artistRows.map((a) => [a.artist_id, a]));
  const coverBySong = new Map(covers.map((c) => [c.song_id, url(c.cover_key)]));
  const artBySlug = new Map(art.map((a) => [a.slug, a]));

  const songs: Song[] = [];
  const usedAlbumSlugs = new Map<string, string>(); // slug → owner::album
  for (const r of songRows) {
    const file = r.song_files?.[0];
    if (!file || !r.duration_ms) continue; // nothing playable
    const artist = r.primary_artist_id ? artistById.get(r.primary_artist_id) : undefined;
    const imprint = r.primary_imprint_id ? imprintById.get(r.primary_imprint_id) : undefined;
    // Imprint compilations have no artist; the imprint is credited instead.
    const artistName = artist?.artist_name ?? imprint?.imprint_name ?? "Squaredrum";
    const owner = artist?.slug ?? imprint?.slug ?? "squaredrum";
    const album = r.album_title?.trim() || "Singles";
    const key = `${owner}::${album}`;
    let albumSlug = slugify(album === artistName ? album : `${album} ${artistName}`);
    if (usedAlbumSlugs.has(albumSlug) && usedAlbumSlugs.get(albumSlug) !== key) albumSlug = `${albumSlug}-${hashString(key).toString(36).slice(0, 4)}`;
    usedAlbumSlugs.set(albumSlug, key);
    songs.push({
      id: r.song_id,
      code: r.song_code,
      title: r.title,
      artist: artistName,
      artistSlug: artist?.slug ?? null,
      album,
      albumSlug,
      trackNumber: r.track_number,
      durationMs: r.duration_ms,
      imprintSlug: imprint?.slug ?? null,
      src: url(file.storage_key),
      cover: coverBySong.get(r.song_id) ?? null,
      explicit: r.clean_explicit === "explicit",
    });
  }
  // A fixed shuffled order per song (as in GoSquare), so lists look natural
  // and stay the same between visits.
  const place = new Map(songs.map((s) => [s.id, hashString(`order:${s.id}`)]));
  songs.sort((a, b) => place.get(a.id)! - place.get(b.id)!);
  const songById = new Map(songs.map((s) => [s.id, s]));

  const albumBySlug = new Map<string, Album>();
  for (const s of songs) {
    let album = albumBySlug.get(s.albumSlug);
    if (!album) {
      album = { slug: s.albumSlug, title: s.album, artist: s.artist, artistSlug: s.artistSlug, imprintSlug: s.imprintSlug, songIds: [], durationMs: 0, cover: null };
      albumBySlug.set(s.albumSlug, album);
    }
    album.songIds.push(s.id);
    album.durationMs += s.durationMs;
    album.cover ??= s.cover;
  }
  for (const album of albumBySlug.values()) {
    album.songIds.sort((a, b) => (songById.get(a)!.trackNumber ?? 999) - (songById.get(b)!.trackNumber ?? 999) || place.get(a)! - place.get(b)!);
  }
  const albums = [...albumBySlug.values()].sort((a, b) => Number(!!b.cover) - Number(!!a.cover) || a.title.localeCompare(b.title));

  const artists: Artist[] = artistRows
    .map((a) => {
      const imprint = a.primary_imprint_id ? imprintById.get(a.primary_imprint_id) : undefined;
      const mine = albums.filter((al) => al.artistSlug === a.slug);
      return {
        slug: a.slug,
        name: a.artist_name,
        genre: a.genre,
        imprintSlug: imprint?.slug ?? null,
        imprintName: imprint ? (IMPRINTS.find((i) => i.slug === imprint.slug)?.name ?? imprint.imprint_name) : null,
        portrait: portraitFor(a.slug),
        songCount: mine.reduce((n, al) => n + al.songIds.length, 0),
        albumSlugs: mine.map((al) => al.slug),
      };
    })
    .filter((a) => a.songCount > 0)
    // Artists with photos first; then by size of catalogue.
    .sort((a, b) => Number(!!b.portrait) - Number(!!a.portrait) || b.songCount - a.songCount);

  const tracksBySlug = new Map<string, ChannelTrack[]>();
  for (const r of tracks) {
    const list = tracksBySlug.get(r.station_slug) ?? [];
    list.push({
      code: r.song_code,
      title: r.title,
      artist: r.artist_name ?? "Musicsquare Radio",
      album: r.album_title,
      durationMs: r.duration_ms,
      cueInMs: r.cue_in_ms ?? 0,
      cueOutMs: Math.min(r.cue_out_ms ?? r.duration_ms, r.duration_ms),
      src: url(r.storage_key),
    });
    tracksBySlug.set(r.station_slug, list);
  }
  const channels: Channel[] = stations
    .map((s) => ({
      slug: s.slug,
      name: s.station_name,
      imprintSlug: s.imprints?.slug ?? null,
      rotation: { slug: s.slug, epoch: Date.parse(s.epoch), tracks: tracksBySlug.get(s.slug) ?? [] },
    }))
    .filter((c) => c.rotation.tracks.length > 0);

  // All eighteen imprints are listed, including ones still waiting for music.
  const imprints: Imprint[] = IMPRINTS.map((i) => {
    const a = artBySlug.get(i.slug);
    const cover = a?.cover_key ?? a?.logo_key ?? null; // Gravedigger has a logo only
    return {
      ...i,
      cover: cover ? url(cover) : null,
      logo: a?.logo_key ? url(a.logo_key) : null,
      songCount: songs.filter((s) => s.imprintSlug === i.slug).length,
      artistSlugs: artists.filter((ar) => ar.imprintSlug === i.slug).map((ar) => ar.slug),
      albumSlugs: albums.filter((al) => al.imprintSlug === i.slug && al.cover).map((al) => al.slug),
      channelSlug: channels.find((c) => c.imprintSlug === i.slug)?.slug ?? null,
    };
  });

  return {
    songs,
    artists,
    albums,
    imprints,
    channels,
    songById,
    songByCode: new Map(songs.map((s) => [s.code, s])),
    artistBySlug: new Map(artists.map((a) => [a.slug, a])),
    albumBySlug,
    imprintBySlug: new Map(imprints.map((i) => [i.slug, i])),
  };
}

let cache: { at: number; catalog: Catalog } | null = null;
let inflight: Promise<Catalog> | null = null;

export async function getCatalog(): Promise<Catalog> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.catalog;
  inflight ??= fetchAll()
    .then((rows) => {
      const catalog = build(rows);
      cache = { at: Date.now(), catalog };
      return catalog;
    })
    .catch((err) => {
      console.error("[catalog]", err);
      if (cache) return cache.catalog;
      throw err;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/** What a live channel is airing now, for the On Air deck. */
export type OnAirNow = {
  slug: string;
  name: string;
  imprintSlug: string | null;
  title: string;
  artist: string;
  artistSlug: string | null;
  album: string | null;
  albumSlug: string | null;
  cover: string | null;
  src: string;
  /** Wall time at which position 0 of the file would have played. */
  startedAt: number;
  /** When the next song takes over. */
  endsAt: number;
};

/** The on-air list plus the moment it was computed, for a first paint that matches. */
export async function getOnAirSnapshot() {
  const at = Date.now();
  return { at, channels: await getOnAir(at) };
}

export async function getOnAir(at = Date.now()): Promise<OnAirNow[]> {
  const c = await getCatalog();
  return c.channels.flatMap((ch) => {
    const air = onAirAt(ch.rotation, at);
    if (!air) return [];
    const song = c.songByCode.get(air.track.code);
    return [
      {
        slug: ch.slug,
        name: ch.name,
        imprintSlug: ch.imprintSlug,
        title: air.track.title,
        artist: air.track.artist,
        artistSlug: song?.artistSlug && c.artistBySlug.has(song.artistSlug) ? song.artistSlug : null,
        album: air.track.album,
        albumSlug: song?.albumSlug ?? null,
        cover: sized(song?.cover ?? null, 600),
        src: air.track.src,
        startedAt: air.startedAt,
        endsAt: air.endsAt,
      },
    ];
  });
}

