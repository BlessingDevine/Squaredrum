import type { Metadata } from "next";
import { ArtistSpotlight } from "@/components/artist-spotlight";
import { ArtistTools } from "@/components/artist-tools";
import { RosterCard } from "@/components/roster-card";
import { RosterOnAir } from "@/components/roster-on-air";
import { ArtistCard } from "@/components/roster-row";
import { PageHead, SectionHead, rosterCard } from "@/components/sections";
import { getCatalog } from "@/lib/catalog";
import { img } from "@/lib/img";
import { MOODS } from "@/lib/moods";
import { rosterExtras } from "@/lib/roster-extras";

export const revalidate = 300;
export const metadata: Metadata = { title: "Artists", description: "The voices of the house — every Squaredrum artist across eighteen imprints." };

export default async function Artists() {
  const c = await getCatalog();
  // Real artists first; the house collections (Country Square, Lofi Square…) get their own section.
  const extras = new Map(c.voices.map((a) => [a.slug, rosterExtras(a, c)]));
  const cards = c.voices.flatMap((a) => rosterCard(a, c) ?? []);
  const collections = c.collections.flatMap((a) => rosterCard(a, c) ?? []);
  // The big square takes artists with a portrait, at a size that stays sharp at double width.
  const spotlight = c.voices.flatMap((a) => {
    const x = extras.get(a.slug)!;
    return a.portrait
      ? [{ slug: a.slug, name: a.name, line: a.genre ?? a.imprintName ?? "", image: img(a.portrait, 1080), canvas: x.canvas, lines: x.lines, start: x.start }]
      : [];
  });
  const surprise = c.voices.flatMap((a) => {
    const start = extras.get(a.slug)!.start;
    return start ? [{ slug: a.slug, start }] : [];
  });
  return (
    <main>
      <PageHead
        eyebrow="The roster"
        title={
          <>
            Voices of
            <br />
            the house.
          </>
        }
        collage={cards.filter((a) => a.isPortrait).slice(0, 3).map((a) => a.image)}
        lede={`${c.voices.length} artists across ${c.imprints.length} imprints — from R&B and Afrobeats to rock, country and healing music.`}
      />
      <section className="sec wrap light-artists artist-results cards-overlay">
        <ArtistTools hasCollections={collections.length > 0} moods={MOODS} surprise={surprise} />
        <RosterOnAir />
        <div className="grid-artists grid-spotlight">
          <ArtistSpotlight artists={spotlight} />
          {cards.map((a) => {
            const x = extras.get(a.slug)!;
            return <RosterCard key={a.slug} a={a} x={{ canvas: x.canvas, words: x.words, isNew: x.isNew, moods: x.moods }} />;
          })}
        </div>
        <p className="artist-none mono" hidden>
          No artists match that search.
        </p>
      </section>
      {collections.length > 0 && (
        <section className="sec wrap light-artists artist-results" id="collections">
          <SectionHead eyebrow="House collections" title="The collections.">
            <p>Themed series from our labels — Country Square, Lofi Square, Easy Sunday and more.</p>
          </SectionHead>
          <div className="grid-artists grid-collections">
            {collections.map((a) => (
              <ArtistCard key={a.slug} a={a} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
