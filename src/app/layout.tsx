import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Sans, Michroma, Oswald, Space_Mono } from "next/font/google";
import { AccountProvider } from "@/components/account";
import { PlayerProvider } from "@/components/player";
import { MixerDebug } from "@/components/mixer-debug";
import { NavTracker } from "@/components/back-link";
import { PlayerBar } from "@/components/player-bar";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { getCatalog, songsLabel } from "@/lib/catalog";
import { SITE_URL } from "@/lib/config";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const michroma = Michroma({ weight: "400", subsets: ["latin"], variable: "--font-michroma" });
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument" });
// A lighter condensed face for the artists page card names; Anton only comes in one weight.
const oswald = Oswald({ weight: "500", subsets: ["latin"], variable: "--font-oswald" });

// The song count comes from the catalogue, so the description keeps up with the stats on the page.
export async function generateMetadata(): Promise<Metadata> {
  const description = `SQUAREDRUM Records — AI creativity, human craft. Eighteen imprints, ${songsLabel(await getCatalog())} songs, live around the clock on Musicsquare Radio and in the GoSquare app.`;
  return {
    // Fixed rather than derived from Vercel's URL, which broke previews on the radio site.
    metadataBase: new URL(SITE_URL),
    title: { default: "SQUAREDRUM — Music Without Borders", template: "%s · SQUAREDRUM" },
    description,
    openGraph: { title: "SQUAREDRUM — Music Without Borders", description, siteName: "SQUAREDRUM", type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = { themeColor: "#0B0B0C" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${michroma.variable} ${spaceMono.variable} ${instrument.variable} ${oswald.variable}`}>
      <body>
        <a className="skip mono" href="#main">
          Skip to content
        </a>
        <PlayerProvider>
          <AccountProvider>
          <SiteNav />
          <div id="main">{children}</div>
          <SiteFooter />
          <PlayerBar />
          <MixerDebug />
          <NavTracker />
          </AccountProvider>
        </PlayerProvider>
      </body>
    </html>
  );
}
