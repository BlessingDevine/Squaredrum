import type { Metadata } from "next";
import Link from "next/link";
import { Ecosystem, PageHead, Stats, Story } from "@/components/sections";
import { getCatalog } from "@/lib/catalog";
import { RADIO_URL } from "@/lib/config";

export const revalidate = 300;
export const metadata: Metadata = { title: "About", description: "Squaredrum pioneers music made by AI creativity and refined by human craftsmanship." };

const CRAFT = [
  ["Professional mixing", "Expert engineers balance every element with precision EQ, compression and spatial imaging."],
  ["Mastering excellence", "Final polish by mastering specialists, for broadcast-ready, commercially competitive sound."],
  ["Sound design", "Creative sound designers craft unique textures, atmospheres and sonic signatures."],
  ["Quality supervision", "Experienced producers oversee every release with discerning ears and refined musical taste."],
];

export default async function About() {
  const c = await getCatalog();
  return (
    <main>
      <PageHead
        eyebrow="About us"
        title={
          <>
            AI creativity.
            <br />
            Human craft.
          </>
        }
        lede="SQUAREDRUM pioneers the future of music through the collaboration between AI creativity and human expertise."
        art="/roster/riven-cole.jpg"
        portrait
      />

      <section className="sec wrap">
        <div className="story-top">
          <div className="prose">
            <p>
              Our journey began when our founder recognised the potential that emerges when cutting-edge AI is combined with human expertise in
              music production. AI generates compositions, melodies and vocal performances; our mix engineers, mastering specialists and sound
              designers bring the critical human touch — the refined ear for detail, the feel for sonic balance and the artistic judgement that
              turns good music into great music.
            </p>
            <p>
              Today SQUAREDRUM is home to {c.artists.length} artists across {c.imprints.length} imprints — from Afrobeats to country, pop to R&amp;B,
              rock to healing music. Each artist has their own personality, voice and style. Behind every release stands a team of people who mix,
              master, design and supervise until every track meets the highest standard.
            </p>
            <p>This is the SQUAREDRUM difference — where technology and tradition unite to make music that moves, inspires and connects.</p>
          </div>
        </div>
        <div className="steps">
          {CRAFT.slice(0, 3).map(([t, d], i) => (
            <div className="step" key={t}>
              <span className="mono">0{i + 1}</span>
              <b>{t}</b>
              <p>{d}</p>
            </div>
          ))}
        </div>
        <div className="steps" style={{ marginTop: 0, gridTemplateColumns: "1fr" }}>
          <div className="step">
            <span className="mono">04</span>
            <b>{CRAFT[3][0]}</b>
            <p>{CRAFT[3][1]}</p>
          </div>
        </div>
      </section>

      <section className="sec wrap dark" id="three">
        <div className="sec-head">
          <div>
            <div className="eyebrow mono">How it fits together</div>
            <h2 className="display">
              One house.
              <br />
              Three ways in.
            </h2>
          </div>
          <p>All three run on the same catalogue, so a new album shows up everywhere at once — and all of it is free.</p>
        </div>
        <div className="cards three">
          <Link className="card" href="/artists">
            <div>
              <span className="mono gold">Squaredrum · The label</span>
              <br />
              <br />
              <b>Makes the music</b>
              <p>
                Home to {c.imprints.length} labels and {c.artists.length} artists, from Afrobeats and Amapiano to R&amp;B, rock, country and healing
                music. Our artists are AI-powered virtual performers, created and shaped by a human creative team. This site is where you meet them —
                artist pages, albums, photos, videos, and ways for brands to work with them.
              </p>
            </div>
            <div className="go mono">
              Meet the artists <i>→</i>
            </div>
          </Link>
          <a className="card" href={RADIO_URL} target="_blank" rel="noopener">
            <div>
              <span className="mono gold">Musicsquare Radio · Free</span>
              <br />
              <br />
              <b>Plays it live</b>
              <p>
                {c.channels.length} channels, one per genre, playing 24/7. It&rsquo;s real radio: everyone tuned in to a channel hears the same song
                at the same moment. Pick a vibe and press play — no sign-up, no cost.
              </p>
            </div>
            <div className="go mono">
              Tune in <i>↗</i>
            </div>
          </a>
          <Link className="card" href="/contact?topic=GoSquare%20waitlist">
            <div>
              <span className="mono gold">GoSquare · Free · Coming soon</span>
              <br />
              <br />
              <b>Lets you play it your way</b>
              <p>
                The whole catalogue in your pocket, for iPhone and Android. Play any album or song when you want it, search everything, tune in to
                the live channels, and watch Canvases, clips and lyrics as the music plays.
              </p>
            </div>
            <div className="go mono">
              Join the waitlist <i>→</i>
            </div>
          </Link>
        </div>
        <p className="three-line">
          Squaredrum makes the music. Musicsquare Radio plays it live. GoSquare lets you play it your way. <span className="gold">All of it is free.</span>{" "}
          Accounts are coming: one account across all three, and signing up unlocks free downloads.
        </p>
      </section>

      <Story id="process" />

      <section className="sec wrap dark">
        <Stats c={c} />
      </section>

      <Ecosystem channelNames={c.channels.map((ch) => ch.name)} />
    </main>
  );
}
