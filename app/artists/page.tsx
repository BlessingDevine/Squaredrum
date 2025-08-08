import Link from 'next/link'
import { getGalleryFolders } from '@/lib/getGalleryImages'

export const dynamic = 'force-static'
export const revalidate = false

function prettifySlug(slug: string) {
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default async function ArtistsIndexPage() {
  const folders = await getGalleryFolders()

  return (
    <main className="container mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{'Artist Galleries'}</h1>
        <p className="text-neutral-600 mt-2">{'Choose an artist to view their gallery.'}</p>
      </header>

      {folders.length === 0 ? (
        <div className="text-neutral-500">{'No artist folders found under /public/images.'}</div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map((slug) => (
            <li key={slug} className="list-none">
              <Link
                href={`/artists/${encodeURIComponent(slug)}`}
                className="block rounded-xl border p-4 hover:bg-neutral-50 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{prettifySlug(slug)}</span>
                  <span className="text-xs text-neutral-500">{'View →'}</span>
                </div>
                <p className="mt-1 text-xs text-neutral-500 font-mono">{`/images/${slug}`}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
