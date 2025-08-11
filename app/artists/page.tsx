import fs from "fs"
import path from "path"
import Link from "next/link"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

const IMAGES_DIR = path.join(process.cwd(), "public", "images")

function getArtistFolders(): string[] {
  if (!fs.existsSync(IMAGES_DIR)) return []

  const dirs = fs
    .readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    // Ensure listing order is predictable
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))

  return dirs
}

function hasThumbnail01(slug: string) {
  const thumbPath = path.join(IMAGES_DIR, slug, "01.jpg")
  return fs.existsSync(thumbPath)
}

export default function ArtistsPage() {
  const artistFolders = getArtistFolders()

  // If folder is missing or empty -> notFound()
  if (artistFolders.length === 0) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Artists</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artistFolders.map((folder) => {
          // Slugs = lowercase with hyphens
          const slug = folder.toLowerCase()
          const thumbSrc = hasThumbnail01(folder) ? `/images/${slug}/01.jpg` : null

          return (
            <Link
              key={folder}
              href={`/artists/${encodeURIComponent(slug)}`}
              className="group rounded-xl overflow-hidden border bg-white hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/3] w-full bg-neutral-100">
                {thumbSrc ? (
                  <img
                    src={thumbSrc || "/placeholder.svg"}
                    alt={`${slug} thumbnail`}
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-sm text-neutral-500">
                    No thumbnail
                  </div>
                )}
              </div>
              <div className="p-3">
                <h2 className="text-base font-semibold capitalize">{slug.replace(/-/g, " ")}</h2>
                <p className="text-xs text-neutral-500">View gallery</p>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
