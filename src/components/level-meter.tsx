"use client";

import { useEffect, useRef } from "react";

// Enough bars to cross the widest panel; the ones that don't fit are clipped. Each gets a fixed
// pseudo-random resting height and pace, so the meter looks the same on every visit.
const BARS = Array.from({ length: 110 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return { h: 0.35 + r(1) * 0.65, s: 0.8 + r(2) * 0.9 };
});

/**
 * A gold level meter across the bottom of the "Always on air" panel, made of
 * the Musicsquare Radio logo's rounded bars, so the station looks like it's
 * playing. It rises to just below the channel chips (measured, so it never sits
 * behind text) and only moves while on screen; "reduce motion" stands it still.
 */
export function LevelMeter() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const panel = el?.parentElement;
    const chips = panel?.querySelector(".chan");
    if (!el || !panel) return;
    const fit = () => {
      if (!chips) return;
      const gap = panel.getBoundingClientRect().bottom - chips.getBoundingClientRect().bottom - 18;
      el.style.height = `${Math.max(80, gap)}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(panel);
    if (chips) ro.observe(chips);
    const io = new IntersectionObserver(([e]) => el.classList.toggle("on", e.isIntersecting));
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);
  return (
    <div className="level-meter" ref={ref} aria-hidden="true">
      {BARS.map(({ h, s }, i) => (
        <i key={i} style={{ "--h": h.toFixed(2), "--s": `${s.toFixed(2)}s`, "--d": `${(-i * 0.37).toFixed(2)}s` } as React.CSSProperties} />
      ))}
    </div>
  );
}
