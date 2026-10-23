"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { seededShuffle } from "@/lib/seeded";
import { useVisitSeed } from "@/lib/visit";

/**
 * The radio's channel names as chips, in a new order on every visit. The gold
 * "live" mark scans from chip to chip like a radio dial while the chips are on
 * screen (it stays on the first one for "reduce motion").
 */
export function ChannelChips({ names }: { names: string[] }) {
  const visit = useVisitSeed();
  const shown = useMemo(() => (visit ? seededShuffle(names, `chips:${visit}`) : names), [names, visit]);
  const [on, setOn] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) timer = window.setInterval(() => setOn((n) => (n + 1) % shown.length), 2200);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      clearInterval(timer);
    };
  }, [shown.length]);

  return (
    <div className="chan" ref={ref}>
      {shown.map((n, i) => (
        <span key={n} className={i === on ? "live" : undefined}>
          {n}
        </span>
      ))}
    </div>
  );
}
