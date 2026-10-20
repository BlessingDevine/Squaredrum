import type { Metadata } from "next";
import { ArtistTools } from "@/components/artist-tools";
import { ArtistCard } from "@/components/roster-row";
import { PageHead, SectionHead, rosterCard } from "@/components/sections";
import { getCatalog } from "@/lib/catalog";

export const revalidate = 300;
export const metadata: Metadata = { title: "Artists", description: "The voices of the house — every Squaredrum artist across eighteen imprints." };

export default async function Artists() {
  const c = await getCatalog();
  // Real artists first; the house collections (Country Square, Lofi Square…) get their own section.
  const cards = c.voices.flatMap((a) => rosterCard(a, c) ?? []);
  const collections = c.collections.flatMap((a) => rosterCard(a, c) ?? []);
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
        <ArtistTools hasCollections={collections.length > 0} />
        <div className="grid-artists">
          {cards.map((a) => (
            <ArtistCard key={a.slug} a={a} />
          ))}
        </div>
        <p className="artist-none mono" hidden>
          No artists match that search.
        </p>
      </section>
      {collections.length > 0 && (
        <section className="sec wrap light-artists artist-results cards-overlay" id="collections">
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
