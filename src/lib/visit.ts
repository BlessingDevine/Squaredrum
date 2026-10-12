import { useSyncExternalStore } from "react";

/**
 * A random seed for this visit (one page load in the browser), or null while
 * rendering on the server and during hydration — so the first paint matches the
 * server, and things that rotate "every visit" reshuffle right after.
 */
let seed: string | null = null;
const visitSeed = () => (seed ??= Math.random().toString(36).slice(2));
const subscribe = () => () => {};

export function useVisitSeed(): string | null {
  return useSyncExternalStore(subscribe, visitSeed, () => null);
}
