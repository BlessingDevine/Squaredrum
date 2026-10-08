import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Sans, Michroma, Space_Mono } from "next/font/google";
import { PlayerProvider } from "@/components/player";
import { PlayerBar } from "@/components/player-bar";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SITE_URL } from "@/lib/config";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const michroma = Michroma({ weight: "400", subsets: ["latin"], variable: "--font-michroma" });
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument" });

const description =
  "SQUAREDRUM Records — AI creativity, human craft. Seventeen imprints, 2,600+ songs, live around the clock on Musicsquare Radio and in the GoSquare app.";

export const metadata: Metadata = {
  // Fixed rather than derived from Vercel's URL, which broke previews on the radio site.
  metadataBase: new URL(SITE_URL),
  title: { default: "SQUAREDRUM — Music Without Borders", template: "%s · SQUAREDRUM" },
  description,
  openGraph: { title: "SQUAREDRUM — Music Without Borders", description, siteName: "SQUAREDRUM", type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0B0B0C" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${michroma.variable} ${spaceMono.variable} ${instrument.variable}`}>
      <body>
        <a className="skip mono" href="#main">
          Skip to content
        </a>
        <PlayerProvider>
          <SiteNav />
          <div id="main">{children}</div>
          <SiteFooter />
          <PlayerBar />
        </PlayerProvider>
      </body>
    </html>
  );
}
