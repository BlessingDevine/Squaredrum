/**
 * "Start here" on an artist's page: three songs Robert picks for someone new
 * to the artist, each with one line on why. Titles are matched to the
 * artist's songs (case and accents ignored); an artist without picks shows no
 * section. Not popularity: these are choices.
 */
export const START_HERE: Record<string, { title: string; why: string }[]> = {
  "thando-keys": [
    { title: "Same Hands", why: "For the story: the church keyboard that ended up on club speakers." },
    { title: "Jacaranda", why: "For the dance floor: Pretoria in October, the streets gone purple." },
    { title: "Umama", why: "For the quiet: a thank-you to the woman who raised him." },
  ],
};
