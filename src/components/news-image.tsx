"use client";

import { useState } from "react";

/**
 * An Off the Square card's picture: the article's own image, straight from the publication (no referrer
 * sent), shown in black and white. If the publication won't serve it, the card simply goes without.
 */
export function NewsImage({ src, href }: { src: string; href: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <a className="news-img" href={href} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
      <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
    </a>
  );
}
