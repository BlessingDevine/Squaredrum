/**
 * "In his / her / their own words" on artist pages and roster cards (Robert, 17 Nov 2026):
 * one man → his, one woman → her, groups and duos → their. Genders are from each artist's
 * Press Kit "Artist at a Glance" (Apex, Lea Babi, Pala from their persona files).
 * Add every new solo artist here; anyone missing gets "their".
 */
const HIS = [
  "apex", "bantan", "danni-blaze", "dusk-cannon", "elkana", "fizz", "hollow-district", "iron-mirage",
  "j-cruz", "knox-havoc", "lucas-meno", "noah-rust", "riven-cole", "sanza-benito", "thando-keys",
  "virgo-dunstan", "vxnti",
];
const HER = [
  "alina-carisma", "ash-revenant", "crimson-union", "deejay-zethu", "echo-rae", "lea-babi", "lucid-arrows", "lumi-astra",
  "lune-skylar", "neilly-storm", "neka", "nova-liyah", "pala", "sadie-colton", "saka", "yano-sky",
];

export function ownWordsPronoun(slug: string): "his" | "her" | "their" {
  if (HIS.includes(slug)) return "his";
  if (HER.includes(slug)) return "her";
  return "their";
}
