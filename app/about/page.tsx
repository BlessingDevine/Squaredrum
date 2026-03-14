import type { Metadata, Viewport } from "next"
import AboutClient from "./AboutClient"

export const metadata: Metadata = {
  title: "About Us | SQUAREDRUM Records",
  description: "Learn about SQUAREDRUM Records - the world's first fully AI-driven music label where every note, lyric, and beat is created entirely by artificial intelligence with zero human involvement in the creative process.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
}

export default function AboutPage() {
  return <AboutClient />
}
