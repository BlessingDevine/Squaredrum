"use client";

import { useSyncExternalStore } from "react";
import type { LyricLine as Line } from "@/lib/lyric-lines";

// One line per visit, picked once in the browser (the server sends the candidates).
// Forgotten once the page is left, so the next visit (client navigation too) picks again;
// the check waits a tick because React may unmount and remount at once (dev Strict Mode).
let pick: number | null = null;
let mounted = 0;
const subscribe = () => {
  mounted++;
  return () => {
    mounted--;
    setTimeout(() => {
      if (mounted === 0) pick = null;
    });
  };
};

/** A single sung line between the artist page's sections, a different one each visit. */
export function LyricLine({ lines }: { lines: Line[] }) {
  const i = useSyncExternalStore(
    subscribe,
    () => (pick ??= Math.floor(Math.random() * lines.length)),
    () => -1,
  );
  const l = lines[i];
  return (
    <section className="lyric-band sec wrap" aria-label="A line from their songs">
      {l ? (
        <figure className="is-in">
          <blockquote>{l.line}</blockquote>
          <figcaption className="mono">from “{l.title}”</figcaption>
        </figure>
      ) : (
        <figure aria-hidden="true" />
      )}
    </section>
  );
}
