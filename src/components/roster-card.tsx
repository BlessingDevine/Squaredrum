"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { canvasFocus } from "@/lib/canvas-focus";
import type { RosterCard as Card } from "./roster-row";

type Extras = { canvas: string | null; words: { q: string; a: string } | null; isNew: boolean; moods: string[] };

const still = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A card on /artists. On top of the photo: the newest album's Canvas loop on
 * hover (computers) or a long press (phones), loaded only then; a "New Friday"
 * badge; an "On air" badge lit by RosterOnAir; and a corner button that turns
 * the card over to one of the artist's "In their own words" answers.
 */
export function RosterCard({ a, x }: { a: Card; x: Extras }) {
  const video = useRef<HTMLVideoElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const pressed = useRef(false);
  const [live, setLive] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const start = (delay: number) => {
    if (!x.canvas || still()) return;
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const v = video.current;
      if (!v) return;
      if (!v.getAttribute("src")) v.src = x.canvas!;
      v.play().then(() => setLive(true), () => {});
      pressed.current = delay > 300; // a long press shouldn't also open the page
    }, delay);
  };
  const stop = () => {
    clearTimeout(timer.current);
    setLive(false);
    window.setTimeout(() => video.current?.pause(), 400);
  };

  return (
    <div className={`artist-cell${flipped ? " is-flipped" : ""}`} data-slug={a.slug} data-moods={x.moods.join("|")}>
      <Link
        className={`artist${live ? " is-live" : ""}`}
        href={`/artists/${a.slug}`}
        data-slug={a.slug}
        onPointerEnter={(e) => e.pointerType === "mouse" && start(200)}
        onPointerLeave={(e) => e.pointerType === "mouse" && stop()}
        onTouchStart={() => start(450)}
        onTouchEnd={() => stop()}
        onTouchMove={() => clearTimeout(timer.current)}
        onContextMenu={(e) => x.canvas && e.preventDefault()}
        onClick={(e) => {
          if (pressed.current) {
            e.preventDefault();
            pressed.current = false;
          }
        }}
      >
        <div className={`ph${a.isPortrait ? "" : " cover"}`}>
          <img src={a.image} alt={a.name} loading="lazy" />
          {x.canvas && (
            <video ref={video} className="card-canvas" style={canvasFocus(x.canvas)} muted loop playsInline preload="none" aria-hidden="true" />
          )}
        </div>
        <b>{a.name}</b>
        <span className="mono">{a.line}</span>
      </Link>
      <span className="card-badges" aria-hidden="true">
        {x.isNew && <span className="card-badge is-new">New Friday</span>}
        <span className="card-badge is-air">On air</span>
      </span>
      {x.words && (
        <>
          <button
            type="button"
            className="card-flip"
            aria-pressed={flipped}
            aria-label={flipped ? `Back to ${a.name}'s photo` : `${a.name} in their own words`}
            onClick={() => setFlipped((f) => !f)}
          >
            {flipped ? "×" : "“"}
          </button>
          <div className="card-back" hidden={!flipped}>
            <span className="mono">{x.words.q}</span>
            <p>{x.words.a}</p>
            <Link className="mono" href={`/artists/${a.slug}`}>
              Meet {a.name} →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
