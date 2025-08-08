import { notFound } from 'next/navigation'
import GalleryGrid from '@/components/GalleryGrid'
import { getGalleryFolders, getGalleryImages } from '@/lib/getGalleryImages'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateStaticParams() {
  const slugs = await getGalleryFolders()
  return slugs.map((slug) => ({ slug }))
}

function prettifySlug(slug: string) {
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default async function ArtistGalleryPage({
  params,
}: {
  params: { slug: string }
}) {
  const slug = params.slug
  const images = await getGalleryImages(slug)

  if (images.length === 0) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          {prettifySlug(slug)}
        </h1>
        <p className="text-neutral-600 mt-2">
          {'Images are read from '}
          <span className="font-mono">{`/public/images/${slug}`}</span>
          {'.'}
        </p>
      </header>

      <GalleryGrid images={images} />
    </main>
  )
}
