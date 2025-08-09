import Link from "next/link"
import { getGalleryFolders, prettifySlug } from "@/lib/get-gallery-images"

export const dynamic = "force-static"
export const revalidate = false

export default async function ArtistsIndexPage() {
  const folders = await getGalleryFolders()

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Artists</h1>
        <p className="text-sm text-muted-foreground">Browse galleries auto-loaded from {"/public/images/<slug>"}.</p>
      </header>

      {folders.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No folders found under {"/public/images"}. Add folders with images to get started.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {folders.map((slug) => (
            <li key={slug}>
              <Link
                href={`/artists/${encodeURIComponent(slug)}`}
                className="block rounded-xl border p-4 hover:bg-accent/30 transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-base font-medium">{prettifySlug(slug)}</span>
                    <span className="text-xs text-muted-foreground">{`/images/${slug}`}</span>
                  </div>
                  <span className="text-xs rounded-full border px-2 py-1">{"View"}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
