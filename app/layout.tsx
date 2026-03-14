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
    default: "SQUAREDRUM Records | Where AI Creativity Meets Human Craftsmanship",
    template: "%s | SQUAREDRUM Records"
  },
  description: "Experience the future of music at SQUAREDRUM Records. AI-generated compositions perfected by expert human producers, mix engineers, and sound designers. Where cutting-edge technology meets professional craftsmanship to create exceptional music.",
  keywords: "AI music label, AI-human collaboration, professional mixing, mastering, sound design, AI artists, human producers, music production, audio engineering, AI composers",
  authors: [{ name: "SQUAREDRUM" }],
  creator: "SQUAREDRUM",
  publisher: "SQUAREDRUM",
  robots: "index, follow",
  metadataBase: new URL('https://squaredrum.com'),
  openGraph: {
    title: "SQUAREDRUM Records | Where AI Creativity Meets Human Craftsmanship",
    description: "AI-generated music perfected by expert human producers, mix engineers, and mastering professionals. The best of both worlds.",
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
    title: "SQUAREDRUM Records | Where AI Creativity Meets Human Craftsmanship",
    description: "AI-generated music perfected by expert human producers, mix engineers, and mastering professionals.",
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
