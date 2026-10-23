import type { Metadata } from "next";
import Link from "next/link";
import { DrumrollForm } from "@/components/forms";
import { GooglePlayQR, PageHead } from "@/components/sections";
import { GOOGLE_PLAY_URL, RADIO_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "GoSquare — the free music app",
  description: "GoSquare, the free music app from SQUAREDRUM, is out now on Android, with iPhone coming soon: every album, live radio channels, Canvas and lyrics. No ads, no subscription.",
  openGraph: { images: ["/gosquare/player-800.jpg"] },
};

// gosquare.app forwards here. Android is live on Google Play; iPhone is still to come. The App Store's
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
        eyebrow="GoSquare · Out now on Android"
        title={
          <>
            Take the house
            <br />
            with you.
          </>
        }
        lede="GoSquare is the free music app from SQUAREDRUM, out now on Google Play for Android. iPhone is coming soon; until then, everything is playing here on squaredrum.com."
        collage={SHOTS.map(([n]) => `/gosquare/${n}-800.jpg`)}
      >
        <div className="phead-meta">
          <a className="btn btn-gold" href={GOOGLE_PLAY_URL} target="_blank" rel="noopener">
            ↓ Get it on Google Play
          </a>
          <Link className="btn btn-ink" href="/releases">
            ▶ Listen now on squaredrum.com
          </Link>
        </div>
        <div className="phead-meta">
          <GooglePlayQR />
        </div>
      </PageHead>

      <section className="sec wrap">
        <div className="sec-head">
          <div>
            <div className="eyebrow mono">Inside the app</div>
            <h2 className="display">Built for listening.</h2>
          </div>
          <p>Screens from GoSquare on Android. The iPhone version looks the same.</p>
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
        <div className="drumroll-band radio-after">
          <div>
            <div className="eyebrow mono">iPhone next</div>
            <h2 className="display">Hear the day it reaches iPhone.</h2>
            <p className="lede">
              Join Drumroll, our Friday email. We&rsquo;ll tell you the moment GoSquare is in the App Store, along with every Friday&rsquo;s new music.
            </p>
            <a className="radio-live" href={RADIO_URL} target="_blank" rel="noopener">
              <span className="rl-badge mono">
                <span className="live-dot" />
                Live
              </span>
              <span className="rl-text">
                <b>Musicsquare Radio</b>
                <span className="mono">On air now · tune in</span>
              </span>
              <span className="rl-go" aria-hidden="true">
                ▶
              </span>
            </a>
          </div>
          <div className="db-form">
            <DrumrollForm source="app" tone="light" />
          </div>
        </div>
      </section>
    </main>
  );
}
