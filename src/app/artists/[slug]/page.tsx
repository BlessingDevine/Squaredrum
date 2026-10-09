import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { PlayButton, TrackList } from "@/components/play";
import { ReleaseCard } from "@/components/sections";
import { type ArtistMedia, getArtistMedia } from "@/lib/artist-media";
import { type Album, type Artist, type Catalog, getCatalog, sized } from "@/lib/catalog";
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
  const media = await getArtistMedia(slug, all);
  if (media) return <MiniSite a={a} c={c} media={media} albums={albums} all={all} />;

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

type MiniProps = { a: Artist; c: Catalog; media: ArtistMedia; albums: Album[]; all: ReturnType<typeof toRow>[] };

const VIDEO_KIND: Record<string, string> = { music_video: "Music video", lyric_video: "Lyric video", clip: "Clip" };

/**
 * The artist's own home: a full-screen opener from their "hero" photos, then
 * music, videos, the photo wall and their story. Used once an artist has a
 * photo set on the CDN (scripts/catalog/photos.mjs in the radio repo).
 */
function MiniSite({ a, c, media, albums, all }: MiniProps) {
  const imp = a.imprintSlug ? c.imprintBySlug.get(a.imprintSlug) : undefined;
  const heroes = media.photos.filter((p) => p.role === "hero");
  const tall = heroes.find((p) => p.shape === "tall") ?? heroes[0] ?? media.photos[0];
  const wide = heroes.find((p) => p.shape === "wide") ?? tall;
  const gallery = media.photos.filter((p) => p.role === "gallery");
  const latest = albums[0];
  const about = media.bio?.split(/\n\s*\n/).filter(Boolean) ?? [];
  const sections: [string, string][] = [
    ["music", "Music"],
    ...(media.videos.length ? [["videos", "Videos"] as [string, string]] : []),
    ...(gallery.length ? [["gallery", "Gallery"] as [string, string]] : []),
    ["about", "About"],
    ["releases", "Releases"],
  ];

  return (
    <main className="mini">
      <header className="mini-hero">
        <picture>
          <source media="(min-width:761px)" srcSet={wide.srcSet} sizes="100vw" />
          <img src={tall.src} srcSet={tall.srcSet} sizes="100vw" alt={a.name} fetchPriority="high" />
        </picture>
        <div className="mini-hero-copy wrap">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/artists">Artists</Link> /
          </nav>
          <div className="eyebrow mono">{[imp?.name, a.genre].filter(Boolean).join(" · ")}</div>
          <h1 className="display">{a.name}</h1>
          <div className="phead-meta">
            <PlayButton items={all} label="Play all" />
            <span className="chip" title={`${a.name} is an AI artist, a virtual persona created at Squaredrum`}>
              AI artist
            </span>
            <span className="chip">
              {a.songCount} songs · {albums.length} {albums.length === 1 ? "release" : "releases"}
            </span>
          </div>
        </div>
      </header>

      <nav className="mini-nav mono" aria-label={`${a.name} sections`}>
        <div className="wrap">
          {sections.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </div>
      </nav>

      <section id="music" className="sec wrap mini-music">
        {latest && (
          <Link href={`/releases/${latest.slug}`} className="mini-latest">
            {latest.cover && <img src={sized(latest.cover, 600)!} alt="" />}
            <span className="mono">Latest release</span>
            <strong className="display">{latest.title}</strong>
            <span className="mono">{latest.songIds.length} songs →</span>
          </Link>
        )}
        <div>
          <div className="group-title" style={{ marginTop: 0 }}>
            <h2 className="display">Popular</h2>
            <span className="mono">Tap a song to play</span>
          </div>
          <TrackList rows={all.slice(0, 10)} />
        </div>
      </section>

      {media.videos.length > 0 && (
        <section id="videos" className="sec wrap dark">
          <div className="group-title" style={{ marginTop: 0 }}>
            <h2 className="display">Videos</h2>
            <span className="mono">{media.videos.length}</span>
          </div>
          <div className="mini-videos">
            {media.videos.map((v) => (
              <figure key={v.src}>
                <video src={v.src} poster={v.poster ?? undefined} controls playsInline preload="none" width={v.width} height={v.height} />
                <figcaption className="mono">
                  {v.title} · {VIDEO_KIND[v.kind] ?? "Video"}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section id="gallery" className="sec wrap">
          <div className="group-title" style={{ marginTop: 0 }}>
            <h2 className="display">Gallery</h2>
            <span className="mono">{gallery.length} photos</span>
          </div>
          <Gallery photos={gallery} name={a.name} />
        </section>
      )}

      <section id="about" className="sec wrap dark mini-about">
        <div className="eyebrow mono">About</div>
        <h2 className="display">{a.name}</h2>
        <div className="mini-about-text">
          {about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className="mini-ai">
            {a.name} is an AI artist: a virtual persona created at Squaredrum{imp ? ` and released on ${imp.name}` : ""}. The voice, images and
            music are made with AI tools and shaped by our team.
          </p>
          {imp && (
            <Link className="chip" href={`/imprints/${imp.slug}`}>
              More from {imp.name} →
            </Link>
          )}
        </div>
        {(media.glance.length > 0 || media.presskit) && (
          <aside className="mini-glance">
            {media.glance.length > 0 && (
              <>
                <div className="mono gold">At a glance</div>
                <dl>
                  {media.glance.map(([k, v]) => (
                    <div key={k}>
                      <dt className="mono">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
            {media.presskit && (
              <a className="btn btn-gold" href={media.presskit.url} download>
                ↓ Download press kit <span className="mono">PDF · {Math.max(1, Math.round(media.presskit.bytes / 1e5) / 10)} MB</span>
              </a>
            )}
          </aside>
        )}
      </section>

      <section id="releases" className="sec wrap">
        <div className="group-title" style={{ marginTop: 0 }}>
          <h2 className="display">Releases</h2>
          <span className="mono">{albums.length}</span>
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
