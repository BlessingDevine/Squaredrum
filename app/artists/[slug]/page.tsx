import { notFound } from "next/navigation"
import GalleryGrid from "@/components/gallery-grid"
import { getGalleryFolders, getGalleryImages, prettifySlug } from "@/lib/get-gallery-images"

export const dynamic = "force-static"
export const revalidate = false

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const folders = await getGalleryFolders()
  return folders.map((slug) => ({ slug }))
}

export default async function ArtistGalleryPage({ params }: PageProps) {
  const { slug } = await params
  const images = await getGalleryImages(slug)

  if (!images || images.length === 0) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">{prettifySlug(slug)}</h1>
        <p className="text-sm text-muted-foreground">{`/images/${slug}`}</p>
      </header>

      <GalleryGrid images={images} />
    </main>
  )
}
