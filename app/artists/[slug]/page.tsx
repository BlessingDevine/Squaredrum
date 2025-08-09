import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import ArtistPageClient from "./ArtistPageClient"
import { artists } from "@/lib/artists-data"

interface ArtistPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return artists.map((artist) => ({
    slug: artist.slug,
  }))
}

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const artist = artists.find((a) => a.slug === params.slug)

  if (!artist) {
    return {
      title: "Artist Not Found | SQUAREDRUM Records",
    }
  }

  return {
    title: `${artist.name} | SQUAREDRUM Records`,
    description: artist.bio,
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
}

export default function ArtistPage({ params }: ArtistPageProps) {
  const artist = artists.find((a) => a.slug === params.slug)

  if (!artist) {
    notFound()
  }

  return <ArtistPageClient artist={artist} />
}
