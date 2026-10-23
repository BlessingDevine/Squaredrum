import Link from "next/link";
import { type Album, type Artist, type Catalog, type Imprint, sized, songsLabel } from "@/lib/catalog";
import { GOOGLE_PLAY_URL, RADIO_URL } from "@/lib/config";
import { img } from "@/lib/img";
import { ChannelChips } from "./channel-chips";
import { CountUp } from "./count-up";
import { LevelMeter } from "./level-meter";
import type { RosterCard } from "./roster-row";
import { TiltCover } from "./tilt";

/** The diagonal gold line — the logo's drumstick — used across the site. */
export function Stick({ from = [58, 0], to = [46, 100], className = "stick stick-d" }: { from?: [number, number]; to?: [number, number]; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} />
    </svg>
  );
}

export function SectionHead({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="sec-head">
      <div>
        <div className="eyebrow mono">{eyebrow}</div>
        <h2 className="display">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function ImprintTile({ imp, n }: { imp: Imprint; n: number }) {
  return (
    <Link className="imp" href={`/imprints/${imp.slug}`}>
      {imp.cover ? <img src={sized(imp.cover, 600)!} alt="" loading="lazy" /> : null}
      <span className="num">{String(n).padStart(2, "0")}</span>
      <div className="cap">
        <b>{imp.name}</b>
        <span>{imp.genre}</span>
      </div>
    </Link>
  );
}

export function ImprintGrid({ imprints, intro = true }: { imprints: Imprint[]; intro?: boolean }) {
  return (
    <div className="imp-grid">
      {intro && (
        <div className="imp-intro">
          <span className="mono gold">Squaredrum LLC</span>
          <b>Pick a sound.</b>
          <Link className="mono" href="/imprints">
            All imprints →
          </Link>
        </div>
      )}
      {imprints.map((imp, i) => (
        <ImprintTile key={imp.slug} imp={imp} n={i + 1} />
      ))}
    </div>
  );
}

export function ReleaseCard({ album, c }: { album: Album; c: Catalog }) {
  const imp = album.imprintSlug ? c.imprintBySlug.get(album.imprintSlug) : undefined;
  return (
    <Link className="rel" href={`/releases/${album.slug}`}>
      {album.cover ? (
        <TiltCover>
          <img src={sized(album.cover, 600)!} alt={album.title} loading="lazy" />
        </TiltCover>
      ) : (
        <span className="ph-empty">{album.title.slice(0, 1)}</span>
      )}
      <b>{album.title}</b>
      <span>{album.artist}</span>
      {imp && <span className="mono imp-name">{imp.name}</span>}
    </Link>
  );
}

/**
 * Several albums by one artist (or one compilation series) folded into a single
 * card: the newest cover on top, the next two stacked behind. It opens the
 * newest album, whose page lists the rest and links to the artist. `albums` are
 * newest first.
 */
export function ArtistStackCard({
  albums,
  c,
  showLabel = true,
  name,
}: {
  albums: Album[];
  c: Catalog;
  showLabel?: boolean;
  /** For a series with no single artist (Dance Square Vol 1 & 2): its name. */
  name?: string;
}) {
  const [top, ...rest] = albums;
  const imp = top.imprintSlug ? c.imprintBySlug.get(top.imprintSlug) : undefined;
  return (
    <Link className="rel rel-stack" href={`/releases/${top.slug}`}>
      <span className="stack">
        {rest
          .slice(0, 2)
          .reverse()
          .map((al) => (
            <img key={al.slug} className="behind" src={sized(al.cover, 300)!} alt="" loading="lazy" />
          ))}
        <img src={sized(top.cover, 600)!} alt={name ?? top.artist} loading="lazy" />
      </span>
      <b>{name ?? top.artist}</b>
      <span>{albums.length} albums</span>
      {showLabel && imp && <span className="mono imp-name">{imp.name}</span>}
    </Link>
  );
}

/** Portrait if we have one, else the artist's first album cover. */
/**
 * The cover that stands for an artist without a portrait. For a series (R&B Square) that's its
 * own first volume ("R&B Square I"), not a spin-off like "Love in Paris" that happens to sort first.
 */
export function leadCover(a: Artist, c: Catalog): string | null {
  const albums = a.albumSlugs.map((s) => c.albumBySlug.get(s)).filter((al) => al?.cover);
  const own = albums.filter((al) => al!.title.toLowerCase().startsWith(a.name.toLowerCase()));
  const pick = own.sort((x, y) => x!.title.localeCompare(y!.title, undefined, { numeric: true }))[0] ?? albums[0];
  return pick?.cover ?? null;
}

export function rosterCard(a: Artist, c: Catalog): RosterCard | null {
  const cover = leadCover(a, c);
  const image = a.portrait ? img(a.portrait, 640) : sized(cover ?? null, 600);
  if (!image) return null;
  return { slug: a.slug, name: a.name, line: a.genre ?? a.imprintName ?? "", image, isPortrait: !!a.portrait };
}

export function Ecosystem({ channelNames }: { channelNames: string[] }) {
  return (
    <section className="eco" id="gosquare">
      <div className="eco-a">
        <LevelMeter />
        <div>
          <img className="brand-logo" src="/brand/musicsquare-radio-logo.svg" alt="Musicsquare Radio" />
        </div>
        <div>
          <div className="eyebrow mono">24/7 · Live</div>
          <h3 className="display">
            Always
            <br />
            on air.
          </h3>
          <p style={{ marginTop: 18 }}>
            One channel per imprint, crossfaded and never-ending. Everyone hears the same song at the same moment — tune in from anywhere.
          </p>
        </div>
        <ChannelChips names={channelNames} />
        <div>
          <a className="btn btn-gold" href={RADIO_URL} target="_blank" rel="noopener">
            Tune in → musicsquareradio.com
          </a>
        </div>
      </div>
      <div className="eco-b">
        <div>
          <img className="gs-word" src="/brand/gosquare-wordmark.png" alt="GoSquare" style={{ filter: "invert(1) hue-rotate(180deg)" }} />
        </div>
        <div className="eco-copy">
          <div className="eyebrow mono">The app · Out now on Android</div>
          <h3 className="display">
            Take the
            <br />
            house
            <br />
            with you.
          </h3>
          <p style={{ marginTop: 18 }}>Every album, every artist, every live channel — plus lyrics, clips and your own playlists. On Google Play now, iPhone coming soon.</p>
        </div>
        <div className="eco-get">
          <Link className="btn btn-ink" href="/app">
            Get the app →
          </Link>
          <GooglePlayQR />
        </div>
        {/* The real app's screens, crossfading; the phone turns to face you as it scrolls into view. */}
        <div className="phone-3d" aria-hidden="true">
          <div className="phone">
            <div className="scr shots">
              {["player", "home", "album", "radio"].map((n) => (
                <img key={n} src={`/gosquare/${n}-400.jpg`} alt="" loading="lazy" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Scan with an Android phone, or tap, to open GoSquare Music on Google Play. */
export function GooglePlayQR() {
  return (
    <a className="get-qr" href={GOOGLE_PLAY_URL} target="_blank" rel="noopener" aria-label="GoSquare Music on Google Play (QR code)">
      <img src="/gosquare/google-play-qr.svg" alt="" width={84} height={84} />
      <span className="mono">
        Scan for
        <br />
        Google Play
      </span>
    </a>
  );
}

export function Story({ id = "story" }: { id?: string }) {
  return (
    <section className="sec wrap story" id={id}>
      <div className="story-top">
        <div>
          <div className="eyebrow mono">Our story</div>
          <h2 className="display">
            Sound that moves.
            <br />
            <em>Craft</em> that lasts.
          </h2>
        </div>
        <p>
          Squaredrum is where AI creativity meets human craftsmanship. Compositions are born from new technology — then shaped by producers,
          mix engineers and sound designers until they&apos;re ready for the world.
        </p>
      </div>
      <div className="steps">
        <div className="step">
          <span className="mono">01</span>
          <b>Create.</b>
          <p>AI-assisted composition gives every imprint an endless sketchbook of ideas, in any genre, in any language.</p>
        </div>
        <div className="step">
          <span className="mono">02</span>
          <b>Elevate.</b>
          <p>Human producers, mix engineers and mastering pros refine every track. Nothing ships until it sounds right.</p>
        </div>
        <div className="step">
          <span className="mono">03</span>
          <b>Break through.</b>
          <p>Releases go out across 18 imprints, live on Musicsquare Radio and in the GoSquare app — worldwide.</p>
        </div>
      </div>
    </section>
  );
}

export function Stats({ c }: { c: Catalog }) {
  return (
    <div className="stats">
      <div className="stat">
        <CountUp value={songsLabel(c)} />
        <span className="mono">Songs in the catalogue</span>
      </div>
      <div className="stat">
        <CountUp value={String(c.imprints.length)} />
        <span className="mono">Imprints</span>
      </div>
      <div className="stat">
        <CountUp value={String(c.voices.length)} />
        <span className="mono">Artists</span>
      </div>
      <div className="stat">
        <CountUp value={String(c.channels.length)} />
        <span className="mono">Live channels, 24/7</span>
      </div>
    </div>
  );
}

export const SERVICES = [
  {
    id: "promote",
    title: "Promote",
    text: "Brand campaigns starring our artists — your product in their posts, songs and videos, in front of their audiences.",
    cta: "Plan a campaign",
    topic: "Brand campaign",
  },
  {
    id: "hype",
    title: "Hype",
    text: "Launches and drops with a buzz: teasers, countdowns, custom songs and live moments built around your big day.",
    cta: "Build the hype",
    topic: "Launch & hype",
  },
  {
    id: "educate",
    title: "Educate",
    text: "Artists who make a message stick — product explainers, tutorials, and programmes for schools and nonprofits.",
    cta: "Teach with us",
    topic: "Education",
  },
  {
    id: "entertain",
    title: "Entertain",
    text: "Series, skits, live sessions and collabs — recurring content with characters your audience comes back for.",
    cta: "Make a show",
    topic: "Entertainment",
  },
];

export function ServiceCards() {
  return (
    <div className="cards">
      {SERVICES.map((s, i) => (
        <Link key={s.id} className="card" id={s.id} href={`/contact?topic=${encodeURIComponent(s.topic)}`}>
          <div>
            <span className="mono gold">0{i + 1}</span>
            <br />
            <br />
            <b>{s.title}</b>
            <p>{s.text}</p>
          </div>
          <div className="go mono">
            {s.cta} <i>→</i>
          </div>
        </Link>
      ))}
    </div>
  );
}

/** The inner-page header: white, cut by the same diagonal as the home hero. */
export function PageHead({
  eyebrow,
  title,
  lede,
  art,
  portrait = false,
  crumbs,
  collage,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  art?: string | null;
  portrait?: boolean;
  crumbs?: { href: string; label: string }[];
  /** Three (or five) pictures fanned out on the dark side when there's no single `art`; the last is in front. */
  collage?: string[];
  children?: React.ReactNode;
}) {
  return (
    <header className="phead">
      <div className="phead-dark" />
      <Stick from={[64, 0]} to={[54, 100]} />
      <Stick className="stick stick-m" from={[0, 72]} to={[100, 58]} />
      <Stick className="stick stick-flat" from={[0, 40]} to={[100, 10]} />
      <div className="phead-in wrap">
        <div>
          {crumbs && (
            <nav className="crumbs mono" aria-label="Breadcrumb">
              {crumbs.map((c) => (
                <span key={c.href}>
                  <Link href={c.href}>{c.label}</Link> /
                </span>
              ))}
            </nav>
          )}
          <div className="eyebrow mono">{eyebrow}</div>
          <h1 className="display">{title}</h1>
          {lede && <p className="lede">{lede}</p>}
          {children && <div className="phead-meta">{children}</div>}
        </div>
        {art ? (
          <img className={`phead-art${portrait ? " portrait" : ""}`} src={img(art, 828)} alt="" />
        ) : collage && collage.length >= 3 ? (
          <div className={`phead-collage${collage.length >= 5 ? " five" : ""}`} aria-hidden="true">
            {collage.slice(0, collage.length >= 5 ? 5 : 3).map((src) => (
              <img key={src} src={src} alt="" />
            ))}
          </div>
        ) : (
          <img className="phead-icon" src="/brand/squaredrum-icon-metallic.svg" alt="" aria-hidden="true" />
        )}
      </div>
    </header>
  );
}
