"use client";

import { useEffect, useState } from "react";
import { type PlayItem, usePlayer } from "./player";

export type Slide = {
  name: string;
  line: string;
  portrait: string;
  drop: string;
  items: PlayItem[];
};

/**
 * The split hero: the page is cut on the diagonal of the logo's drumstick,
 * and the artist appears in colour on the white side and in black and white
 * on the dark side. Rotates through the artists in src/lib/site.ts (HERO).
 */
export function Hero({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [fading, setFading] = useState(false);
  const p = usePlayer();
  const s = slides[i];

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setTimeout(() => go(i + 1), 7000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, slides.length]);

  function go(n: number) {
    setFading(true);
    setTimeout(() => {
      setI((n + slides.length) % slides.length);
      setFading(false);
    }, 280);
  }

  if (!s) return null;
  const isThis = !!p.current && s.items.some((x) => x.id === p.current!.id);

  return (
    <header className="hero">
      <div className="hero-inner">
        <div className="hero-dark" />
        <div className="shot color">
          <img src={s.portrait} alt="" className={fading ? "fade" : undefined} fetchPriority="high" />
        </div>
        <div className="shot mono">
          <img src={s.portrait} alt="" className={fading ? "fade" : undefined} />
        </div>
        <svg className="stick stick-d" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line x1="58" y1="0" x2="46" y2="100" />
        </svg>
        <svg className="stick stick-m" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" y1="60" x2="100" y2="46" />
        </svg>

        <h1 className="display h-left">Music</h1>
        <p className="h-sub">
          AI-composed. <b>Human-crafted.</b> Seventeen imprints, one house — from Afrobeats to Rock, live around the clock.
        </p>
        <div className="display h-right" aria-hidden="true">
          Without
          <br />
          Borders
        </div>

        <div className="drop" aria-hidden="true">
          <span className="display new">New</span>
          <span className="display dr">Drop</span>
        </div>
        <button
          className="drop-pill mono"
          onClick={() => (isThis ? p.toggle() : p.playList(s.items))}
          aria-label={`Play ${s.drop}`}
        >
          <span className="play">{isThis && p.playing ? "❚❚" : "▶"}</span>
          <span>{s.drop}</span>
        </button>

        <div className="slide-meta">
          <span className="count">
            0{i + 1} / 0{slides.length}
          </span>
          <div className="who">
            <b>{s.name}</b>
            <span className="mono" style={{ color: "var(--mute)" }}>
              {s.line}
            </span>
            <div className="bars">
              {slides.map((_, n) => (
                <i key={`${n}-${i}`} className={n === i ? "on" : undefined} />
              ))}
            </div>
          </div>
          <div className="arrows">
            <button onClick={() => go(i - 1)} aria-label="Previous artist">
              ←
            </button>
            <button onClick={() => go(i + 1)} aria-label="Next artist">
              →
            </button>
          </div>
        </div>
        <div className="side-note mono">
          Scroll ↓
          <br />
          est. Squaredrum LLC
        </div>
      </div>
    </header>
  );
}
