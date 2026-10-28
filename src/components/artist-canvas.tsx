"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "./player";

/**
 * The latest album's Canvas loop in the artist page's opener, shown only while
 * one of the artist's songs is playing (Play all, a Start here card, the
 * radio): it fades in over the photo on phones and as a tall panel top right
 * on computers, then fades back when the music stops. Not shown with Reduce
 * motion (CSS). The video only loads once something of theirs plays.
 */
export function ArtistCanvas({ slug, src }: { slug: string; src: string }) {
  const p = usePlayer();
  const on = p.playing && p.current?.artistHref === `/artists/${slug}`;
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (on) {
      if (!v.getAttribute("src")) v.src = src;
      v.play().catch(() => {});
    } else {
      // Let the fade out finish before stopping the loop.
      const t = window.setTimeout(() => v.pause(), 900);
      return () => clearTimeout(t);
    }
  }, [on, src]);

  return (
    <video
      ref={ref}
      className={`artist-canvas${on ? " is-on" : ""}`}
      poster={src.replace(/\.mp4$/, ".jpg")}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    />
  );
}
