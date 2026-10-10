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
  live?: { slug: string; name: string; startedAt: number; endsAt: number; fadeMs?: number };
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

type OnAir = { slug: string; name: string; title: string; artist: string; cover: string | null; src: string; startedAt: number; endsAt: number; fadeMs?: number };

/** A live channel's current song as something the player can play. */
export function liveItem(c: OnAir): PlayItem {
  return {
    id: `live:${c.slug}:${c.startedAt}`,
    title: c.title,
    artist: c.artist,
    cover: c.cover,
    src: c.src,
    live: { slug: c.slug, name: c.name, startedAt: c.startedAt, endsAt: c.endsAt, fadeMs: c.fadeMs ?? 0 },
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

  // Live channels change songs on the channel clock, not when the file ends:
  // the file runs on past the change (its fade-out and trailing silence), and
  // waiting for "ended" then asking what's on left a gap — often a stall on
  // phones. The next song is looked up and downloaded ahead of the change.
  const liveTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const nextLive = useRef<PlayItem | null>(null);
  const clearLive = useCallback(() => {
    liveTimers.current.forEach(clearTimeout);
    liveTimers.current = [];
    if (fadeRef.current) clearInterval(fadeRef.current);
    fadeRef.current = null;
  }, []);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scheduleLive = useCallback(
    (item: PlayItem) => {
      clearLive();
      nextLive.current = null;
      const live = item.live!;
      // There's one element, so no overlap: let the song finish (its cue out,
      // fadeMs after the channel's change) and join the next one that far in —
      // the shared seconds come off the next song's intro, not this song's
      // last line.
      const songEnd = live.endsAt + (live.fadeMs ?? 0);
      const until = songEnd - Date.now();
      // Look up and warm the next song 12s ahead.
      liveTimers.current.push(
        setTimeout(async () => {
          try {
            const all: OnAir[] = await fetch(`/api/onair?at=${songEnd + 250}`, { cache: "no-store" }).then((r) => r.json());
            const c = all.find((x) => x.slug === live.slug);
            if (!c || currentRef.current?.id !== item.id) return;
            nextLive.current = liveItem(c);
            fetch(c.src, { mode: "no-cors" }).then((r) => r.arrayBuffer()).catch(() => {});
          } catch {}
        }, Math.max(0, until - 12_000)),
      );
      // Fade out over the last 1.5s (desktop; iPhone ignores volume), then change.
      const FADE = 1500;
      liveTimers.current.push(
        setTimeout(() => {
          const el = ref.current;
          if (!el || currentRef.current?.id !== item.id) return;
          const t0 = Date.now();
          fadeRef.current = setInterval(() => {
            el.volume = Math.max(0, 1 - (Date.now() - t0) / FADE);
          }, 50);
        }, Math.max(0, until - FADE)),
      );
      liveTimers.current.push(
        setTimeout(() => {
          // Handled with the other element events below, where load() lives.
          if (currentRef.current?.id === item.id) ref.current?.dispatchEvent(new Event("livechange"));
        }, Math.max(0, until)),
      );
    },
    [clearLive],
  );

  const load = useCallback((item: PlayItem) => {
    const el = ref.current;
    if (!el) return;
    clearLive();
    el.volume = 1;
    if (item.live) {
      // Join the channel where everyone else is: start the file there (#t=)
      // rather than at 0:00 and jumping, then correct for loading time.
      const at = Math.max(0, (Date.now() - item.live.startedAt) / 1000);
      el.src = at > 1 ? `${item.src}#t=${at.toFixed(2)}` : item.src;
      const seek = () => {
        const target = Math.max(0, (Date.now() - item.live!.startedAt) / 1000);
        if (Math.abs(el.currentTime - target) > 1.5) el.currentTime = target;
      };
      el.addEventListener("loadedmetadata", seek, { once: true });
      scheduleLive(item);
    } else el.src = item.src;
    el.play().catch(() => setPlaying(false));
  }, [clearLive, scheduleLive]);


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
    if (!el.paused) {
      clearLive();
      return el.pause();
    }
    // A paused live channel has moved on; rejoin at the right second.
    if (cur.live) return load(cur);
    el.play().catch(() => setPlaying(false));
  }, [load, clearLive]);

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
    const onLiveChange = () => {
      const next = nextLive.current;
      if (!next) return continueLive();
      setQueue([next]);
      setIndex(0);
      load(next);
    };
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    el.addEventListener("livechange", onLiveChange);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("livechange", onLiveChange);
    };
  }, [step, continueLive, load]);

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
