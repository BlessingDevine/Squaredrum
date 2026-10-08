import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PlayButton, TrackList } from "@/components/play";
import { ReleaseCard } from "@/components/sections";
import { getCatalog, sized } from "@/lib/catalog";
import { img } from "@/lib/img";
import { toRow } from "@/lib/rows";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/artists/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = (await getCatalog()).artistBySlug.get(slug);
  if (!a) return {};
  return {
    title: a.name,
    description: `${a.name}${a.imprintName ? ` · ${a.imprintName}` : ""} — ${a.songCount} songs on Squaredrum.`,
    openGraph: { images: a.portrait ? [img(a.portrait, 1080)] : [] },
  };
}

export default async function ArtistPage({ params }: PageProps<"/artists/[slug]">) {
  const { slug } = await params;
  const c = await getCatalog();
  const a = c.artistBySlug.get(slug);
  // Old links to artists who aren't in the catalogue go to the roster.
  if (!a) redirect("/artists");

  const albums = a.albumSlugs.map((s) => c.albumBySlug.get(s)!).filter(Boolean);
  const all = albums.flatMap((al) => al.songIds.map((id) => toRow(c.songById.get(id)!, c)));
  if (!all.length) notFound();
  const firstCover = albums.find((al) => al.cover)?.cover ?? null;
  const photo = a.portrait ? img(a.portrait, 828) : sized(firstCover, 600);
  const imp = a.imprintSlug ? c.imprintBySlug.get(a.imprintSlug) : undefined;

  return (
    <main>
      <header className="ahead">
        <div className="ahead-dark" />
        <div className="ahead-in wrap">
          <div className="ahead-copy">
            <nav className="crumbs mono" aria-label="Breadcrumb">
              <Link href="/artists">Artists</Link> /
            </nav>
            <div className="eyebrow mono imp-line">{[imp?.name, a.genre].filter(Boolean).join(" · ")}</div>
            <h1 className="display">{a.name}</h1>
            <div className="phead-meta">
              <PlayButton items={all} label="Play all" />
              <span className="chip">
                {a.songCount} songs · {albums.length} {albums.length === 1 ? "release" : "releases"}
              </span>
              {imp && (
                <Link className="chip" href={`/imprints/${imp.slug}`}>
                  {imp.name} →
                </Link>
              )}
            </div>
          </div>
          {photo && (
            <div className="split-photo">
              <img src={photo} alt={a.name} />
              <img src={photo} alt="" />
            </div>
          )}
        </div>
      </header>

      <section className="sec wrap">
        <div className="group-title" style={{ marginTop: 0 }}>
          <h2 className="display">Popular</h2>
          <span className="mono">Tap a song to play</span>
        </div>
        <TrackList rows={all.slice(0, 10)} />
      </section>

      <section className="sec wrap dark">
        <div className="group-title" style={{ marginTop: 0 }}>
          <h2 className="display">Discography</h2>
          <span className="mono">{albums.length} {albums.length === 1 ? "release" : "releases"}</span>
        </div>
        <div className="grid-albums">
          {albums.map((al) => (
            <ReleaseCard key={al.slug} album={al} c={c} />
          ))}
        </div>
      </section>
    </main>
  );
}
