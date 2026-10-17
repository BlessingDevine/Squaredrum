"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * One shelf on /releases: a title, "See all", and a row of covers that scrolls
 * sideways (swipe on phones, arrows on desktop). The covers are server-rendered
 * and passed in as children. `sameLabel`: every cover is from the shelf's own
 * label, so the label name under each one is left out.
 */
export function Shelf({ title, href, count, sameLabel = false, children }: { title: string; href: string; count: number; sameLabel?: boolean; children: React.ReactNode }) {
  const row = useRef<HTMLDivElement>(null);
  const [ends, setEnds] = useState({ start: true, end: false });

  const measure = () => {
    const el = row.current;
    if (!el) return;
    setEnds({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  };
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const step = (dir: 1 | -1) => {
    const el = row.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className={`shelf${sameLabel ? " shelf-label" : ""}`}>
      <div className="shelf-head wrap">
        <h2 className="display">{title}</h2>
        <div className="shelf-ctrl">
          <Link className="shelf-all mono" href={href}>
            See all {count}
          </Link>
          <button type="button" className="shelf-arrow" aria-label="Scroll left" disabled={ends.start} onClick={() => step(-1)}>
            ←
          </button>
          <button type="button" className="shelf-arrow" aria-label="Scroll right" disabled={ends.end} onClick={() => step(1)}>
            →
          </button>
        </div>
      </div>
      <div className="shelf-row" ref={row} onScroll={measure}>
        {children}
      </div>
    </section>
  );
}

/**
 * Search on /releases. While there's a query, the shelves step aside and the
 * full grid (every release, already on the page) is narrowed to the matches.
 */
export function ReleaseSearch() {
  const [q, setQ] = useState("");

  useEffect(() => {
    const needle = q.trim().toLowerCase();
    const shelves = document.querySelector<HTMLElement>(".shelves");
    const grid = document.querySelector<HTMLElement>(".rel-results");
    if (!grid) return;
    if (shelves) {
      shelves.hidden = !!needle;
      grid.hidden = !needle;
    }
    let shown = 0;
    grid.querySelectorAll<HTMLElement>(".rel").forEach((card) => {
      const hit = !needle || (card.textContent ?? "").toLowerCase().includes(needle);
      card.hidden = !hit;
      if (hit) shown++;
    });
    grid.querySelector<HTMLElement>(".artist-none")?.toggleAttribute("hidden", shown > 0);
  }, [q]);

  return (
    <label className="artist-search">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
      <input type="search" placeholder="Search albums and artists" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search releases" />
    </label>
  );
}
