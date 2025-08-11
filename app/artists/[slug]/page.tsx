import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

function getArtistImages(slug: string): string[] {
  const artistDir = path.join(process.cwd(), "public", "images", slug)
  if (!fs.existsSync(artistDir)) {
    return []
  }

  const imageFiles = fs
    .readdirSync(artistDir)
    .filter((file) => file.toLowerCase().endsWith(".jpg"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file) => `/images/${slug}/${file}`)

  return imageFiles
}

export default function ArtistGallery({ params }: { params: { slug: string } }) {
  const { slug } = params
  const imageFiles = getArtistImages(slug)

  if (!imageFiles || imageFiles.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Gallery: {slug}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {imageFiles.map((imagePath) => (
          <img
            key={imagePath}
            src={imagePath || "/placeholder.svg"}
            alt={imagePath}
            className="object-cover rounded-xl shadow-md"
          />
        ))}
      </div>
    </div>
  )
}
