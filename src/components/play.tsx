"use client";

import Link from "next/link";
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
    <ol className="tracklist">
      {rows.map((r, i) => (
        <li
          key={r.id}
          className={p.current?.id === r.id ? "on" : undefined}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) return;
            if (p.current?.id === r.id) p.toggle();
            else p.playList(rows, i);
          }}
        >
          <span className="n">
            <span>{p.current?.id === r.id && p.playing ? "♪" : i + 1}</span>
          </span>
          {showCover ? r.cover ? <img src={r.cover} alt="" loading="lazy" /> : <span className="pbar-blank" /> : <span />}
          <span className="t">
            <b>
              {r.title}
              {r.explicit && <ExplicitBadge />}
            </b>
            <span>{r.artistHref ? <Link href={r.artistHref}>{r.artist}</Link> : r.artist}</span>
          </span>
          {showAlbum ? <span className="al">{r.albumHref ? <Link href={r.albumHref}>{r.album}</Link> : r.album}</span> : <span />}
          <span className="d">{fmt(r.durationMs)}</span>
        </li>
      ))}
    </ol>
  );
}
