// When each album came out, for the order on /releases (newest first). The
// catalogue doesn't record release dates, so they live here: "YYYY-MM" where
// the month is known, "YYYY" where only the year is. Keyed by album title,
// lower case. An album not listed counts from the day its first song was added
// to the catalogue, which is right for everything new.

const DEC_2024 = ["Afro Square Vol 1", "Afro Square Vol 2", "Country Square Vol 1", "Country Square Vol 2", "Pop Square I", "Pop Square II"];

const IN_2025 = [
  // compilations
  "Latin Square Vol I",
  "Reggaeton I",
  "Trapsoul I",
  "Trapsoul II",
  "Trapsoul III",
  "Lofi Square Vol 1",
  "Lofi Square Vol 2",
  "Kingston Square Vol 1",
  "Kingston Square Vol 2",
  "Kingston Square Vol 3",
  "Kizomba I",
  "Kizomba II",
  "Zouk Love",
  "Sunset Over Yaba",
  "Easy Sunday I",
  "Easy Sunday II",
  "Relaxing Piano I",
  "Relaxing Piano II",
  "Relaxing Piano III",
  "Soothing Piano I",
  "Soothing Piano II",
  "Soothing Piano III",
  "Love in Paris",
  "R&B Square I",
  "R&B Square II",
  "R&B Square III",
  "R&B Square IV",
  "Dance Square Vol 1",
  "Dance Square Vol 2",
  "House Square Vol 1",
  "Dreamy Pop Vol 1",
  "Dreamy Pop Vol 2",
  "Pop Square III",
  "Pop Square IV",
  "Pop Square V",
  // artist albums
  "Success & Heartbreak",
  "Apex Vol 1",
  "Apex Vol 2",
  "Apex Vol 3",
  "Already Winning",
  "Main Character",
  "The Holy Moly",
  "Mboka Queen",
  "Sanza Benito",
  "Closer Than Close",
  "Too Fine",
  "Wine & Smile",
  "Sexual Fantasies",
  "SOS",
  "Lucas Meno",
  "In Real Time",
  "Luv Tonez",
  "Luv Tonez II",
  "Luv Tonez III",
  "Luv Tonez IV",
  "Willingly",
  "Echo Rae",
  "Echo Rae II",
  "Echo Rae III",
  "Lumi Astra",
  "Lumi Astra II",
  "Lumi Astra III",
  "Nova Liyah",
  "Nova Liyah II",
  "Nova Liyah III",
  "Let's Talk About It",
  "Saka",
  "11:11 Wish",
  "Polaroid Moment",
  "Radio Static",
];

const RELEASED = new Map<string, string>([...DEC_2024.map((t) => [t.toLowerCase(), "2024-12"] as const), ...IN_2025.map((t) => [t.toLowerCase(), "2025"] as const)]);

/** A sortable release date: the listed one, else the day the album was first added ("YYYY-MM-DD"). */
export function releasedOn(title: string, firstAdded: string): string {
  return RELEASED.get(title.toLowerCase()) ?? firstAdded.slice(0, 10);
}
