"use client";

import { useEffect } from "react";

/**
 * Lights the "On air" badge on /artists for every artist a Musicsquare Radio
 * channel is playing right now. Asks /api/onair again when the next song is due
 * (and when the tab comes back into view), so the badge moves with the radio.
 */
export function RosterOnAir() {
  useEffect(() => {
    let timer: number | undefined;
    let gone = false;
    const check = async () => {
      clearTimeout(timer);
      try {
        const res = await fetch("/api/onair", { cache: "no-store" });
        const air: { artistSlug: string | null; endsAt: number }[] = await res.json();
        if (gone) return;
        const on = new Set(air.flatMap((x) => (x.artistSlug ? [x.artistSlug] : [])));
        document.querySelectorAll<HTMLElement>(".artist-cell[data-slug], .artist-feature[data-slug]").forEach((el) => {
          el.toggleAttribute("data-onair", on.has(el.dataset.slug!));
        });
        const next = Math.min(...air.map((x) => x.endsAt)) - Date.now() + 1500;
        timer = window.setTimeout(check, Math.min(Math.max(Number.isFinite(next) ? next : 60_000, 15_000), 300_000));
      } catch {
        timer = window.setTimeout(check, 60_000);
      }
    };
    const back = () => document.visibilityState === "visible" && check();
    check();
    document.addEventListener("visibilitychange", back);
    return () => {
      gone = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", back);
    };
  }, []);
  return null;
}
