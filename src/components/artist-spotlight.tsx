"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { canvasFocus } from "@/lib/canvas-focus";
import type { Row } from "./play";
import { usePlayer } from "./player";

export type Spotlight = {
  slug: string;
  name: string;
  line: string;
  image: string;
  /** Newest album's Canvas loop: plays in the square instead of the still photo. */
  canvas: string | null;
  /** Approved lyric lines (lyric-lines.ts); one shows over the loop. */
  lines: { line: string; title: string }[];
  /** First Start here song, for the play button. */
  start: Row | null;
};

// Each opening of /artists shows the next artist in the roster. The place is kept in the
// browser, so a visitor walks through everyone; a first visit starts somewhere random.
const KEY = "sd-spotlight";
let picked: number | null = null;

function pick(count: number) {
  if (picked === null) {
    let n: number;
    try {
      const last = localStorage.getItem(KEY);
      n = last === null || !Number.isFinite(Number(last)) ? Math.floor(Math.random() * count) : Number(last) + 1;
      localStorage.setItem(KEY, String(n % count));
    } catch {
      n = Math.floor(Math.random() * count);
    }
    picked = n % count;
  }
  return picked;
}

// Nothing to listen to; the choice is made once per visit to the page. Forgetting it once the
// page is left means coming back to /artists (also by client navigation) moves on to the next
// one. The check waits a tick because React may unmount and remount at once (dev Strict Mode).
let mounted = 0;
const subscribe = () => {
  mounted++;
  return () => {
    mounted--;
    setTimeout(() => {
      if (mounted === 0) picked = null;
    });
  };
};

/** The big square in the middle of the artists grid. Rendered empty on the server, then filled in. */
export function ArtistSpotlight({ artists }: { artists: Spotlight[] }) {
  const i = useSyncExternalStore(
    subscribe,
    () => pick(artists.length),
    () => -1,
  );
  const p = usePlayer();
  // Which lyric line shows; only read once the square is filled in (client side).
  const [seed] = useState(() => Math.random());
  const a = artists[i];
  if (!a) return <div className="artist-feature" aria-hidden="true" />;
  const lyric = a.lines.length ? a.lines[Math.floor(seed * a.lines.length)] : null;
  const on = !!a.start && p.current?.id === a.start.id;
  return (
    <div className="artist-feature is-in" data-slug={a.slug}>
      <Link className="feature-link" href={`/artists/${a.slug}`}>
        <img src={a.image} alt={a.name} />
        {a.canvas && (
          <video
            className="feature-canvas"
            style={{ objectPosition: canvasFocus(a.canvas) }}
            src={a.canvas}
            poster={a.image}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        )}
        <span className="eyebrow mono">
          Spotlight <span className="card-badge is-air">On air</span>
        </span>
        <b>{a.name}</b>
        <span className="mono">{a.line}</span>
      </Link>
      {lyric && (
        <p className="feature-lyric">
          <span>“{lyric.line}”</span>
          <cite className="mono">{lyric.title}</cite>
        </p>
      )}
      {a.start && (
        <button
          type="button"
          className={`feature-play${on && p.playing ? " is-on" : ""}`}
          onClick={() => (on ? p.toggle() : p.playList([a.start!], 0))}
          aria-label={`${on && p.playing ? "Pause" : "Play"} ${a.start.title} by ${a.name}`}
        >
          <span aria-hidden="true">{on && p.playing ? "❚❚" : "▶"}</span>
          <span className="mono">{a.start.title}</span>
        </button>
      )}
    </div>
  );
}
