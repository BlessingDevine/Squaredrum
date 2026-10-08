import type { Metadata } from "next";
import { Ecosystem, PageHead, Stats, Story } from "@/components/sections";
import { getCatalog } from "@/lib/catalog";

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

      <Story id="process" />

      <section className="sec wrap dark">
        <Stats c={c} />
      </section>

      <Ecosystem channelNames={c.channels.map((ch) => ch.name)} />
    </main>
  );
}
