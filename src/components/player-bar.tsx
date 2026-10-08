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
      <div className={`pbar-track${cur.live ? " is-live" : ""}`} onClick={seek}>
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
          <button className="pbar-play" onClick={p.toggle} aria-label={p.playing ? "Pause" : "Play"}>
            {p.playing ? "❚❚" : "▶"}
          </button>
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
