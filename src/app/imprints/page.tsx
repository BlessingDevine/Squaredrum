import type { Metadata } from "next";
import { ImprintGrid, PageHead } from "@/components/sections";
import { getCatalog, sized } from "@/lib/catalog";

export const revalidate = 300;
export const metadata: Metadata = { title: "Imprints", description: "Eighteen imprints, one house — every sound has a home at Squaredrum." };

export default async function Imprints() {
  const c = await getCatalog();
  return (
    <main>
      <PageHead
        eyebrow="The family"
        title={
          <>
            {c.imprints.length} imprints.
            <br />
            One house.
          </>
        }
        lede="Each imprint is its own label — its own artists, its own identity and its own live channel on Musicsquare Radio."
        collage={["riot-temple", "velvet-noir-records", "sunflag-africa"].map((s) => sized(c.imprintBySlug.get(s)?.cover ?? null, 600)!).filter(Boolean)}
      />
      <section className="sec wrap imprints">
        <ImprintGrid imprints={c.imprints} intro={false} />
      </section>
    </main>
  );
}
