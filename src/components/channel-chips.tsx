"use client";

import { useMemo } from "react";
import { seededShuffle } from "@/lib/seeded";
import { useVisitSeed } from "@/lib/visit";

/** The radio's channel names as chips, in a new order on every visit (first one marked live). */
export function ChannelChips({ names }: { names: string[] }) {
  const visit = useVisitSeed();
  const shown = useMemo(() => (visit ? seededShuffle(names, `chips:${visit}`) : names), [names, visit]);
  return (
    <div className="chan">
      {shown.map((n, i) => (
        <span key={n} className={i === 0 ? "live" : undefined}>
          {i === 0 ? "● " : ""}
          {n}
        </span>
      ))}
    </div>
  );
}
