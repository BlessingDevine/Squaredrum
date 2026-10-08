import type { Metadata } from "next";
import { ArtistCard } from "@/components/roster-row";
import { PageHead, rosterCard } from "@/components/sections";
import { getCatalog } from "@/lib/catalog";

export const revalidate = 300;
export const metadata: Metadata = { title: "Artists", description: "The voices of the house — every Squaredrum artist across seventeen imprints." };

export default async function Artists() {
  const c = await getCatalog();
  const cards = c.artists.flatMap((a) => rosterCard(a, c) ?? []);
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
        lede={`${c.artists.length} artists across ${c.imprints.length} imprints — from R&B and Afrobeats to rock, country and healing music.`}
      />
      <section className="sec wrap light-artists">
        <div className="grid-artists">
          {cards.map((a) => (
            <ArtistCard key={a.slug} a={a} />
          ))}
        </div>
      </section>
    </main>
  );
}
