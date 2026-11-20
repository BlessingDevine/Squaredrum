"use client";

import Link from "next/link";
import { useRef } from "react";

import { type StackAlbum, StackPicker } from "./stack-picker";

export type RosterCard = { slug: string; name: string; line: string; image: string; isPortrait: boolean };

export function RosterRow({ artists }: { artists: RosterCard[] }) {
  const row = useRef<HTMLDivElement>(null);
  const by = (px: number) => row.current?.scrollBy({ left: px, behavior: "smooth" });
  return (
    <>
      <div className="roster-ctrl roster-ctrl-float">
        <button onClick={() => by(-600)} aria-label="Scroll left">
          ←
        </button>
        <button onClick={() => by(600)} aria-label="Scroll right">
          →
        </button>
      </div>
      <div className="roster-row" ref={row}>
        {artists.map((a) => (
          <ArtistCard key={a.slug} a={a} />
        ))}
      </div>
    </>
  );
}

export function ArtistCard({ a }: { a: RosterCard }) {
  return (
    <Link className="artist" href={`/artists/${a.slug}`}>
      <div className={`ph${a.isPortrait ? "" : " cover"}`}>
        <img src={a.image} alt={a.name} loading="lazy" />
      </div>
      <b>{a.name}</b>
      <span className="mono">{a.line}</span>
    </Link>
  );
}

/**
 * A house collection on /artists. One with several albums shows its other covers stacked behind
 * the first (up to two), like the series stacks on /releases.
 */
export function CollectionCard({ a, behind, albums }: { a: RosterCard; behind: string[]; albums: StackAlbum[] }) {
  const count = albums.length;
  const inner = (
    <>
      <div className="stack-wrap">
        {[...behind].reverse().map((src) => (
          <img key={src} className="behind" src={src} alt="" loading="lazy" />
        ))}
        <div className={`ph${a.isPortrait ? "" : " cover"}`}>
          <img src={a.image} alt={a.name} loading="lazy" />
        </div>
      </div>
      <b>{a.name}</b>
      <span className="mono">{count > 1 ? `${count} albums · ${a.line}` : a.line}</span>
    </>
  );
  // A stack opens a picker of its albums; a single album goes to the collection's page.
  return count > 1 ? (
    <StackPicker className="artist stacked" href={`/artists/${a.slug}`} title={a.name} albums={albums} more={{ href: `/artists/${a.slug}`, label: "Collection page" }}>
      {inner}
    </StackPicker>
  ) : (
    <Link className="artist" href={`/artists/${a.slug}`}>
      {inner}
    </Link>
  );
}
