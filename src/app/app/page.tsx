import type { Metadata } from "next";
import { DrumrollForm } from "@/components/forms";
import { AppStoreQR, GooglePlayQR, PageHead } from "@/components/sections";

export const metadata: Metadata = {
  title: "GoSquare — the free music app",
  description: "GoSquare, the free music app from SQUAREDRUM, is out now on iPhone and Android: every album, live radio channels, Canvas and lyrics. No ads, no subscription.",
  openGraph: { images: ["/gosquare/player-800.jpg"] },
};

// gosquare.app forwards here. Live on the App Store (since Nov 19, 2026) and Google Play. The App Store's
// Support URL is /gosquare (a different page); leave that one where it is.
const SHOTS = [
  ["player", "Now playing, with the song's Canvas moving behind it"],
  ["home", "Home: new releases, recently played and live channels"],
  ["album", "An album page"],
  ["radio", "Live radio channels"],
] as const;

const FEATURES = [
  ["Every album, free", "Over 3,200 songs from our independent labels. Play anything, any time. No ads, no subscription."],
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
        eyebrow="GoSquare · Out now on iPhone and Android"
        title={
          <>
            Take the house
            <br />
            with you.
          </>
        }
        lede="GoSquare is the free music app from SQUAREDRUM, out now on the App Store for iPhone and on Google Play for Android. Everything is playing here on squaredrum.com too."
        collage={SHOTS.map(([n]) => `/gosquare/${n}-800.jpg`)}
      >
        {/* The QR cards are the store links: tap one on a phone, scan it from a computer. */}
        <div className="phead-meta">
          <AppStoreQR />
          <GooglePlayQR />
        </div>
      </PageHead>

      <section className="sec wrap">
        <div className="sec-head">
          <div>
            <div className="eyebrow mono">Inside the app</div>
            <h2 className="display">Built for listening.</h2>
          </div>
          <p>Screens from GoSquare. It looks the same on iPhone and Android.</p>
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
            <div className="eyebrow mono">Every Friday</div>
            <h2 className="display">Hear it first on Friday.</h2>
            <p className="lede">
              Join Drumroll, our Friday email: every week&rsquo;s new albums, the artist spotlight and what&rsquo;s happening around Squaredrum.
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
