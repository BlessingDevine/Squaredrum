import type { Metadata } from "next";
import Link from "next/link";
import { DownloadsChip } from "@/components/account";
import { BackLink } from "@/components/back-link";
import { notFound } from "next/navigation";
import { ExplicitBadge, PlayButton, TrackList } from "@/components/play";
import { ReleaseCard } from "@/components/sections";
import { ALBUM_STORIES } from "@/lib/album-stories";
import { getCatalog, sized } from "@/lib/catalog";
import { toRow } from "@/lib/rows";
import { formatLength } from "@/lib/site";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/releases/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const al = (await getCatalog()).albumBySlug.get(slug);
  if (!al) return {};
  return {
    title: `${al.title} — ${al.artist}`,
    description: `${al.title} by ${al.artist}: ${al.songIds.length} songs on Squaredrum.`,
    openGraph: { images: al.cover ? [sized(al.cover, 600)!] : [] },
  };
}

export default async function ReleasePage({ params }: PageProps<"/releases/[slug]">) {
  const { slug } = await params;
  const c = await getCatalog();
  const al = c.albumBySlug.get(slug);
  if (!al) notFound();

  const rows = al.songIds.map((id) => toRow(c.songById.get(id)!, c));
  const artist = al.artistSlug ? c.artistBySlug.get(al.artistSlug) : undefined;
  const imp = al.imprintSlug ? c.imprintBySlug.get(al.imprintSlug) : undefined;
  // The artist's other albums, newest first; an artist with just this one (Easy Sunday II) falls back to the label's.
  const others = (slugs: string[]) =>
    slugs
      .filter((s) => s !== al.slug)
      .map((s) => c.albumBySlug.get(s)!)
      .filter((x) => x?.cover)
      .sort((x, y) => y.released.localeCompare(x.released) || x.title.localeCompare(y.title, undefined, { numeric: true }))
      .slice(0, 5);
  const fromArtist = artist ? others(artist.albumSlugs) : [];
  const more = fromArtist.length ? fromArtist : others(imp?.albumSlugs ?? []);

  // The album's story (src/lib/album-stories.ts), keyed by its folder name.
  const fold = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const story = artist
    ? Object.entries(ALBUM_STORIES[artist.slug] ?? {}).find(([name]) => fold(name) === fold(al.title))?.[1]
    : undefined;

  return (
    <main>
      <section
        className="sec wrap dark album-hero"
        // On phones a blurred copy of the cover fills the dark space around it.
        style={{ paddingTop: "clamp(84px,7vw,110px)", ...(al.cover ? { ["--amb" as string]: `url(${sized(al.cover, 300)})` } : {}) }}
      >
        <nav className="crumbs mono" aria-label="Breadcrumb">
          <BackLink fallback="/#releases" /> · <Link href="/releases">Releases</Link> /{imp && <Link href={`/releases?imprint=${imp.slug}`}>{imp.name}</Link>}
        </nav>
        <div className={`album-top${al.canvas ? " has-canvas" : ""}`}>
          {al.canvas ? (
            <video
              className="cv canvas"
              src={al.canvas}
              poster={al.canvas.replace(/\.mp4$/, ".jpg")}
              autoPlay
              muted
              loop
              playsInline
              aria-label={`${al.title} artwork, moving`}
            />
          ) : al.cover ? (
            <img className="cv" src={sized(al.cover, 600)!} alt={al.title} />
          ) : (
            <span className="ph-empty" />
          )}
          <div>
            <div className="eyebrow mono">{al.songIds.length === 1 ? "Single" : "Album"}</div>
            <h1 className="display">{al.title}</h1>
            <div className="by">
              {artist ? <Link href={`/artists/${artist.slug}`}>{al.artist}</Link> : al.artist}
              <span className="mono" style={{ color: "#9c998f", marginLeft: 12 }}>
                {al.songIds.length} songs · {formatLength(al.durationMs)}
              </span>
              {rows.some((r) => r.explicit) && <ExplicitBadge />}
            </div>
            <div className="btns">
              <PlayButton items={rows} label="Play album" />
              {imp && (
                <Link className="btn btn-ghost-light" href={`/imprints/${imp.slug}`}>
                  {imp.name}
                </Link>
              )}
              <DownloadsChip className="btn btn-ghost-light" />
            </div>
          </div>
        </div>
      </section>

      <section className="sec wrap" style={{ paddingTop: 48 }}>
        {story && <p className="album-story">{story}</p>}
        <TrackList rows={rows} showCover={false} showAlbum={false} />
      </section>

      {more.length > 0 && (
        <section className="sec wrap" style={{ paddingTop: 0 }}>
          <div className="group-title" style={{ marginTop: 0 }}>
            <h2 className="display">More from {fromArtist.length ? artist!.name : imp?.name}</h2>
            {artist && (
              <Link className="mono" href={`/artists/${artist.slug}`}>
                Artist page →
              </Link>
            )}
          </div>
          <div className="rel-grid">
            {more.map((x) => (
              <ReleaseCard key={x.slug} album={x} c={c} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
