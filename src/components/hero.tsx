"use client";

import { useEffect, useRef, useState } from "react";
import { type PlayItem, usePlayer } from "./player";

export type Slide = {
  name: string;
  line: string;
  portrait: string;
  drop: string;
  /** The drop's album cover (600px), shown front of the 3D cover stack. */
  cover: string | null;
  items: PlayItem[];
};

/**
 * The drop's cover with the next artists' covers stacked behind it, tilted in
 * 3D like the stacked cards of the GoSquare logo. When the slide changes the
 * front cover lifts away and the stack moves up one; the whole stack leans
 * towards the mouse. CSS 3D only (no WebGL), so it costs the live player
 * nothing. Decorative: the "New Drop" pill is the control.
 */
function CoverStack({ slides, i }: { slides: Slide[]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const hero = el?.closest(".hero");
    if (!el || !hero) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const move = (e: Event) => {
      const { clientX, clientY } = e as PointerEvent;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        el.style.setProperty("--lean-y", `${((clientX - r.left) / r.width - 0.5) * 16}deg`);
        el.style.setProperty("--lean-x", `${((clientY - r.top) / r.height - 0.5) * -10}deg`);
      });
    };
    const leave = () => {
      el.style.setProperty("--lean-y", "0deg");
      el.style.setProperty("--lean-x", "0deg");
    };
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
    };
  }, []);

  // Positions -1 (just left, lifting away) to 3 (hidden at the back, ready to
  // slide in). Keyed by slide so each cover keeps its element and glides.
  const n = slides.length;
  const offsets = n >= 5 ? [-1, 0, 1, 2, 3] : [...Array(n).keys()];
  return (
    <div className="cover-stack" ref={ref} aria-hidden="true">
      {offsets.map((k) => {
        const idx = (((i + k) % n) + n) % n;
        const cover = slides[idx].cover;
        return (
          <div key={idx} className="cs-card" data-pos={k}>
            {cover ? <img src={cover} alt="" loading={k <= 1 ? "eager" : "lazy"} /> : <span>{slides[idx].name.slice(0, 1)}</span>}
          </div>
        );
      })}
    </div>
  );
}

/**
 * The split hero: the page is cut on the diagonal of the logo's drumstick,
 * and the artist appears in colour on the white side and in black and white
 * on the dark side. Rotates through every artist with a portrait (see
 * HERO_ALBUMS in src/lib/site.ts).
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

  // Fetch the next portrait ahead of time so the change never shows a blank.
  useEffect(() => {
    const next = slides[(i + 1) % slides.length];
    if (next) new Image().src = next.portrait;
  }, [i, slides]);

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

        {/* The heading reads "Music Without Borders"; the second half is drawn by .h-right. */}
        <h1 className="display h-left">
          Music<span className="sr-only"> Without Borders</span>
        </h1>
        <p className="h-sub">
          AI-composed. <b>Human-crafted.</b> Eighteen imprints, one house — from Afrobeats to Rock, live around the clock.
        </p>
        <div className="display h-right" aria-hidden="true">
          Without
          <br />
          Borders
        </div>

        <CoverStack slides={slides} i={i} />

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
            {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
          <div className="who">
            <b>{s.name}</b>
            <span className="mono" style={{ color: "var(--mute)" }}>
              {s.line}
            </span>
            {/* One bar per artist when there are a few; a single timer bar when there are many. */}
            <div className="bars">
              {slides.length <= 8 ? (
                slides.map((_, n) => <i key={`${n}-${i}`} className={n === i ? "on" : undefined} />)
              ) : (
                <i key={i} className="on wide-bar" />
              )}
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
