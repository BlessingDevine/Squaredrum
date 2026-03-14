import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AudioProvider } from "@/components/audio-context"
import { RadioProvider } from "@/components/radio-context"
import RadioPlayer from "@/components/radio-player"
import { GlobalMusicProvider } from "@/components/global-music-player"
import { cinzel } from "./fonts"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "SQUAREDRUM Records | The World's First Fully AI-Driven Music Label",
    template: "%s | SQUAREDRUM Records"
  },
  description: "Welcome to the world's first fully AI-driven music label. Every track, every artist, every production is created entirely by artificial intelligence. No human involvement in the creative process. Just pure AI artistry for music lovers everywhere.",
  keywords: "AI music label, fully AI-generated music, AI artists, artificial intelligence music, autonomous AI music creation, AI-only record label, machine-generated music, AI composers, AI producers",
  authors: [{ name: "SQUAREDRUM" }],
  creator: "SQUAREDRUM",
  publisher: "SQUAREDRUM",
  robots: "index, follow",
  metadataBase: new URL('https://squaredrum.com'),
  openGraph: {
    title: "SQUAREDRUM Records | The World's First Fully AI-Driven Music Label",
    description: "100% AI-created music. No human involvement. Just exceptional music for those who love great sound, regardless of who—or what—created it.",
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
    title: "SQUAREDRUM Records | The World's First Fully AI-Driven Music Label",
    description: "100% AI-created music. No human involvement. Just exceptional music for those who love great sound.",
    images: ["/squaredrum-logo.png"],
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f59e0b' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
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
                {children}
                <RadioPlayer />
              </RadioProvider>
            </AudioProvider>
          </GlobalMusicProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
