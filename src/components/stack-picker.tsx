"use client";

import Link from "next/link";
import { type MouseEvent, type ReactNode, useRef, useState } from "react";
import { type PlayItem, usePlayer } from "./player";

export type StackAlbum = { slug: string; title: string; cover: string; songs: number };

/**
 * A stack of albums (an artist's, or a collection's) that opens a picker instead of going straight to
 * one album: tapping it lists every album in the stack, newest or lead first, to choose from. The
 * link still works without JavaScript (and with a modifier key, to open in a new tab).
 */
export function StackPicker({
  className,
  href,
  title,
  albums,
  more,
  children,
}: {
  className: string;
  href: string;
  title: string;
  albums: StackAlbum[];
  /** A link under the list, e.g. the collection's own page. */
  more?: { href: string; label: string };
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const p = usePlayer();
  const [loading, setLoading] = useState<string | null>(null);
  // ▶ plays the album right here (its songs come from /api/album); the row itself opens the album page.
  const play = async (slug: string) => {
    const href = `/releases/${slug}`;
    if (p.current?.albumHref === href) return p.toggle();
    setLoading(slug);
    try {
      const r = await fetch(`/api/album/${slug}`);
      const { items } = (await r.json()) as { items: PlayItem[] };
      if (items?.length) p.playList(items, 0);
    } finally {
      setLoading(null);
    }
  };
  const open = (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    dialog.current?.showModal();
  };
  return (
    <>
      <a className={className} href={href} onClick={open} aria-haspopup="dialog">
        {children}
      </a>
      <dialog
        ref={dialog}
        className="stack-pick"
        aria-label={`${title}: choose an album`}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}>
        <div className="stack-pick-in">
          <header>
            <div>
              <div className="eyebrow mono">{albums.length} albums</div>
              <h3>{title}</h3>
            </div>
            <button type="button" className="stack-pick-x" aria-label="Close" onClick={() => dialog.current?.close()}>
              ×
            </button>
          </header>
          <ul>
            {albums.map((al) => (
              <li key={al.slug}>
                <Link href={`/releases/${al.slug}`} onClick={() => dialog.current?.close()}>
                  <img src={al.cover} alt="" loading="lazy" />
                  <span>
                    <b>{al.title}</b>
                    <span className="mono">{al.songs} songs</span>
                  </span>
                </Link>
                <button
                  type="button"
                  className="stack-pick-go"
                  aria-label={`Play ${al.title}`}
                  disabled={loading === al.slug}
                  onClick={() => play(al.slug)}>
                  {p.playing && p.current?.albumHref === `/releases/${al.slug}` ? "❚❚" : "▶"}
                </button>
              </li>
            ))}
          </ul>
          {more && (
            <Link className="stack-pick-more mono" href={more.href} onClick={() => dialog.current?.close()}>
              {more.label} →
            </Link>
          )}
        </div>
      </dialog>
    </>
  );
}
