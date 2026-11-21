"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SongActions } from "./account";
import { type PlayItem, usePlayer } from "./player";

/** A button that plays a list of songs (an album, an artist), optionally from a given one. */
export function PlayButton({ items, start = 0, label = "Play", className = "btn btn-gold" }: { items: PlayItem[]; start?: number; label?: string; className?: string }) {
  const p = usePlayer();
  const isThis = p.current && items.some((i) => i.id === p.current!.id);
  return (
    <button className={className} onClick={() => (isThis ? p.toggle() : p.playList(items, start))} disabled={!items.length}>
      {isThis && p.playing ? "❚❚ Pause" : `▶ ${label}`}
    </button>
  );
}

export type Row = PlayItem & { album?: string; albumHref?: string; durationMs: number; explicit?: boolean };

/** The standard "explicit lyrics" mark, as streaming services show it. */
export function ExplicitBadge() {
  return (
    <abbr className="e-badge" title="Explicit">
      E
    </abbr>
  );
}

const fmt = (ms: number) => {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/** A numbered song list; clicking a row plays the list from there. */
export function TrackList({ rows, showCover = true, showAlbum = true }: { rows: Row[]; showCover?: boolean; showAlbum?: boolean }) {
  const p = usePlayer();
  return (
    <ol className={showCover ? "tracklist" : "tracklist no-cover"}>
      {rows.map((r, i) => (
        <li
          key={r.id}
          className={p.current?.id === r.id ? "on" : undefined}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a, button")) return;
            if (p.current?.id === r.id) p.toggle();
            else p.playList(rows, i);
          }}
        >
          <span className="n">
            <span>{p.current?.id === r.id && p.playing ? "♪" : i + 1}</span>
          </span>
          {showCover ? r.cover ? <img src={r.cover} alt="" loading="lazy" /> : <span className="pbar-blank" /> : <span className="cv" />}
          <span className="t">
            <b>
              {r.title}
              {r.explicit && <ExplicitBadge />}
            </b>
            <span>{r.artistHref ? <Link href={r.artistHref}>{r.artist}</Link> : r.artist}</span>
          </span>
          {showAlbum ? <span className="al">{r.albumHref ? <Link href={r.albumHref}>{r.album}</Link> : r.album}</span> : <span className="al" />}
          <SongActions song={{ id: r.id, title: r.title, artist: r.artist, src: r.src }} />
          <span className="d">{fmt(r.durationMs)}</span>
        </li>
      ))}
    </ol>
  );
}

/**
 * The album hero's song list (desktop only): the first `max` songs, each one playing the whole album from there,
 * and a link down to the full list when there are more (Robert, Nov 2026: fill the empty side of the hero).
 */
export function HeroTracks({ rows, max = 8, allHref = "#tracks" }: { rows: Row[]; max?: number; allHref?: string }) {
  const p = usePlayer();
  return (
    <div className="hero-tracks">
      <ol>
        {rows.slice(0, max).map((r, i) => {
          const on = p.current?.id === r.id;
          return (
            <li key={r.id} className={on ? "on" : undefined}>
              <button type="button" onClick={() => (on ? p.toggle() : p.playList(rows, i))} aria-label={`Play ${r.title}`}>
                <span className="n mono">{on && p.playing ? "♪" : i + 1}</span>
                <span className="t">
                  {r.title}
                  {r.explicit && <ExplicitBadge />}
                </span>
                <span className="d mono">{fmt(r.durationMs)}</span>
              </button>
            </li>
          );
        })}
      </ol>
      {rows.length > max && (
        <a className="all mono" href={allHref}>
          All {rows.length} songs ↓
        </a>
      )}
    </div>
  );
}

/** The album hero's blurred background Canvas: mounted on desktop only, so phones never download a second video. */
export function AmbientVideo({ src }: { src: string }) {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 761px) and (prefers-reduced-motion: no-preference)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  if (!wide) return null;
  return <video className="amb-video" src={src} autoPlay muted loop playsInline aria-hidden="true" tabIndex={-1} />;
}
