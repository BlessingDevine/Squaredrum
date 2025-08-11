import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import ArtistPageClient from "./ArtistPageClient"
import { artists } from "@/lib/artists-data"
import GalleryClient from "./GalleryClient"

export const dynamic = "force-dynamic"
export const revalidate = 0

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
  const artist = artists.find((a) => a.slug === params.slug.toLowerCase())

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
  const slug = params.slug.toLowerCase()
  const artist = artists.find((a) => a.slug === slug)

  if (!artist) {
    notFound()
  }

  return (
    <>
      {/* Keep existing page design */}
      <ArtistPageClient artist={artist} />

      {/* Only switch the image data source; keep structure/classes minimal and non-disruptive */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <GalleryClient
            slug={slug}
            renderItem={(file) => (
              <img
                key={file}
                src={`/images/${slug}/${file}`}
                alt={`${artist?.name ?? slug} ${file}`}
                className="h-48 w-full object-cover rounded-md"
                loading="eager"
              />
            )}
          />
        </div>
      </section>
    </>
  )
}
