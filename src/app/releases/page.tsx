import type { Metadata } from "next";
import Link from "next/link";
import { ReleaseSearch, Shelf } from "@/components/release-browser";
import { ArtistStackCard, PageHead, ReleaseCard } from "@/components/sections";
import { type Album, getCatalog, sized } from "@/lib/catalog";
import { seededShuffle } from "@/lib/seeded";

export const metadata: Metadata = { title: "Releases", description: "Every Squaredrum album and collection, across eighteen imprints." };

const NEW_SHELF = 14;
const newestFirst = (a: Album, b: Album) => b.released.localeCompare(a.released) || a.title.localeCompare(b.title, undefined, { numeric: true });

/** Fold a shelf's albums (newest first) by artist: one group per artist, in the order of their newest album. */
function byArtist(albums: Album[]): Album[][] {
  const groups = new Map<string, Album[]>();
  for (const al of albums) {
    const key = al.artistSlug ?? `album:${al.slug}`; // label-credited compilations have no artist page to fold into
    groups.set(key, [...(groups.get(key) ?? []), al]);
  }
  return [...groups.values()];
}

/** A compilation's series name: "Dance Square Vol 2" → "Dance Square", "Easy Sunday II" → "Easy Sunday". */
function seriesName(title: string) {
  return title.replace(/\s+(vol\.?\s*)?([ivx]+|\d+)$/i, "").trim();
}
const seriesSlug = (al: Album) => `${al.imprintSlug}-${seriesName(al.title)}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/**
 * Fold the compilations by series. A collection with several albums under one
 * artist (R&B Square, which includes Love in Paris) folds by that artist; the
 * rest fold by title (Dance Square Vol 1 & 2, Easy Sunday I & II).
 */
function bySeries(albums: Album[]): { albums: Album[]; name?: string; href?: string }[] {
  const perArtist = new Map<string, number>();
  for (const al of albums) if (al.artistSlug) perArtist.set(al.artistSlug, (perArtist.get(al.artistSlug) ?? 0) + 1);
  const groups = new Map<string, Album[]>();
  for (const al of albums) {
    const key = al.artistSlug && perArtist.get(al.artistSlug)! > 1 ? `artist:${al.artistSlug}` : `series:${seriesSlug(al)}`;
    groups.set(key, [...(groups.get(key) ?? []), al]);
  }
  return [...groups.entries()].map(([key, g]) => {
    const oneArtist = key.startsWith("artist:") || (g[0].artistSlug && g.every((al) => al.artistSlug === g[0].artistSlug));
    return oneArtist ? { albums: g } : { albums: g, name: seriesName(g[0].title), href: `/releases?kind=compilations&series=${seriesSlug(g[0])}` };
  });
}

/** Three covers for the header, different on every visit (the page renders per request). */
function headerCovers(albums: Album[]) {
  return seededShuffle(albums, String(Math.random()))
    .slice(0, 3)
    .map((a) => sized(a.cover, 600)!);
}

export default async function Releases({ searchParams }: PageProps<"/releases">) {
  const { imprint, kind, view, series } = await searchParams;
  const c = await getCatalog();
  const all = c.albums.filter((a) => a.cover).sort(newestFirst);
  const active = typeof imprint === "string" ? c.imprintBySlug.get(imprint) : undefined;
  const compilations = kind === "compilations";
  const everything = view === "all";
  const filtered = !!active || compilations || everything;
  const inSeries = compilations && typeof series === "string" ? all.filter((a) => a.compilation && seriesSlug(a) === series) : [];
  const shown = active
    ? all.filter((a) => a.imprintSlug === active.slug)
    : inSeries.length
      ? inSeries
      : compilations
        ? all.filter((a) => a.compilation)
        : all;
  const imprints = c.imprints.filter((i) => all.some((a) => a.imprintSlug === i.slug));

  // Shelves: what's new (album by album), then each label's own artist albums folded by artist (labels with the
  // newest work first), then the compilations folded by series. "See all" and search show every album.
  const fresh = all.filter((a) => a.released.startsWith("2026")).slice(0, NEW_SHELF);
  const labelShelves = imprints
    .map((i) => ({ imprint: i, albums: all.filter((a) => a.imprintSlug === i.slug && !a.compilation), total: all.filter((a) => a.imprintSlug === i.slug).length }))
    .filter((s) => s.albums.length > 0)
    .sort((x, y) => newestFirst(x.albums[0], y.albums[0]));
  const comps = all.filter((a) => a.compilation);

  const collage = headerCovers(shown);
  const title = active ? active.name : inSeries.length ? seriesName(inSeries[0].title) : compilations ? "Compilations." : "Releases.";
  const lede = active
    ? `${shown.length} albums and collections from ${active.name}, newest first.`
    : inSeries.length
      ? `${shown.length} volumes, newest first.`
      : compilations
        ? `${shown.length} compilations from across our labels, newest first.`
      : `${all.length} albums and collections across ${imprints.length} imprints. Tap any cover to listen.`;

  return (
    <main>
      <PageHead
        eyebrow="Discography"
        title={title}
        lede={lede}
        crumbs={filtered ? [{ href: "/releases", label: "Releases" }] : undefined}
        collage={collage}
      />
      <section className="sec wrap rel-top">
        <div className="artist-tools">
          <ReleaseSearch />
        </div>
        <nav className="filters" aria-label="Filter releases">
          <Link className={`chip${active || compilations ? "" : " on"}`} href="/releases">
            All
          </Link>
          <Link className={`chip${compilations ? " on" : ""}`} href="/releases?kind=compilations">
            Compilations
          </Link>
          {imprints.map((i) => (
            <Link key={i.slug} className={`chip${active?.slug === i.slug ? " on" : ""}`} href={`/releases?imprint=${i.slug}`}>
              {i.name}
            </Link>
          ))}
        </nav>
      </section>

      {!filtered && (
        <div className="shelves">
          {fresh.length > 0 && (
            <Shelf title="New releases" href="/releases?view=all" count={all.length}>
              {fresh.map((al) => (
                <ReleaseCard key={al.slug} album={al} c={c} />
              ))}
            </Shelf>
          )}
          {labelShelves.map((s) => (
            <Shelf key={s.imprint.slug} title={s.imprint.name} href={`/releases?imprint=${s.imprint.slug}`} count={s.total} sameLabel>
              {byArtist(s.albums).map((g) =>
                g.length > 1 ? <ArtistStackCard key={g[0].slug} albums={g} c={c} showLabel={false} /> : <ReleaseCard key={g[0].slug} album={g[0]} c={c} />,
              )}
            </Shelf>
          ))}
          {comps.length > 0 && (
            <Shelf title="Compilations" href="/releases?kind=compilations" count={comps.length}>
              {bySeries(comps).map((g) =>
                g.albums.length > 1 ? (
                  <ArtistStackCard key={g.albums[0].slug} albums={g.albums} c={c} name={g.name} href={g.href} />
                ) : (
                  <ReleaseCard key={g.albums[0].slug} album={g.albums[0]} c={c} />
                ),
              )}
            </Shelf>
          )}
        </div>
      )}

      <section className="sec wrap rel-results" hidden={!filtered}>
        <div className="grid-albums">
          {shown.map((al) => (
            <ReleaseCard key={al.slug} album={al} c={c} />
          ))}
        </div>
        <p className="artist-none mono" hidden>
          No releases match that search.
        </p>
      </section>
    </main>
  );
}
