"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ChannelMixer, type MixerStatus, type Playing, probeAudioCors } from "@/lib/channel-mixer";
import { type Rotation, onAirAt } from "@/lib/live-channel";

/**
 * The site's player, so music keeps playing while people move between pages.
 * Two ways to play:
 * - a list of songs (an album, an artist's tracks, a release), through one
 *   audio element;
 * - a live Musicsquare Radio channel, through the radio's own ChannelMixer
 *   (src/lib/channel-mixer.ts, copied from musicsquareradio-2026 — keep the
 *   two identical): joined at the second everyone else is hearing, songs
 *   crossfading into each other on computers, and on phones each song played
 *   whole, start to end (see the mixer's notes).
 *
 * play() is always called inside the tap itself: iOS Safari refuses it after
 * an await. The album element never sets crossOrigin (a CloudFront edge
 * without CORS headers would then refuse every song).
 */

export type PlayItem = {
  id: string;
  title: string;
  artist: string;
  artistHref?: string | null;
  cover: string | null;
  src: string;
  /** A live channel: `air` is the song on now, so the mixer can start from it inside the tap. */
  live?: { slug: string; name: string; air?: Playing };
};

type Player = {
  current: PlayItem | null;
  playing: boolean;
  queue: PlayItem[];
  index: number;
  playList: (items: PlayItem[], start?: number) => void;
  playLive: (item: PlayItem) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  /** Jump `seconds` back (negative) or forward in an album song; live channels can't be skipped. */
  skip: (seconds: number) => void;
  audio: () => HTMLAudioElement | null;
};

const Ctx = createContext<Player | null>(null);

export function usePlayer() {
  const p = useContext(Ctx);
  if (!p) throw new Error("usePlayer outside <PlayerProvider>");
  return p;
}

/** Current position and length of an album song, updated as it plays. */
export function useProgress() {
  const { audio } = usePlayer();
  const [t, setT] = useState({ time: 0, duration: 0 });
  useEffect(() => {
    const el = audio();
    if (!el) return;
    const on = () => setT({ time: el.currentTime, duration: Number.isFinite(el.duration) ? el.duration : 0 });
    el.addEventListener("timeupdate", on);
    el.addEventListener("loadedmetadata", on);
    el.addEventListener("emptied", on);
    return () => {
      el.removeEventListener("timeupdate", on);
      el.removeEventListener("loadedmetadata", on);
      el.removeEventListener("emptied", on);
    };
  }, [audio]);
  return t;
}

type OnAir = Playing & { slug: string; name: string; cover: string | null; artistSlug?: string | null };
type TrackMeta = Record<string, { cover: string | null; artistSlug: string | null }>;
type Channel = { name: string; rotation: Rotation; meta: TrackMeta };

/** A live channel's current song (from /api/onair) as something the player can play. */
export function liveItem(c: Pick<OnAir, "slug" | "name" | "cover" | "track" | "startedAt" | "endsAt" | "fadeMs"> & { artistSlug?: string | null }): PlayItem {
  return {
    id: `live:${c.slug}:${c.startedAt}`,
    title: c.track.title,
    artist: c.track.artist,
    artistHref: c.artistSlug ? `/artists/${c.artistSlug}` : null,
    cover: c.cover,
    src: c.track.src,
    live: { slug: c.slug, name: c.name, air: { track: c.track, startedAt: c.startedAt, endsAt: c.endsAt, fadeMs: c.fadeMs } },
  };
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<PlayItem[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = queue[index] ?? null;
  const currentRef = useRef<PlayItem | null>(null);
  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  // --- live channels: the radio's mixer -------------------------------------

  const mixerRef = useRef<ChannelMixer | null>(null);
  const liveSlug = useRef<string | null>(null);
  // Set before the mixer starts: it reports the first song from inside start().
  const liveName = useRef("");
  // "error" when the phone refused to start a song: a tap on ▶ then restarts the channel.
  const liveStatus = useRef<MixerStatus | null>(null);
  // The item that started the channel: its cover and artist link stand in
  // until the rotation (with every song's) has loaded.
  const liveHint = useRef<PlayItem | null>(null);
  const channels = useRef(new Map<string, Promise<Channel | null>>());
  // Rotations already here, needed to rejoin a channel inside a tap.
  const ready = useRef(new Map<string, Channel>());

  const channel = useCallback((slug: string) => {
    let p = channels.current.get(slug);
    if (!p) {
      p = fetch(`/api/rotation/${slug}`)
        .then((r) => (r.ok ? (r.json() as Promise<Channel>) : null))
        .catch(() => null);
      channels.current.set(slug, p);
      p.then((c) => {
        if (c) ready.current.set(slug, c);
        else channels.current.delete(slug); // retried next time
      });
    }
    return p;
  }, []);

  const ensureMixer = useCallback(() => {
    if (!mixerRef.current) {
      mixerRef.current = new ChannelMixer({
        getRotation: async () => {
          const slug = liveSlug.current;
          return slug ? ((await channel(slug))?.rotation ?? null) : null;
        },
        onStatus: (s: MixerStatus) => {
          liveStatus.current = s;
          if (liveSlug.current) setPlaying(s !== "error");
        },
        onTrack: (air: Playing) => {
          const slug = liveSlug.current;
          if (!slug) return;
          const ch = ready.current.get(slug);
          const meta = ch?.meta[air.track.code];
          const hint = liveHint.current?.live?.air?.track.code === air.track.code ? liveHint.current : null;
          setQueue([
            liveItem({
              slug,
              name: liveName.current || ch?.name || "",
              track: air.track,
              startedAt: air.startedAt,
              endsAt: air.endsAt,
              fadeMs: air.fadeMs,
              cover: meta?.cover ?? hint?.cover ?? null,
              artistSlug: meta?.artistSlug ?? hint?.artistHref?.replace("/artists/", "") ?? null,
            }),
          ]);
          setIndex(0);
        },
      });
      if (process.env.NODE_ENV === "development" || location.search.includes("debug")) {
        (window as unknown as { __mixer?: ChannelMixer }).__mixer = mixerRef.current;
      }
    }
    return mixerRef.current;
  }, [channel]);

  // The crossfade fetches song openings cross-origin; check once, early, that it may.
  useEffect(() => {
    fetch("/api/onair", { cache: "no-store" })
      .then((r) => r.json())
      .then((all: OnAir[]) => all[0] && probeAudioCors(all[0].track.src))
      .catch(() => {});
  }, []);

  const stopLive = useCallback(() => {
    mixerRef.current?.stop();
    liveSlug.current = null;
  }, []);

  const playLive = useCallback(
    (item: PlayItem) => {
      const live = item.live;
      if (!live?.air) return;
      ref.current?.pause();
      liveSlug.current = live.slug;
      liveName.current = live.name;
      liveHint.current = item;
      setQueue([item]);
      setIndex(0);
      setPlaying(true);
      // Start inside the tap; the rotation (for the songs after this one) loads meanwhile.
      ensureMixer().start(live.air);
      void channel(live.slug);
    },
    [ensureMixer, channel],
  );

  // --- albums: one audio element ---------------------------------------------

  const load = useCallback(
    (item: PlayItem) => {
      const el = ref.current;
      if (!el) return;
      stopLive();
      el.src = item.src;
      el.play().catch(() => setPlaying(false));
    },
    [stopLive],
  );

  const playList = useCallback(
    (items: PlayItem[], start = 0) => {
      if (!items.length) return;
      setQueue(items);
      setIndex(start);
      load(items[start]);
    },
    [load],
  );

  const toggle = useCallback(() => {
    const cur = currentRef.current;
    if (!cur) return;
    if (cur.live) {
      if (liveSlug.current && liveStatus.current !== "error") {
        stopLive();
        setPlaying(false);
        return;
      }
      // Rejoin where the channel is now, inside the tap.
      const slug = cur.live.slug;
      liveSlug.current = slug;
      liveName.current = cur.live.name;
      setPlaying(true);
      const rotation = ready.current.get(slug)?.rotation;
      const air = rotation && onAirAt(rotation, Date.now());
      if (air) ensureMixer().start(air);
      else void ensureMixer().startFromClock();
      return;
    }
    const el = ref.current;
    if (!el) return;
    if (!el.paused) return el.pause();
    el.play().catch(() => setPlaying(false));
  }, [stopLive, ensureMixer]);

  const step = useCallback(
    (by: number) => {
      if (!queue.length || currentRef.current?.live) return;
      const i = (index + by + queue.length) % queue.length;
      setIndex(i);
      load(queue[i]);
    },
    [queue, index, load],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => !liveSlug.current && setPlaying(false);
    const onEnded = () => step(1);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, [step]);

  // Lock-screen and headphone controls, for albums only. A live channel's
  // mixer pauses its element for a moment at every song change; with a media
  // session open, phones took that pause as the listener stopping and refused
  // the next song's play() (Robert, iPhone + Android, Oct 2026). The radio
  // site never opened one, and its channels play on — so channels don't here.
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    if (!current || current.live) {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.setActionHandler("nexttrack", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
      return;
    }
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title,
      artist: current.artist,
      album: "Squaredrum",
      artwork: current.cover ? [{ src: current.cover, sizes: "600x600", type: "image/jpeg" }] : [],
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => step(1));
    navigator.mediaSession.setActionHandler("previoustrack", () => step(-1));
  }, [current, step]);

  const audio = useCallback(() => ref.current, []);

  const skip = useCallback(
    (seconds: number) => {
      const el = ref.current;
      if (!el || current?.live || !Number.isFinite(el.duration)) return;
      el.currentTime = Math.min(Math.max(0, el.currentTime + seconds), Math.max(0, el.duration - 0.25));
    },
    [current],
  );

  const value = useMemo<Player>(
    () => ({ current, playing, queue, index, playList, playLive, toggle, next: () => step(1), prev: () => step(-1), skip, audio }),
    [current, playing, queue, index, playList, playLive, toggle, step, skip, audio],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <audio ref={ref} preload="none" />
    </Ctx.Provider>
  );
}
