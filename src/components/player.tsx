"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

/**
 * One audio element for the whole site, so music keeps playing while people
 * move between pages. Two ways to play:
 * - a list of songs (an album, an artist's tracks, a release);
 * - a live Musicsquare Radio channel, joined at the second everyone else is
 *   hearing, which carries on to the channel's next song by itself.
 *
 * play() is always called inside the tap itself: iOS Safari refuses it after
 * an await. The audio element never sets crossOrigin (a CloudFront edge
 * without CORS headers would then refuse every song).
 */

export type PlayItem = {
  id: string;
  title: string;
  artist: string;
  artistHref?: string | null;
  cover: string | null;
  src: string;
  live?: { slug: string; name: string; startedAt: number; endsAt: number };
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
  audio: () => HTMLAudioElement | null;
};

const Ctx = createContext<Player | null>(null);

export function usePlayer() {
  const p = useContext(Ctx);
  if (!p) throw new Error("usePlayer outside <PlayerProvider>");
  return p;
}

/** Current position and length, updated as the song plays. */
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

type OnAir = { slug: string; name: string; title: string; artist: string; cover: string | null; src: string; startedAt: number; endsAt: number };

/** A live channel's current song as something the player can play. */
export function liveItem(c: OnAir): PlayItem {
  return {
    id: `live:${c.slug}:${c.startedAt}`,
    title: c.title,
    artist: c.artist,
    cover: c.cover,
    src: c.src,
    live: { slug: c.slug, name: c.name, startedAt: c.startedAt, endsAt: c.endsAt },
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

  const load = useCallback((item: PlayItem) => {
    const el = ref.current;
    if (!el) return;
    el.src = item.src;
    if (item.live) {
      // Join the channel where everyone else is.
      const seek = () => {
        el.currentTime = Math.max(0, (Date.now() - item.live!.startedAt) / 1000);
      };
      el.addEventListener("loadedmetadata", seek, { once: true });
    }
    el.play().catch(() => setPlaying(false));
  }, []);

  const playList = useCallback(
    (items: PlayItem[], start = 0) => {
      if (!items.length) return;
      setQueue(items);
      setIndex(start);
      load(items[start]);
    },
    [load],
  );

  const playLive = useCallback((item: PlayItem) => playList([item]), [playList]);

  const toggle = useCallback(() => {
    const el = ref.current;
    const cur = currentRef.current;
    if (!el || !cur) return;
    if (!el.paused) return el.pause();
    // A paused live channel has moved on; rejoin at the right second.
    if (cur.live) return load(cur);
    el.play().catch(() => setPlaying(false));
  }, [load]);

  const step = useCallback(
    (by: number) => {
      if (!queue.length || currentRef.current?.live) return;
      const i = (index + by + queue.length) % queue.length;
      setIndex(i);
      load(queue[i]);
    },
    [queue, index, load],
  );

  // When a live song ends, ask what the channel is playing now and carry on.
  const continueLive = useCallback(async () => {
    const cur = currentRef.current;
    if (!cur?.live) return;
    try {
      const res = await fetch("/api/onair", { cache: "no-store" });
      const all: OnAir[] = await res.json();
      const c = all.find((x) => x.slug === cur.live!.slug);
      if (!c) return setPlaying(false);
      const item = liveItem(c);
      setQueue([item]);
      setIndex(0);
      load(item);
    } catch {
      setPlaying(false);
    }
  }, [load]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => (currentRef.current?.live ? continueLive() : step(1));
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, [step, continueLive]);

  // Lock-screen and headphone controls.
  useEffect(() => {
    if (!current || !("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title,
      artist: current.artist,
      album: current.live ? `Musicsquare Radio · ${current.live.name}` : "Squaredrum",
      artwork: current.cover ? [{ src: current.cover, sizes: "600x600", type: "image/jpeg" }] : [],
    });
    navigator.mediaSession.setActionHandler("nexttrack", current.live ? null : () => step(1));
    navigator.mediaSession.setActionHandler("previoustrack", current.live ? null : () => step(-1));
  }, [current, step]);

  const audio = useCallback(() => ref.current, []);

  const value = useMemo<Player>(
    () => ({ current, playing, queue, index, playList, playLive, toggle, next: () => step(1), prev: () => step(-1), audio }),
    [current, playing, queue, index, playList, playLive, toggle, step, audio],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <audio ref={ref} preload="none" />
    </Ctx.Provider>
  );
}
