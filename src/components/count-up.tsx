"use client";

import { useEffect, useRef } from "react";

/**
 * A stat number ("3,200+", "18") that counts up from zero the first time it
 * scrolls into view. The page is rendered with the real number, so search
 * engines, no-JS visitors and "reduce motion" see it as is; it only resets to
 * zero while still off screen, so nobody sees it jump.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    const m = value.match(/^([\d,]+)(.*)$/);
    if (!el || !m) return;
    const target = Number(m[1].replace(/,/g, ""));
    const suffix = m[2];
    if (!target || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) return; // already on screen: leave it
    const show = (n: number) => (el.textContent = `${n.toLocaleString("en-US")}${suffix}`);
    show(0);
    let frame = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1400);
          show(Math.round(target * (1 - Math.pow(1 - t, 3))));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = value;
    };
  }, [value]);

  return (
    <b ref={ref} aria-label={value}>
      {value}
    </b>
  );
}
