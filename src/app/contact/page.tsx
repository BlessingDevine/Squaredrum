import type { Metadata } from "next";
import { ContactForm } from "@/components/forms";
import { PageHead } from "@/components/sections";
import { CONTACT_EMAIL, CONTACT_PHONE, RADIO_URL, SOCIAL } from "@/lib/config";
import { TOPICS } from "@/lib/site";

export const metadata: Metadata = { title: "Contact", description: "Get in touch with SQUAREDRUM Records — artist collaborations, press and everything else." };

export default async function Contact({ searchParams }: PageProps<"/contact">) {
  const { topic } = await searchParams;
  const preset = typeof topic === "string" && TOPICS.includes(topic) ? topic : undefined;
  return (
    <main>
      <PageHead eyebrow="Contact" title="Say hello." lede="Collaborations with our artists, press or just a question — send a message and the team will get back to you." />
      <section className="sec wrap">
        <div className="contact-grid">
          <div>
            <div className="contact-card">
              <span className="mono">Email</span>
              <b>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </b>
            </div>
            <div className="contact-card">
              <span className="mono">Phone</span>
              <b>
                <a href={`tel:${CONTACT_PHONE.replace(/[^+\d]/g, "")}`}>{CONTACT_PHONE}</a>
              </b>
            </div>
            <div className="contact-card">
              <span className="mono">Listen</span>
              <b>
                <a href={RADIO_URL}>Musicsquare Radio ↗</a>
              </b>
            </div>
            <div className="contact-card">
              <span className="mono">Follow</span>
              <b style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                <a href={SOCIAL.instagram}>Instagram</a>
                <a href={SOCIAL.youtube}>YouTube</a>
                <a href={SOCIAL.x}>X</a>
              </b>
            </div>
          </div>
          <ContactForm topic={preset} />
        </div>
      </section>
    </main>
  );
}
