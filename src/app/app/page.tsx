import type { Metadata } from "next";
import Link from "next/link";
import { DrumrollForm } from "@/components/forms";
import { PageHead } from "@/components/sections";
import { RADIO_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "GoSquare — coming soon",
  description: "GoSquare, the free music app from SQUAREDRUM, is coming to iPhone and Android: every album, live radio channels, Canvas and lyrics. No ads, no subscription.",
  openGraph: { images: ["/gosquare/player-800.jpg"] },
};

// gosquare.app forwards here until the app is in the stores. The App Store's
// Support URL is /gosquare (a different page); leave that one where it is.
const SHOTS = [
  ["player", "Now playing, with the song's Canvas moving behind it"],
  ["home", "Home: new releases, recently played and live channels"],
  ["album", "An album page"],
  ["radio", "Live radio channels"],
] as const;

const FEATURES = [
  ["Every album, free", "Over 3,000 songs from our independent labels. Play anything, any time. No ads, no subscription."],
  ["Live radio, all day", "Every Musicsquare Radio channel, from Amapiano to Country. Everyone hears the same song at the same moment."],
  ["Canvas and lyrics", "Songs play with a moving Canvas made for the music, and lyrics that scroll in time. Tap a line to jump to it."],
  ["Your library", "Like songs, follow artists, build playlists. Sign in with just your email, and your library follows you to squaredrum.com."],
  ["Free downloads", "Keep up to 20 songs a week on your phone, to play without a connection."],
  ["Keeps playing", "Lock your phone or switch apps and the music carries on, with controls on the lock screen."],
];

export default function AppPage() {
  return (
    <main>
      <PageHead
        eyebrow="GoSquare · Coming soon"
        title={
          <>
            Take the house
            <br />
            with you.
          </>
        }
        lede="GoSquare is the free music app from SQUAREDRUM, coming soon to iPhone and Android. Until then, everything is already playing here on squaredrum.com."
        collage={SHOTS.map(([n]) => `/gosquare/${n}-800.jpg`)}
      >
        <div className="phead-meta">
          <Link className="btn btn-gold" href="/releases">
            ▶ Listen now on squaredrum.com
          </Link>
        </div>
      </PageHead>

      <section className="sec wrap">
        <div className="sec-head">
          <div>
            <div className="eyebrow mono">Inside the app</div>
            <h2 className="display">Built for listening.</h2>
          </div>
          <p>Screens from GoSquare as it stands today, on a phone near you soon.</p>
        </div>
        <div className="app-shots">
          {SHOTS.map(([n, alt]) => (
            <figure key={n}>
              <img src={`/gosquare/${n}-400.jpg`} srcSet={`/gosquare/${n}-400.jpg 400w, /gosquare/${n}-800.jpg 800w`} sizes="(max-width:760px) 45vw, 22vw" alt={alt} width={400} height={800} loading="lazy" />
              <figcaption className="mono">{alt}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="sec wrap dark">
        <div className="app-features">
          {FEATURES.map(([t, d], i) => (
            <div key={t} className="step">
              <span className="mono">0{i + 1}</span>
              <b>{t}</b>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="sec wrap">
        <div className="drumroll-band">
          <div>
            <div className="eyebrow mono">Be first</div>
            <h2 className="display">Hear the day it lands.</h2>
            <p className="lede">
              Join Drumroll, our Friday email. We&rsquo;ll tell you the moment GoSquare is in the App Store and Google Play, along with every Friday&rsquo;s new music.
              Meanwhile, tune in to <a href={RADIO_URL} target="_blank" rel="noopener" style={{ textDecoration: "underline" }}>Musicsquare Radio</a>.
            </p>
          </div>
          <div>
            <DrumrollForm source="app" tone="light" />
          </div>
        </div>
      </section>
    </main>
  );
}
