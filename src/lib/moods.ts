/**
 * Mood chips on /artists: tap one and the roster narrows to artists tagged with
 * it. Tags are drafted from each artist's genre, songs and bio and approved by
 * Robert, the same way as the Start here picks. Collections carry no moods.
 */
export const MOODS = ["Heartbreak", "Dance floor", "Late night", "Feel-good", "Self-love", "Rock out"] as const;
export type Mood = (typeof MOODS)[number];

export const ARTIST_MOODS: Record<string, Mood[]> = {
  apex: ["Late night"],
  "ash-revenant": ["Heartbreak", "Rock out"],
  bantan: ["Late night", "Heartbreak"],
  "cedar-line": ["Feel-good"],
  "crimson-union": ["Rock out", "Late night"],
  "danni-blaze": ["Dance floor", "Feel-good"],
  "deejay-zethu": ["Dance floor", "Feel-good"],
  "dusk-cannon": ["Rock out"],
  "echo-rae": ["Heartbreak", "Feel-good"],
  elkana: ["Heartbreak", "Late night", "Self-love"],
  fizz: ["Dance floor", "Feel-good"],
  "hollow-district": ["Heartbreak", "Late night"],
  "iron-mirage": ["Rock out"],
  "j-cruz": ["Heartbreak", "Feel-good"],
  "knox-havoc": ["Rock out", "Feel-good"],
  "lea-babi": ["Late night", "Self-love"],
  "litha-flow": ["Dance floor", "Feel-good"],
  "lucas-meno": ["Late night", "Heartbreak"],
  "lucid-arrows": ["Heartbreak", "Rock out"],
  "lumi-astra": ["Feel-good"],
  lunah: ["Late night"],
  "lune-skylar": ["Feel-good", "Heartbreak"],
  "luv-tonez": ["Late night"],
  "neilly-storm": ["Dance floor", "Feel-good"],
  neka: ["Dance floor", "Feel-good"],
  "noah-rust": ["Heartbreak", "Late night"],
  "nova-liyah": ["Feel-good", "Self-love"],
  pala: ["Dance floor"],
  "riven-cole": ["Heartbreak"],
  "sadie-colton": ["Feel-good", "Self-love"],
  saka: ["Self-love", "Feel-good"],
  "sanza-benito": ["Dance floor", "Feel-good"],
  "steel-vandal": ["Rock out", "Heartbreak"],
  "thando-keys": ["Dance floor", "Feel-good"],
  "throne-static": ["Rock out"],
  "vegah-riot": ["Rock out", "Heartbreak"],
  "virgo-dunstan": ["Late night"],
  vxnti: ["Late night"],
  "yano-sky": ["Dance floor"],
};
