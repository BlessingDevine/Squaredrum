"use client";

import { useEffect, useState } from "react";
import type { NextOnAir, OnAirNow } from "@/lib/catalog";
import { liveItem, usePlayer } from "./player";

type Air = { now: OnAirNow[]; next: NextOnAir | null };

/**
 * A live line on the artist page: one of their songs on a Musicsquare Radio
 * channel right now (tune in from here), or the next one coming up within
 * three hours, counting down. It checks again when that song starts or ends,
 * and shows nothing when none of their songs is due.
 */
export function ArtistOnAir({ slug }: { slug: string }) {
  const p = usePlayer();
  const [air, setAir] = useState<Air | null>(null);
  const [clock, setClock] = useState(() => Date.now());

  useEffect(() => {
    let timer = 0;
    let stopped = false;
    const load = async () => {
      try {
        const r = await fetch(`/api/artist-air/${slug}`, { cache: "no-store" });
        const a = (await r.json()) as Air;
        if (stopped) return;
        setAir(a);
        setClock(Date.now());
        // Look again just after the song on now ends, or the next one starts.
        const at = a.now[0]?.endsAt ?? a.next?.startsAt;
        if (at) timer = window.setTimeout(load, Math.max(5_000, at - Date.now() + 1_500));
      } catch {
        // No line is fine; the page works without it.
      }
    };
    load();
    const tick = window.setInterval(() => setClock(Date.now()), 30_000);
    return () => {
      stopped = true;
      clearTimeout(timer);
      clearInterval(tick);
    };
  }, [slug]);

  const on = air?.now[0];
  if (on) {
    const tuned = p.current?.live?.slug === on.slug && p.playing;
    return (
      <p className="artist-air mono">
        <span className="artist-air-dot" aria-hidden="true" />
        <span>
          On air now · <b>{on.title}</b> on {on.name}
        </span>
        <button
          type="button"
          className="artist-air-btn mono"
          onClick={() => (tuned ? p.toggle() : p.playLive({ ...liveItem(on), artistHref: `/artists/${slug}` }))}
        >
          {tuned ? "■ Stop" : "▶ Tune in"}
        </button>
      </p>
    );
  }
  const next = air?.next;
  if (!next) return null;
  const mins = Math.max(1, Math.round((next.startsAt - clock) / 60_000));
  const when = mins < 60 ? `in ${mins} min` : `in ${Math.floor(mins / 60)} h ${String(mins % 60).padStart(2, "0")} min`;
  return (
    <p className="artist-air artist-air-next mono">
      <span>
        Next on air {when} · <b>{next.title}</b> on {next.name}
      </span>
    </p>
  );
}
