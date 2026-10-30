"use client";

import { useEffect, useRef, useState } from "react";
import { canvasFocus } from "@/lib/canvas-focus";
import { usePlayer } from "./player";

const still = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * An album's Canvas loop over its cover on a release card: on hover (computers)
 * or a long press (phones), and for as long as that album is playing and the
 * card is on screen. Loaded only the first time it's needed; leaving keeps the
 * frame it reached, as on /artists.
 */
export function CoverCanvas({ src, albumHref }: { src: string; albumHref: string }) {
  const box = useRef<HTMLSpanElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const { current, playing } = usePlayer();
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);

  const isPlaying = playing && current?.albumHref === albumHref;
  const live = hover || (isPlaying && inView);

  useEffect(() => {
    const card = box.current?.closest("a");
    if (!card) return;
    let timer: number | undefined;
    let pressed = false;
    const later = (delay: number) => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        pressed = delay > 300; // a long press shouldn't also open the page
        setHover(true);
      }, delay);
    };
    const off = () => {
      clearTimeout(timer);
      setHover(false);
    };
    const enter = (e: PointerEvent) => e.pointerType === "mouse" && later(200);
    const leave = (e: PointerEvent) => e.pointerType === "mouse" && off();
    const press = () => later(450);
    const moved = () => clearTimeout(timer);
    const menu = (e: Event) => e.preventDefault();
    const click = (e: Event) => {
      if (pressed) e.preventDefault();
      pressed = false;
    };
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    card.addEventListener("touchstart", press, { passive: true });
    card.addEventListener("touchend", off);
    card.addEventListener("touchmove", moved, { passive: true });
    card.addEventListener("contextmenu", menu);
    card.addEventListener("click", click);
    return () => {
      clearTimeout(timer);
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
      card.removeEventListener("touchstart", press);
      card.removeEventListener("touchend", off);
      card.removeEventListener("touchmove", moved);
      card.removeEventListener("contextmenu", menu);
      card.removeEventListener("click", click);
    };
  }, []);

  // Only while its album plays: a shelf or hidden search grid can hold the same album twice.
  useEffect(() => {
    const el = box.current;
    if (!el || !isPlaying) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [isPlaying]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (!live || still()) {
      const t = window.setTimeout(() => {
        v.pause();
        setStarted(false);
      }, 400);
      return () => clearTimeout(t);
    }
    if (!v.getAttribute("src")) v.src = src;
    let wanted = true;
    v.play().then(() => wanted && setStarted(true), () => {});
    return () => {
      wanted = false;
    };
  }, [live, src]);

  return (
    <span className={`rel-canvas${live && started ? " is-live" : ""}`} ref={box} aria-hidden="true">
      <video ref={video} className="card-canvas" style={canvasFocus(src)} muted loop playsInline preload="none" />
    </span>
  );
}
