"use client";

import { useEffect, useRef } from "react";

// Rounded gold bars like the Musicsquare Radio logo: [resting height %, seconds per swing].
const BARS: [number, number][] = [
  [46, 1.3], [72, 0.9], [38, 1.6], [88, 1.1], [58, 1.4], [94, 0.8], [52, 1.7], [76, 1.2], [42, 1.0], [66, 1.5],
];

/**
 * A faint level meter behind the "Always on air" panel, so the station looks
 * like it's playing. Only moves while it's on screen; "reduce motion" gets the
 * bars standing still.
 */
export function LevelMeter() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("on", e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="level-meter" ref={ref} aria-hidden="true">
      {BARS.map(([h, s], i) => (
        <i key={i} style={{ "--h": h / 100, "--s": `${s}s`, "--d": `${-i * 0.37}s` } as React.CSSProperties} />
      ))}
    </div>
  );
}
