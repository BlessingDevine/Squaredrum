/**
 * Where the face is in each Canvas loop, so a square crop of the 9:16 video (a
 * card preview or the spotlight on /artists) keeps it in frame. Worked out with
 * macOS Vision face detection on every half second of each loop, with room above
 * the head for hair and hats, then checked by eye (Oct 2026); the number is the CSS
 * object-position y, in %. Keyed by the Canvas file's hash.
 */
const FOCUS: Record<string, number> = {
  "8474def429fe45499126": 14, // ash-revenant
  "3c824f14516e3de423b3": 3, // bantan
  "2a1ab73d0c45cea3e2ca": 16, // cedar-line
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
  "c2397774ca6163687bd5": 30, // throne-static
  "142f8c9bfeef89d7ec28": 16, // vegah-riot
  "9700f16405aaa77a16c0": 0, // virgo-dunstan
  "64316c28149fb047e0d0": 52, // vxnti
  "fd59159ba661c28461a6": 52, // yano-sky
};

/** object-position for a Canvas shown square; an unknown loop sits near the top, where faces usually are. */
export function canvasFocus(src: string | null) {
  const key = src?.match(/([0-9a-f]{20})\.mp4$/)?.[1];
  return `50% ${key && key in FOCUS ? FOCUS[key] : 20}%`;
}
