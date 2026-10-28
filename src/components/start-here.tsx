"use client";

import Link from "next/link";
import { type Row } from "./play";
import { usePlayer } from "./player";

/** Three hand-picked songs (src/lib/start-here.ts) as cards: cover, title, why. Tapping one plays from there. */
export function StartHere({ picks }: { picks: (Row & { why: string })[] }) {
  const p = usePlayer();
  return (
    <ol className="start-here">
      {picks.map((s, i) => {
        const on = p.current?.id === s.id;
        return (
          <li key={s.id}>
            <button
              type="button"
              className={`start-card ${on ? "is-on" : ""}`}
              onClick={() => (on ? p.toggle() : p.playList(picks, i))}
              aria-label={`${on && p.playing ? "Pause" : "Play"} ${s.title}`}
            >
              <span className="start-cover">
                {s.cover && <img src={s.cover.replace(/-300\.jpg$/, "-600.jpg")} alt="" loading="lazy" />}
                <span className="start-play" aria-hidden="true">
                  {on && p.playing ? "❚❚" : "▶"}
                </span>
              </span>
              <span className="mono start-n">0{i + 1}</span>
              <strong className="start-title">{s.title}</strong>
              <span className="start-why">{s.why}</span>
            </button>
            {s.albumHref && (
              <Link className="mono start-album" href={s.albumHref}>
                {s.album} →
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
