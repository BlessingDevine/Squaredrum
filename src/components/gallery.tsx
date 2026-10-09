"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Pic = { id: string; src: string; full: string; srcSet: string; width: number; height: number };

/** A masonry photo wall; a photo opens full screen, with arrows, keys and swipes to move. */
export function Gallery({ photos, name }: { photos: Pic[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const touch = useRef<number | null>(null);
  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    if (open === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [open, go]);

  const p = open === null ? null : photos[open];
  return (
    <>
      <div className="gallery">
        {photos.map((ph, i) => (
          <button key={ph.id} className="gallery-item" onClick={() => setOpen(i)} aria-label={`Open photo ${i + 1} of ${photos.length}`}>
            <img src={ph.src} srcSet={ph.srcSet} sizes="(max-width:760px) 50vw, 25vw" width={ph.width} height={ph.height} alt={`${name}, photo ${i + 1}`} loading="lazy" />
          </button>
        ))}
      </div>
      {p && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${name}, photo ${open! + 1} of ${photos.length}`}
          onClick={() => setOpen(null)}
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - (touch.current ?? 0);
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touch.current = null;
          }}
        >
          <img key={p.id} src={p.full} alt={`${name}, photo ${open! + 1}`} onClick={(e) => e.stopPropagation()} />
          <button className="lb-btn lb-prev" onClick={(e) => (e.stopPropagation(), go(-1))} aria-label="Previous photo">
            ←
          </button>
          <button className="lb-btn lb-next" onClick={(e) => (e.stopPropagation(), go(1))} aria-label="Next photo">
            →
          </button>
          <button className="lb-btn lb-close" onClick={() => setOpen(null)} aria-label="Close">
            ✕
          </button>
          <span className="lb-count mono">
            {open! + 1} / {photos.length}
          </span>
        </div>
      )}
    </>
  );
}
