"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Row } from "./play";
import { usePlayer } from "./player";

/**
 * Toolbar on /artists: a search box and mood chips (moods.ts) that narrow the
 * cards on the page (artists and collections) as you go, "Surprise me" (a random
 * artist's first Start here song, then their page), and a jump to the
 * collections. The cards are server-rendered, so this only shows and hides them.
 */
export function ArtistTools({
  hasCollections,
  moods = [],
  surprise = [],
}: {
  hasCollections: boolean;
  moods?: readonly string[];
  surprise?: { slug: string; start: Row }[];
}) {
  const [q, setQ] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const p = usePlayer();
  const router = useRouter();

  useEffect(() => {
    const needle = q.trim().toLowerCase();
    document.querySelectorAll<HTMLElement>(".artist-results").forEach((sec) => {
      let shown = 0;
      sec.querySelectorAll<HTMLElement>(".grid-artists .artist").forEach((card) => {
        const cell = card.closest<HTMLElement>(".artist-cell");
        const moodsOf = (cell?.dataset.moods ?? "").split("|");
        const hit = (!needle || (card.textContent ?? "").toLowerCase().includes(needle)) && (!mood || moodsOf.includes(mood));
        (cell ?? card).hidden = !hit;
        if (hit) shown++;
      });
      sec.hidden = shown === 0 && sec.id === "collections";
      sec.querySelector<HTMLElement>(".artist-none")?.toggleAttribute("hidden", shown > 0 || sec.id === "collections");
    });
  }, [q, mood]);

  const surpriseMe = () => {
    const pick = surprise[Math.floor(Math.random() * surprise.length)];
    if (!pick) return;
    p.playList([pick.start], 0);
    router.push(`/artists/${pick.slug}`);
  };

  return (
    <div className="artist-tools">
      <label className="artist-search">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
        <input type="search" placeholder="Search artists" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search artists" />
      </label>
      {surprise.length > 0 && (
        <button type="button" className="chip chip-surprise" onClick={surpriseMe}>
          ✦ Surprise me
        </button>
      )}
      {hasCollections && (
        <a className="chip" href="#collections">
          The collections ↓
        </a>
      )}
      {moods.length > 0 && (
        <div className="mood-chips" role="group" aria-label="Browse by mood">
          {moods.map((m) => (
            <button key={m} type="button" className={`chip${mood === m ? " on" : ""}`} aria-pressed={mood === m} onClick={() => setMood(mood === m ? null : m)}>
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
