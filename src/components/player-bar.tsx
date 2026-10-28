"use client";

import Link from "next/link";
import { usePlayer, useProgress } from "./player";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** The bar at the bottom of every page once something is playing. */
export function PlayerBar() {
  const p = usePlayer();
  const { time, duration } = useProgress();
  const cur = p.current;
  if (!cur) return null;
  const pct = duration ? (time / duration) * 100 : 0;
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = p.audio();
    if (!el || !duration || cur.live) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.currentTime = ((e.clientX - r.left) / r.width) * duration;
  };
  return (
    <div className="pbar" role="region" aria-label="Player">
      <div
        className={`pbar-track${cur.live ? " is-live" : ""}`}
        onClick={seek}
        // A slider for keyboards and screen readers: arrow keys skip 5 seconds. Live radio can't be seeked.
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration || 0)}
        aria-valuenow={Math.round(time)}
        aria-valuetext={`${fmt(time)} of ${fmt(duration || 0)}`}
        aria-disabled={!!cur.live}
        tabIndex={cur.live ? -1 : 0}
        onKeyDown={(e) => {
          const el = p.audio();
          if (!el || !duration || cur.live) return;
          const step = e.key === "ArrowRight" || e.key === "ArrowUp" ? 5 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -5 : 0;
          if (!step) return;
          e.preventDefault();
          el.currentTime = Math.min(duration, Math.max(0, el.currentTime + step));
        }}
      >
        <i style={{ width: `${pct}%` }} />
      </div>
      <div className="pbar-in wrap">
        <div className="pbar-now">
          {cur.cover ? <img src={cur.cover} alt="" /> : <span className="pbar-blank" />}
          <div>
            <b>{cur.title}</b>
            <span>
              {cur.artistHref ? <Link href={cur.artistHref}>{cur.artist}</Link> : cur.artist}
              {cur.live && <em className="mono"> · <span className="live-dot" />Live on {cur.live.name}</em>}
            </span>
          </div>
        </div>
        <div className="pbar-ctl">
          {!cur.live && (
            <button onClick={p.prev} aria-label="Previous">
              ⏮
            </button>
          )}
          {!cur.live && (
            <button className="pbar-skip" onClick={() => p.skip(-10)} aria-label="Back 10 seconds" title="Back 10 seconds">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2L7 6l5 4V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z" /><text x="12" y="16.2" textAnchor="middle">10</text></svg>
            </button>
          )}
          <button className="pbar-play" onClick={p.toggle} aria-label={p.playing ? "Pause" : "Play"}>
            {p.playing ? "❚❚" : "▶"}
          </button>
          {!cur.live && (
            <button className="pbar-skip" onClick={() => p.skip(10)} aria-label="Forward 10 seconds" title="Forward 10 seconds">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2l5 4-5 4V7a6 6 0 1 0 6 6h2a8 8 0 1 1-8-8z" /><text x="12" y="16.2" textAnchor="middle">10</text></svg>
            </button>
          )}
          {!cur.live && (
            <button onClick={p.next} aria-label="Next">
              ⏭
            </button>
          )}
        </div>
        <div className="pbar-time mono">{cur.live ? "On air" : `${fmt(time)} / ${fmt(duration)}`}</div>
      </div>
    </div>
  );
}
