/**
 * The words and choices on squaredrum.com that aren't in the catalogue.
 * Edit here to change the hero artists, imprint descriptions or portraits.
 */

export type ImprintInfo = { slug: string; name: string; genre: string; blurb: string };

/** All eighteen imprints, in display order. Slugs match the catalogue. */
export const IMPRINTS: ImprintInfo[] = [
  { slug: "barrio-sonico", name: "Barrio Sonico", genre: "Reggaeton", blurb: "Street-born reggaeton with a perreo heartbeat." },
  { slug: "cartel32", name: "Cartel32", genre: "Trap", blurb: "Heavy 808s, dark melodies and trap soul." },
  { slug: "elemental", name: "Elemental", genre: "Lofi · Lounge · Chill", blurb: "Lofi, lounge and chill for slow mornings and late nights." },
  { slug: "globe-trotter-ent", name: "Globe Trotter Ent.", genre: "World Music", blurb: "Sounds from every corner of the map." },
  { slug: "gravedigger-music", name: "Gravedigger Music", genre: "Hip Hop", blurb: "Hip hop dug up from the underground." },
  { slug: "island-fyah-ent", name: "Island Fyah Ent.", genre: "Dancehall · Reggae", blurb: "Dancehall heat and roots reggae from the islands." },
  { slug: "livity-sound-system", name: "Livity Sound System", genre: "Island Pop", blurb: "Sun-soaked island pop built for the speaker stack." },
  { slug: "moonroot-afrique", name: "Moonroot Afrique", genre: "Afrocentric", blurb: "Afrocentric sounds rooted in heritage, grown for now." },
  { slug: "piano-nation", name: "Piano Nation", genre: "Amapiano · Afro House", blurb: "Log drums, deep keys and Afro house from South Africa." },
  { slug: "redwood-records", name: "Redwood Records", genre: "Country", blurb: "Country stories with dust on their boots." },
  { slug: "riot-temple", name: "Riot Temple", genre: "Rock", blurb: "Loud guitars, raw voices — rock with nothing to prove." },
  { slug: "sembora", name: "Sembora", genre: "Zouk · Kompa · Kizomba", blurb: "Zouk, kompa and kizomba for close dancing." },
  { slug: "serenity-soundz", name: "Serenity Soundz", genre: "Healing Music", blurb: "Healing music for rest, focus and calm." },
  { slug: "sol-de-oro-music", name: "Sol de Oro Music", genre: "Latin Pop", blurb: "Golden Latin pop with a romantic streak." },
  { slug: "sunflag-africa", name: "Sunflag Africa", genre: "Afrobeats", blurb: "Afrobeats from Lagos to Kinshasa and back." },
  { slug: "velvet-noir-records", name: "Velvet Noir Records", genre: "R&B · Soul", blurb: "Smooth R&B and soul, after dark." },
  { slug: "waivy-records", name: "Waivy Records", genre: "EDM · House", blurb: "House and EDM made for the drop." },
  { slug: "wavelight-records", name: "Wavelight Records", genre: "Pop", blurb: "Bright, bold pop for the main stage." },
];

/**
 * The home page hero rotates through every artist with a portrait, in a new
 * order each day. Its "New drop" button plays an album: the one named here
 * (album title as in the catalogue), else the artist's album in
 * FEATURED_RELEASES, else their biggest album with a cover.
 */
export const HERO_ALBUMS: Record<string, string> = {
  "lea-babi": "SOS",
  "litha-flow": "Nna Ke Sharp!",
  "riven-cole": "Wandering",
  "ash-revenant": "Afterheat",
  "bantan": "Wine & Smile",
};

/** Today's date in Los Angeles, e.g. "2026-10-08" — the hero's order changes at midnight PT. */
export const dayKey = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });

/** Albums shown first under "New releases", by album title + artist slug. */
export const FEATURED_RELEASES = [
  ["Nna Ke Sharp!", "litha-flow"],
  ["SOS", "lea-babi"],
  ["Afterheat", "ash-revenant"],
  ["Wandering", "riven-cole"],
  ["Mboka Queen", "pala"],
  ["Dry River", "iron-mirage"],
  ["Wine & Smile", "bantan"],
  ["Nova Liyah III", "nova-liyah"],
  ["City Limits", "noah-rust"],
  ["Echo Rae III", "echo-rae"],
  ["Luv Tonez IV", "luv-tonez"],
] as const;

/** Artists with a 4:5 portrait at public/roster/<slug>.jpg (from Musicsquare Radio's roster). */
const PORTRAITS = new Set([
  "ash-revenant", "bantan", "danni-blaze", "echo-rae", "fizz", "iron-mirage", "j-cruz", "lea-babi", "litha-flow",
  "lucas-meno", "lumi-astra", "lunah", "luv-tonez", "neilly-storm", "neka", "noah-rust", "nova-liyah",
  "pala", "riven-cole", "sadie-rose", "saka", "sanza-benito", "vegah-riot", "virgo-dunst",
]);

export const portraitFor = (slug: string) => (PORTRAITS.has(slug) ? `/roster/${slug}.jpg` : null);

/** Contact form topics; links can preselect one with /contact?topic=… */
export const TOPICS = ["General", "Brand campaign", "Launch & hype", "Education", "Entertainment", "Press & media", "GoSquare waitlist", "Artist / producer", "Other"];

export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatTime(ms: number) {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function formatLength(ms: number) {
  const min = Math.round(ms / 60000);
  return min >= 60 ? `${Math.floor(min / 60)} hr ${min % 60} min` : `${min} min`;
}
