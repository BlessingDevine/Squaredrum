import Link from "next/link";
import { Hero, type Slide } from "@/components/hero";
import { OnAirDeck } from "@/components/on-air";
import { RosterRow } from "@/components/roster-row";
import { Ecosystem, ImprintGrid, ReleaseCard, SectionHead, ServiceCards, Stats, Story, rosterCard } from "@/components/sections";
import { getCatalog, getOnAirSnapshot } from "@/lib/catalog";
import { img } from "@/lib/img";
import { toRow } from "@/lib/rows";
import { seededShuffle } from "@/lib/seeded";
import { FEATURED_RELEASES, HERO_ALBUMS, IMPRINTS, dayKey } from "@/lib/site";

// Rebuilt every minute so "on air" is never far behind on first paint;
// the deck then keeps itself current in the browser.
export const revalidate = 60;

export default async function Home() {
  const [c, { at, channels: onAir }] = await Promise.all([getCatalog(), getOnAirSnapshot()]);

  const slides: Slide[] = seededShuffle(
    c.artists.filter((a) => a.portrait),
    `hero:${dayKey()}`,
  ).flatMap((a) => {
    const albums = a.albumSlugs.map((s) => c.albumBySlug.get(s)!).filter(Boolean);
    const al =
      albums.find((x) => x.title === HERO_ALBUMS[a.slug]) ??
      albums.find((x) => FEATURED_RELEASES.some(([t, s]) => t === x.title && s === a.slug)) ??
      [...albums].sort((x, y) => Number(!!y.cover) - Number(!!x.cover) || y.songIds.length - x.songIds.length)[0];
    if (!al) return [];
    return [
      {
        name: a.name,
        line: [a.imprintName, a.genre].filter(Boolean).join(" · "),
        portrait: img(a.portrait!, 1080),
        drop: `${al.title} — ${a.name}`,
        items: al.songIds.map((id) => toRow(c.songById.get(id)!, c)),
      },
    ];
  });

  const featured = FEATURED_RELEASES.flatMap(([title, artist]) => [...c.albumBySlug.values()].filter((x) => x.title === title && x.artistSlug === artist));
  const releases = [...featured, ...c.albums.filter((a) => a.cover && !featured.includes(a))].slice(0, 10);
  const roster = c.artists.flatMap((a) => rosterCard(a, c) ?? []).slice(0, 16);
  const ticker = [
    `Musicsquare Radio · ${c.channels.length} live channels`,
    `${(Math.floor(c.songs.length / 100) * 100).toLocaleString("en-US")}+ songs`,
    `${c.imprints.length} imprints`,
    "GoSquare app · coming soon",
    slides[0] ? `New drop: ${slides[0].drop}` : "New music every week",
    "Music without borders",
  ];

  return (
    <main>
      <Hero slides={slides} />

      <div className="ticker mono" aria-hidden="true">
        <div className="ticker-track">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      <section className="sec wrap" id="onair">
        <SectionHead eyebrow="On air now" title="Press play.">
          <p>What&apos;s playing on every Musicsquare Radio channel at this very moment. Pick a channel and join everyone listening.</p>
        </SectionHead>
        <OnAirDeck initial={onAir} at={at} imprintNames={Object.fromEntries(IMPRINTS.map((i) => [i.slug, i.name]))} />
      </section>

      <section className="sec dark roster-head" id="roster">
        <div className="wrap">
          <SectionHead
            eyebrow="The roster"
            title={
              <>
                Voices of
                <br />
                the house.
              </>
            }
          >
            <Link className="btn btn-ghost-light" href="/artists">
              All {c.artists.length} artists →
            </Link>
          </SectionHead>
        </div>
        <RosterRow artists={roster} />
      </section>

      <section className="sec wrap" id="releases">
        <SectionHead eyebrow="Discography" title="New releases.">
          <Link className="btn btn-ink" href="/releases">
            All releases →
          </Link>
        </SectionHead>
        <div className="rel-grid">
          {releases.map((al) => (
            <ReleaseCard key={al.slug} album={al} c={c} />
          ))}
        </div>
      </section>

      <section className="sec wrap imprints" id="imprints">
        <SectionHead
          eyebrow="The family"
          title={
            <>
              {c.imprints.length} imprints.
              <br />
              One house.
            </>
          }
        >
          <p>Every sound has a home. Each imprint is its own label — its own artists, its own identity, its own live channel on Musicsquare Radio.</p>
        </SectionHead>
        <ImprintGrid imprints={c.imprints} />
      </section>

      <Ecosystem channelNames={c.channels.map((ch) => ch.name)} />

      <Story />

      <section className="sec wrap dark" id="work">
        <Stats c={c} />
        <SectionHead
          eyebrow="Work with us"
          title={
            <>
              Let&apos;s make
              <br />
              noise together.
            </>
          }
        >
          <p>From a brand campaign to a film scene to a store playlist — the whole catalogue is ready to license.</p>
        </SectionHead>
        <ServiceCards />
      </section>
    </main>
  );
}
