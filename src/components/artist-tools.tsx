"use client";

import { useEffect, useState } from "react";

/**
 * Toolbar on /artists: a search box that narrows the cards on the page
 * (artists and collections) as you type, and a jump to the collections. The
 * cards are server-rendered, so this only shows and hides them.
 */
export function ArtistTools({ hasCollections }: { hasCollections: boolean }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    const needle = q.trim().toLowerCase();
    document.querySelectorAll<HTMLElement>(".artist-results").forEach((sec) => {
      let shown = 0;
      sec.querySelectorAll<HTMLElement>(".grid-artists .artist").forEach((card) => {
        const hit = !needle || (card.textContent ?? "").toLowerCase().includes(needle);
        card.hidden = !hit;
        if (hit) shown++;
      });
      sec.hidden = shown === 0 && sec.id === "collections";
      sec.querySelector<HTMLElement>(".artist-none")?.toggleAttribute("hidden", shown > 0 || sec.id === "collections");
    });
  }, [q]);

  return (
    <div className="artist-tools">
      <label className="artist-search">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
        <input type="search" placeholder="Search artists" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search artists" />
      </label>
      {hasCollections && (
        <a className="chip" href="#collections">
          The collections ↓
        </a>
      )}
    </div>
  );
}
