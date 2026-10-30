import type { CSSProperties } from "react";

/**
 * Where the face is in each Canvas loop, so a square crop of the 9:16 video (a
 * card on /artists or /releases, or the spotlight on /artists) keeps it in
 * frame. Worked out with macOS Vision face detection on every half second of
 * each loop, with room above the head for hair and hats, then checked by eye (Oct 2026); the number is the CSS
 * object-position y, in %. Keyed by the Canvas file's hash. A loop filmed wider
 * than the rest (head and torso small in the square) is also zoomed in around
 * the face: ZOOM gives the scale and the face's spot in the square (x %, y %).
 */
const FOCUS: Record<string, number> = {
  "8474def429fe45499126": 14, // ash-revenant
  "3c824f14516e3de423b3": 3, // bantan
  "2a1ab73d0c45cea3e2ca": 40, // cedar-line
  "297c04658047d50b5fb4": 16, // crimson-union
  "b57264413093e38d908b": 0, // danni-blaze
  "e4195b79c2f0655d046c": 0, // deejay-zethu
  "10440395000d2e178886": 22, // dusk-cannon
  "e4bba773753551ab03ed": 24, // echo-rae
  "5bfe39de492cfdedeb82": 0, // elkana
  "732b637fb36c84454438": 4, // fizz
  "7ee33ca1f178d6b3e956": 57, // hollow-district
  "fec50f075fcb8da26724": 18, // iron-mirage
  "2b4145a5e3ddbf45aa83": 0, // j-cruz
  "8a4a6eaf6b04c516e136": 39, // knox-havoc
  "605dc6983d5b5a40ebe1": 0, // lea-babi
  "712274d84f5aa8a88c2c": 42, // litha-flow
  "ae93ef169ba808505dd5": 29, // lucas-meno
  "e362d589837e4852bf20": 44, // lucid-arrows
  "f0503b68a9234260f4a7": 32, // lumi-astra
  "dae83bb2199d9d4088bb": 0, // lunah
  "11f7d9c4b414957138ba": 0, // lune-skylar
  "ef9e28f8afc5c4e2220d": 0, // luv-tonez
  "c0b28581bed3fadc6667": 27, // neilly-storm
  "f8e223c98c9f4e4a7cf1": 18, // neka
  "00875bf963cbcaa0f38b": 7, // noah-rust
  "ed06fd413c274ef4a077": 0, // nova-liyah
  "b5a6c9f8e2addb00c613": 0, // riven-cole
  "dca27eb3c03ae0a52e78": 4, // sadie-colton
  "f2984ee12a2134aae303": 0, // saka
  "e42fe01dc329436a2270": 24, // steel-vandal
  "e88d45c7a42454b31a85": 19, // thando-keys
  "142c8a1e73b16ea3ee07": 0, // sanza-benito
  "c2397774ca6163687bd5": 30, // throne-static
  "142f8c9bfeef89d7ec28": 16, // vegah-riot
  "9700f16405aaa77a16c0": 0, // virgo-dunstan
  "64316c28149fb047e0d0": 52, // vxnti
  "fd59159ba661c28461a6": 52, // yano-sky
  // Other albums' loops, for release cards (Oct 2026).
  "c6f2dfff1644254c1840": 62, // City Limits
  "a3409191532f41db1b7a": 4, // Echo Rae II
  "ff2f63790e604ef01a26": 16, // Echo Rae III
  "4f89537ea5d727d4d2d6": 41, // Every Part of Me
  "87bf7992e88176d0c693": 59, // Excellent Timing
  "bd0bcb1cf4cfefe5b092": 100, // It Runs Without Me
  "ba70445707193e8817c5": 31, // Legend By Morning
  "a41461cbdc1dc729fa1c": 24, // Lumi Astra II
  "17198db6aee5a24c3fbe": 0, // Lumi Astra III
  "f9f9dd069650d0c65d0c": 29, // Luv Tonez II
  "a147de50a5f3f2d50c56": 29, // Luv Tonez III
  "f69d0e3a8ffa97a92a1b": 69, // Luv Tonez IV
  "0bd3c9b74ec87ea6381c": 75, // Minor Details
  "87104a2d26813349148b": 22, // New Reflex
  "3d8d6f5958f3719f3a8f": 38, // No Excuse
  "6d72cc5db9286d83df6a": 90, // No Witness
  "3778a7d2c65128e98fa2": 100, // Nobody Else Thinks So
  "73c63ebeb775097f3bfe": 54, // Nobody's Boyfriend
  "6dd8607c1bafa2ac0edb": 55, // Not Trying Hard Enough
  "f497153ebd992cbd481a": 84, // Nothing Left to Say It With
  "18a042aabbf822e095a8": 28, // Nova Liyah II
  "ce26a8956f6d0a9ca0e3": 30, // Nova Liyah III
  "af7be9417a1a1bd60998": 62, // Old Mule
  "e9a36b6b8635d65307ce": 93, // On A Loop
  "7c5584c6f1c61a6b60ee": 64, // Our Own Religion
  "ba88a197b50b6264c283": 60, // Out of Order
  "b2a70689400bd4f89a8f": 5, // Paper Plates
  "bfb0e383de392f5b6bc6": 18, // Pressure Feat. Lea Babi
  "3913de39b36513270096": 70, // Rot in the Walls
  "4de3ec35582d6e2a4764": 84, // Same Bar, Ten Years
  "05078927dff16d552eb3": 13, // Same Hands
  "5b2780f01075bdc79fd7": 33, // SOS
  "c48a7fbe47ca9fab85f9": 37, // Still Here
  "4c2ea80858df7bc7ee06": 72, // The Villain in Your Version
  "7b993d0bb055760d5441": 6, // Too Fine
  "a9a64c28e240439703e6": 69, // Voice Memos
  "b07ade857c3971653b03": 8, // Wandering
  "5fdd2813c2d9cce31a95": 84, // What You Actually Meant
  "ae7a4d9c98ecd3a622d7": 0, // Wine & Smile
};

const ZOOM: Record<string, { scale: number; x: number; y: number }> = {
  "142c8a1e73b16ea3ee07": { scale: 1.5, x: 52, y: 28 }, // sanza-benito: waist-up balcony shot
};

/** Style for a Canvas shown square; an unknown loop sits near the top, where faces usually are. */
export function canvasFocus(src: string | null): CSSProperties {
  const key = src?.match(/([0-9a-f]{20})\.mp4$/)?.[1];
  const z = key ? ZOOM[key] : undefined;
  return {
    objectPosition: `50% ${key && key in FOCUS ? FOCUS[key] : 20}%`,
    ...(z && { transform: `scale(${z.scale})`, transformOrigin: `${z.x}% ${z.y}%` }),
  };
}
