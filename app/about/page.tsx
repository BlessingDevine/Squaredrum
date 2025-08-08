import type { Metadata, Viewport } from "next"
import AboutClient from "./AboutClient"

export const metadata: Metadata = {
  title: "About Us | SQUAREDRUM Records",
  description: "Learn about SQUAREDRUM Records - pioneering the future of music through AI-human collaboration",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
}

export default function AboutPage() {
  return <AboutClient />
}
