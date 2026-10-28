"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

export type Spotlight = { slug: string; name: string; line: string; image: string };

// Each opening of /artists shows the next artist in the roster. The place is kept in the
// browser, so a visitor walks through everyone; a first visit starts somewhere random.
const KEY = "sd-spotlight";
let picked: number | null = null;

function pick(count: number) {
  if (picked === null) {
    let n: number;
    try {
      const last = localStorage.getItem(KEY);
      n = last === null || !Number.isFinite(Number(last)) ? Math.floor(Math.random() * count) : Number(last) + 1;
      localStorage.setItem(KEY, String(n % count));
    } catch {
      n = Math.floor(Math.random() * count);
    }
    picked = n % count;
  }
  return picked;
}

// Nothing to listen to; the choice is made once per visit to the page. Forgetting it once the
// page is left means coming back to /artists (also by client navigation) moves on to the next
// one. The check waits a tick because React may unmount and remount at once (dev Strict Mode).
let mounted = 0;
const subscribe = () => {
  mounted++;
  return () => {
    mounted--;
    setTimeout(() => {
      if (mounted === 0) picked = null;
    });
  };
};

/** The big square in the middle of the artists grid. Rendered empty on the server, then filled in. */
export function ArtistSpotlight({ artists }: { artists: Spotlight[] }) {
  const i = useSyncExternalStore(
    subscribe,
    () => pick(artists.length),
    () => -1,
  );
  const a = artists[i];
  if (!a) return <div className="artist-feature" aria-hidden="true" />;
  return (
    <Link className="artist-feature is-in" href={`/artists/${a.slug}`}>
      <img src={a.image} alt={a.name} />
      <span className="eyebrow mono">Spotlight</span>
      <b>{a.name}</b>
      <span className="mono">{a.line}</span>
    </Link>
  );
}
