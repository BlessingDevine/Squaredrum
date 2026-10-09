import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, ReleaseCard } from "@/components/sections";
import { getCatalog, sized } from "@/lib/catalog";

export const metadata: Metadata = { title: "Releases", description: "Every Squaredrum album and collection, across eighteen imprints." };

export default async function Releases({ searchParams }: PageProps<"/releases">) {
  const { imprint } = await searchParams;
  const c = await getCatalog();
  const withCovers = c.albums.filter((a) => a.cover);
  const active = typeof imprint === "string" ? c.imprintBySlug.get(imprint) : undefined;
  const shown = active ? withCovers.filter((a) => a.imprintSlug === active.slug) : withCovers;
  const imprints = c.imprints.filter((i) => withCovers.some((a) => a.imprintSlug === i.slug));

  return (
    <main>
      <PageHead
        eyebrow="Discography"
        title={active ? active.name : "Releases."}
        lede={`${shown.length} albums and collections${active ? ` from ${active.name}` : ` across ${imprints.length} imprints`}. Tap any cover to listen.`}
        crumbs={active ? [{ href: "/releases", label: "Releases" }] : undefined}
        collage={shown.slice(0, 3).map((a) => sized(a.cover, 600)!)}
      />
      <section className="sec wrap">
        <nav className="filters" aria-label="Filter by imprint">
          <Link className={`chip${active ? "" : " on"}`} href="/releases">
            All
          </Link>
          {imprints.map((i) => (
            <Link key={i.slug} className={`chip${active?.slug === i.slug ? " on" : ""}`} href={`/releases?imprint=${i.slug}`}>
              {i.name}
            </Link>
          ))}
        </nav>
        <div className="grid-albums">
          {shown.map((al) => (
            <ReleaseCard key={al.slug} album={al} c={c} />
          ))}
        </div>
      </section>
    </main>
  );
}
