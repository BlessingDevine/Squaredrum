import fs from "fs"
import path from "path"
import Link from "next/link"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

const IMAGES_DIR = path.join(process.cwd(), "public", "images")

function getJpgsForSlug(slug: string): string[] {
  const artistDir = path.join(IMAGES_DIR, slug)

  if (!fs.existsSync(artistDir)) return []

  const files = fs
    .readdirSync(artistDir, { withFileTypes: false })
    // Only render files with .jpg (lowercase)
    .filter((f) => f.toLowerCase().endsWith(".jpg"))
    // Natural sort (01, 02, 03… 10…)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))

  return files
}

export default function ArtistGalleryPage({ params }: { params: { slug: string } }) {
  // Ensure everything is lowercase
  const slug = params.slug.toLowerCase()
  const files = getJpgsForSlug(slug)

  // If folder is missing or empty -> notFound()
  if (files.length === 0) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize">{slug.replace(/-/g, " ")}</h1>
        <Link href="/artists" className="text-sm text-neutral-600 hover:underline">
          Back to artists
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((file) => {
          // Use plain <img> and URL-safe filename
          const src = `/images/${slug}/${encodeURIComponent(file)}`
          return (
            <div key={file} className="rounded-xl overflow-hidden bg-neutral-100">
              <img
                src={src || "/placeholder.svg"}
                alt={`${slug} ${file}`}
                className="h-48 w-full object-cover md:h-56 lg:h-64"
                loading="eager"
              />
            </div>
          )
        })}
      </div>
    </main>
  )
}
