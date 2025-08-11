import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import ArtistPageClient from "./ArtistPageClient"
import GalleryClient from "./GalleryClient"
import { artists } from "@/lib/artists-data"

interface ArtistPageProps {
  params: {
    slug: string
  }
}

export const dynamic = "force-dynamic"
export const revalidate = 0

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

  return (
    <>
      <ArtistPageClient artist={artist} />
      {/* BEGIN dynamic gallery data source (non-breaking) */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <GalleryClient
            slug={params.slug.toLowerCase()}
            renderItem={(file) => (
              <img
                key={file}
                src={`/images/${params.slug.toLowerCase()}/${file}`}
                alt={`${params.slug.toLowerCase()} ${file}`}
                className="h-48 w-full object-cover rounded-md"
                loading="eager"
              />
            )}
          />
        </div>
      </section>
      {/* END dynamic gallery data source */}
    </>
  )
}
