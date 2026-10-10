"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { OnAirNow } from "@/lib/catalog";
import { RADIO_URL } from "@/lib/config";
import { liveItem, usePlayer } from "./player";

const fmt = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

// Fixed bar heights for the waveform, so server and browser draw the same thing.
const BARS = Array.from({ length: 90 }, (_, i) => Math.round(18 + Math.abs(Math.sin(i * 0.7) * 60 + Math.sin(i * 2.3) * 22)));

/**
 * The turntable: every Musicsquare Radio channel and what it is playing at
 * this moment. Play joins the channel live, in step with every other listener.
 */
export function OnAirDeck({ initial, at, imprintNames }: { initial: OnAirNow[]; at: number; imprintNames: Record<string, string> }) {
  const p = usePlayer();
  const [channels, setChannels] = useState(initial);
  const [slug, setSlug] = useState(initial[0]?.slug ?? null);
  // Phones and tablets stack the list above the song; once a channel is picked
  // the list folds down to that channel until "All channels" opens it again.
  const [folded, setFolded] = useState(false);
  // Starts at the server's clock so the first paint matches, then ticks.
  const [now, setNow] = useState(at);

  // Keep "what's on" current: tick every second, refetch when a song ends.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const nextChange = useMemo(() => Math.min(...channels.map((c) => c.endsAt)), [channels]);
  useEffect(() => {
    if (now < nextChange) return;
    let alive = true;
    fetch("/api/onair", { cache: "no-store" })
      .then((r) => r.json())
      .then((all: OnAirNow[]) => alive && all.length && setChannels(all))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [now, nextChange]);

  const sel = channels.find((c) => c.slug === slug) ?? channels[0];
  if (!sel) return <p className="empty mono">The channels are being tuned — check back in a minute.</p>;

  const liveSlug = p.current?.live?.slug;
  const isSel = liveSlug === sel.slug;
  const spinning = isSel && p.playing;
  const pct = Math.min(1, Math.max(0, (now - sel.startedAt) / (sel.endsAt - sel.startedAt)));
  const imprint = sel.imprintSlug ? imprintNames[sel.imprintSlug] : null;

  const tune = (c: OnAirNow) => {
    setSlug(c.slug);
    setFolded(true);
    if (liveSlug === c.slug) p.toggle();
    else p.playLive({ ...liveItem(c), artistHref: c.artistSlug ? `/artists/${c.artistSlug}` : null });
  };

  return (
    <div className={`deck${folded ? " folded" : ""}`}>
      <div className="deck-l">
        <div className="display side-word" aria-hidden="true">
          Live
        </div>
        <div className="mono">
          <span className="live-dot" />
          {channels.length} channels · on air now
        </div>
        <ol className="tracks">
          {channels.map((c, i) => (
            <li key={c.slug} className={c.slug === sel.slug ? "on" : undefined} onClick={() => tune(c)}>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              {c.cover ? <img src={c.cover.replace("-600.jpg", "-300.jpg")} alt="" /> : <span className="ph-ch" />}
              <span className="t">
                {c.name}
                <span className="a">
                  {liveSlug === c.slug && p.playing ? "♪ " : ""}
                  {c.title} — {c.artist}
                </span>
              </span>
              <span className="d">{fmt(c.endsAt - now)}</span>
            </li>
          ))}
        </ol>
        <button className="ch-toggle mono" onClick={() => setFolded((f) => !f)} aria-expanded={!folded}>
          {folded ? `All ${channels.length} channels ▾` : "Hide channels ▴"}
        </button>
      </div>

      <div className="deck-r info">
        <div className="mono">{imprint ?? "Musicsquare Radio"} · {sel.name} channel</div>
        <div className="cover-row">{sel.cover && <img src={sel.cover} alt="" />}</div>
        <div className="mono">{sel.artistSlug ? <Link className="artist-link" href={`/artists/${sel.artistSlug}`}>{sel.artist}</Link> : sel.artist}</div>
        <h3>{sel.title}</h3>
        <div className="by">{sel.album ? (sel.albumSlug ? <Link href={`/releases/${sel.albumSlug}`}>{sel.album}</Link> : sel.album) : "Single"}</div>
        <p className="desc">
          Playing right now on the {sel.name} channel. Everyone tuned in hears the same song at the same second — press play to join them.
        </p>
        <div className="btns">
          <button className="btn btn-ink" onClick={() => tune(sel)}>
            {spinning ? "❚❚ Pause" : "▶ Tune in"}
          </button>
          <a className="btn btn-cream" href={RADIO_URL} target="_blank" rel="noopener">
            Musicsquare Radio ↗
          </a>
        </div>
      </div>

      <div className="vinyl-wrap" aria-hidden="true">
        <div className={`vinyl${spinning ? " spin" : ""}`}>
          <div className="label">{sel.cover && <img src={sel.cover.replace("-600.jpg", "-300.jpg")} alt="" />}</div>
        </div>
        <svg className={`arm${spinning ? " down" : ""}`} viewBox="0 0 200 260">
          <circle cx="156" cy="30" r="22" fill="#2a2a2c" stroke="#D4A24C" strokeWidth="2" />
          <circle cx="156" cy="30" r="7" fill="#D4A24C" />
          <path d="M156 30 L150 170 L104 236" fill="none" stroke="#c9c6be" strokeWidth="7" strokeLinecap="round" />
          <rect x="86" y="226" width="34" height="22" rx="3" transform="rotate(-35 103 237)" fill="#1b1b1d" stroke="#D4A24C" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="deck-bar">
        <a className="back" href={RADIO_URL} target="_blank" rel="noopener" aria-label="Open Musicsquare Radio">
          ↗
        </a>
        <div className="wave">
          <span className="mono">{fmt(now - sel.startedAt)}</span>
          <div className="wave-bars">
            {BARS.map((h, n) => (
              <i key={n} className={n / BARS.length < pct ? "p" : undefined} style={{ height: `${h}%` }} />
            ))}
          </div>
          <span className="mono">-{fmt(sel.endsAt - now)}</span>
        </div>
        <button className="playbtn" onClick={() => tune(sel)} aria-label={spinning ? "Pause" : "Tune in"}>
          <span>{spinning ? "❚❚" : "▶"}</span>
        </button>
      </div>
    </div>
  );
}
