import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, SectionHead, ServiceCards, Stats } from "@/components/sections";
import { getCatalog } from "@/lib/catalog";
import { CONTACT_EMAIL } from "@/lib/config";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Work with us",
  description: "Work with Squaredrum's AI artists and influencers to promote, hype, educate and entertain — always openly AI.",
};

const STEPS = [
  ["Tell us the goal", "Who you want to reach, and what you want them to feel, learn or do."],
  ["We match the artist", "From eighteen imprints and every genre, we pick the voice and persona that fits your audience."],
  ["Create and launch", "Songs, videos, posts and live moments, made by our team — and always labelled as AI."],
];

export default async function WorkWithUs() {
  const c = await getCatalog();
  return (
    <main>
      <PageHead
        eyebrow="Work with us"
        title={
          <>
            Let&apos;s make
            <br />
            noise together.
          </>
        }
        lede="Our artists are AI personas with their own voices, looks and fans — and they're open about it. Bring them into your brand to promote, hype, educate or entertain."
      >
        <Link className="btn btn-ink" href="/contact?topic=Brand%20campaign">
          Start a collaboration →
        </Link>
        <a className="chip" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      </PageHead>

      <section className="sec wrap dark">
        <Stats c={c} />
        <ServiceCards />
      </section>

      <section className="sec wrap story">
        <SectionHead eyebrow="How it works" title="Three steps." />
        <div className="steps" style={{ marginTop: 0 }}>
          {STEPS.map(([t, d], i) => (
            <div className="step" key={t}>
              <span className="mono">0{i + 1}</span>
              <b>{t}</b>
              <p>{d}</p>
            </div>
          ))}
        </div>
        <div className="story-top" style={{ marginTop: 64 }}>
          <div>
            <div className="eyebrow mono">Always honest</div>
            <h2>
              Openly <em>AI</em>.
            </h2>
          </div>
          <p>
            Every Squaredrum artist is an AI persona, shaped and run by real people — producers, writers and a creative team. We say so
            everywhere they appear, and every collaboration is clearly labelled, so your audience always knows who they&apos;re hearing from.
          </p>
        </div>
        <p style={{ marginTop: 48 }}>
          <Link className="btn btn-ink" href="/contact?topic=Brand%20campaign">
            Tell us about your project →
          </Link>
        </p>
      </section>
    </main>
  );
}
