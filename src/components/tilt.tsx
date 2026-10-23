"use client";

import { type ReactNode, useRef } from "react";

/**
 * A cover that tilts towards the mouse with a soft light sheen, like holding a
 * vinyl sleeve to the light. Mouse only: touch screens and "reduce motion"
 * get the plain cover (see .tilt in globals.css).
 */
export function TiltCover({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);

  function move(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const x = (clientX - r.left) / r.width;
      const y = (clientY - r.top) / r.height;
      el.style.setProperty("--tilt-y", `${(x - 0.5) * 14}deg`);
      el.style.setProperty("--tilt-x", `${(0.5 - y) * 14}deg`);
      el.style.setProperty("--glare-x", `${x * 100}%`);
      el.style.setProperty("--glare-y", `${y * 100}%`);
    });
  }

  function leave() {
    cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty("--tilt-x");
    el.style.removeProperty("--tilt-y");
  }

  return (
    <span className="tilt" ref={ref} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </span>
  );
}
