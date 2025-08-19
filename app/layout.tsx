import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AudioProvider } from "@/components/audio-context"
import { RadioProvider } from "@/components/radio-context"
import RadioPlayer from "@/components/radio-player"
import { GlobalMusicProvider } from "@/components/global-music-player"
import { DownloadProvider } from "@/contexts/download-context"
import { cinzel } from "./fonts"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "SQUAREDRUM Records | The Future of Music",
    template: "%s | SQUAREDRUM Records",
  },
  description:
    "Discover the future of music with AI-generated tracks across multiple genres. SQUAREDRUM is pioneering the next generation of music creation through artificial intelligence.",
  keywords:
    "AI music, artificial intelligence, record label, music production, AI artists, electronic music, pop music, R&B, country music, afrobeat",
  authors: [{ name: "SQUAREDRUM" }],
  creator: "SQUAREDRUM",
  publisher: "SQUAREDRUM",
  robots: "index, follow",
  metadataBase: new URL("https://squaredrum.com"),
  openGraph: {
    title: "SQUAREDRUM Records | The Future of Music",
    description: "Discover the future of music with AI-generated tracks across multiple genres.",
    url: "https://squaredrum.com",
    siteName: "SQUAREDRUM Records",
    images: [
      {
        url: "/squaredrum-logo.png",
        width: 1200,
        height: 630,
        alt: "SQUAREDRUM Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SQUAREDRUM Records | The Future of Music",
    description: "Discover the future of music with AI-generated tracks across multiple genres.",
    images: ["/squaredrum-logo.png"],
  },
  generator: "v0.dev",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f59e0b" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${cinzel.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <GlobalMusicProvider>
            <AudioProvider>
              <RadioProvider>
                <DownloadProvider>
                  {children}
                  <RadioPlayer />
                </DownloadProvider>
              </RadioProvider>
            </AudioProvider>
          </GlobalMusicProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
