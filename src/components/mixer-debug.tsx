"use client";

import { useEffect, useState } from "react";
import type { ChannelMixer } from "@/lib/channel-mixer";

type Dbg = Pick<ChannelMixer, "mode" | "lastMix">;

/**
 * squaredrum.com/?debug — what the live-channel mixer is doing, for checking
 * song changes on a real phone (where devtools aren't to hand).
 */
export function MixerDebug() {
  const [on, setOn] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    if (!location.search.includes("debug")) return;
    const t0 = setTimeout(() => setOn(true), 0);
    let hooked: HTMLAudioElement | null = null;
    const log = (e: Event) => {
      const el = e.target as HTMLAudioElement;
      const stamp = new Date().toLocaleTimeString([], { minute: "2-digit", second: "2-digit" });
      setEvents((x) => [`${stamp} ${e.type} t=${el.currentTime.toFixed(1)}${el.muted ? " muted" : ""}`, ...x].slice(0, 12));
    };
    const id = setInterval(() => {
      const m = (window as unknown as { __mixer?: Dbg }).__mixer;
      if (!m) return setLines(["mixer not started — tap a channel"]);
      const el = (m as unknown as { el?: HTMLAudioElement | null }).el ?? null;
      if (el && el !== hooked) {
        for (const ev of ["play", "playing", "pause", "waiting", "stalled", "error", "ended", "emptied"]) el.addEventListener(ev, log);
        hooked = el;
      }
      const air = (m as unknown as { air?: { track: { title: string }; endsAt: number; fadeMs: number } }).air;
      setLines([
        `mode: ${m.mode}`,
        `now: ${air?.track.title ?? "-"}  change in ${air ? Math.round((air.endsAt + air.fadeMs - Date.now()) / 1000) : "-"}s`,
        `last mix: ${m.lastMix ? `${m.lastMix.mode}${m.lastMix.reason ? ` (${m.lastMix.reason})` : ""} ${Math.round((Date.now() - m.lastMix.at) / 1000)}s ago` : "-"}`,
        el ? `element: ${el.paused ? "PAUSED" : "playing"}${el.muted ? " muted" : ""} vol ${el.volume.toFixed(2)} t=${el.currentTime.toFixed(1)} err=${el.error?.code ?? "-"}` : "element: -",
      ]);
    }, 500);
    return () => {
      clearTimeout(t0);
      clearInterval(id);
    };
  }, []);

  if (!on) return null;
  return (
    <pre
      style={{ position: "fixed", left: 8, right: 8, top: 80, zIndex: 400, margin: 0, padding: 10, background: "rgba(0,0,0,.85)", color: "#7CFC9B", font: "11px/1.45 ui-monospace,monospace", whiteSpace: "pre-wrap", pointerEvents: "none", borderRadius: 6 }}
    >
      {[...lines, "— element events —", ...events].join("\n")}
    </pre>
  );
}
