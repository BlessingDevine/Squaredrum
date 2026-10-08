import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, SectionHead, ServiceCards, Stats } from "@/components/sections";
import { getCatalog } from "@/lib/catalog";
import { CONTACT_EMAIL } from "@/lib/config";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Work with us",
  description: "License Squaredrum music for film, TV, ads, games and creators, or partner with the label on custom sound.",
};

const STEPS = [
  ["Tell us the project", "What it is, where it runs, how long, and the mood or references you have in mind."],
  ["We send options", "Hand-picked tracks from across the catalogue, or a custom piece from one of our imprints."],
  ["Clear it in one go", "Every song is owned by Squaredrum — one licence, one invoice, no chasing rights holders."],
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
        lede="From a brand campaign to a film scene to a store playlist — the whole Squaredrum catalogue is ready to license."
      >
        <Link className="btn btn-ink" href="/contact?topic=Licensing%20%26%20sync">
          Start a licence →
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
        <SectionHead eyebrow="How licensing works" title="Three steps." />
        <div className="steps" style={{ marginTop: 0 }}>
          {STEPS.map(([t, d], i) => (
            <div className="step" key={t}>
              <span className="mono">0{i + 1}</span>
              <b>{t}</b>
              <p>{d}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 48 }}>
          <Link className="btn btn-ink" href="/contact?topic=Licensing%20%26%20sync">
            Tell us about your project →
          </Link>
        </p>
      </section>
    </main>
  );
}
