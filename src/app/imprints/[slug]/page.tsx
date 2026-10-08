import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayButton, TrackList } from "@/components/play";
import { ArtistCard } from "@/components/roster-row";
import { PageHead, ReleaseCard, rosterCard } from "@/components/sections";
import { getCatalog, sized } from "@/lib/catalog";
import { RADIO_URL } from "@/lib/config";
import { toRow } from "@/lib/rows";
import { IMPRINTS } from "@/lib/site";

export const revalidate = 300;

export function generateStaticParams() {
  return IMPRINTS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/imprints/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const imp = (await getCatalog()).imprintBySlug.get(slug);
  if (!imp) return {};
  return { title: imp.name, description: `${imp.name} — ${imp.genre}. ${imp.blurb}`, openGraph: { images: imp.cover ? [sized(imp.cover, 600)!] : [] } };
}

export default async function ImprintPage({ params }: PageProps<"/imprints/[slug]">) {
  const { slug } = await params;
  const c = await getCatalog();
  const imp = c.imprintBySlug.get(slug);
  if (!imp) notFound();

  const artists = imp.artistSlugs.flatMap((s) => {
    const a = c.artistBySlug.get(s);
    return a ? (rosterCard(a, c) ?? []) : [];
  });
  const albums = imp.albumSlugs.map((s) => c.albumBySlug.get(s)!).filter(Boolean);
  const songs = c.songs.filter((s) => s.imprintSlug === imp.slug);
  const rows = songs.slice(0, 12).map((s) => toRow(s, c));
  const all = songs.map((s) => toRow(s, c));

  return (
    <main>
      <PageHead eyebrow={imp.genre} title={imp.name} lede={imp.blurb} art={sized(imp.cover, 600)} crumbs={[{ href: "/imprints", label: "Imprints" }]}>
        {songs.length > 0 ? (
          <>
            <PlayButton items={all} label="Play imprint" className="btn btn-ink" />
            <span className="chip">{songs.length} songs</span>
            {imp.channelSlug && (
              <a className="chip" href={`${RADIO_URL}/channels`} target="_blank" rel="noopener">
                <span className="live-dot" />
                Live channel ↗
              </a>
            )}
          </>
        ) : (
          <span className="chip">Music coming soon</span>
        )}
      </PageHead>

      {artists.length > 0 && (
        <section className="sec wrap light-artists">
          <div className="group-title" style={{ marginTop: 0 }}>
            <h2 className="display">Artists</h2>
            <span className="mono">{artists.length}</span>
          </div>
          <div className="grid-artists">
            {artists.map((a) => (
              <ArtistCard key={a.slug} a={a} />
            ))}
          </div>
        </section>
      )}

      {albums.length > 0 && (
        <section className="sec wrap dark">
          <div className="group-title" style={{ marginTop: 0 }}>
            <h2 className="display">Releases</h2>
            <Link className="mono" href={`/releases?imprint=${imp.slug}`}>
              All {imp.name} releases →
            </Link>
          </div>
          <div className="grid-albums">
            {albums.map((al) => (
              <ReleaseCard key={al.slug} album={al} c={c} />
            ))}
          </div>
        </section>
      )}

      {rows.length > 0 && (
        <section className="sec wrap">
          <div className="group-title" style={{ marginTop: 0 }}>
            <h2 className="display">Listen</h2>
            <span className="mono">A selection from the catalogue</span>
          </div>
          <TrackList rows={rows} />
        </section>
      )}

      {songs.length === 0 && (
        <section className="sec wrap">
          <p className="empty">
            {imp.name} is warming up. Its first releases are on the way — <Link href="/contact">get in touch</Link> or join the newsletter below to hear first.
          </p>
        </section>
      )}
    </main>
  );
}
