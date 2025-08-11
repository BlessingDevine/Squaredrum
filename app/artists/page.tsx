import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

function getArtistFolders(): string[] {
  const publicDir = path.join(process.cwd(), "public", "images")
  if (!fs.existsSync(publicDir)) {
    return []
  }

  const artistFolders = fs
    .readdirSync(publicDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort()

  return artistFolders
}

export default function ArtistsPage() {
  const artistFolders = getArtistFolders()

  if (!artistFolders || artistFolders.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Artists</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artistFolders.map((folder) => {
          const firstImage = fs
            .readdirSync(path.join(process.cwd(), "public", "images", folder))
            .filter((file) => file.toLowerCase().endsWith(".jpg"))[0]

          const imagePath = firstImage ? `/images/${folder}/${firstImage}` : null

          return (
            <div key={folder} className="rounded-xl overflow-hidden shadow-md">
              {imagePath ? (
                <img src={imagePath || "/placeholder.svg"} alt={folder} className="object-cover w-full h-48" />
              ) : (
                <div className="h-48 bg-gray-100 flex items-center justify-center">No Image</div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold">{folder}</h2>
                <a href={`/artists/${folder}`} className="text-blue-600 hover:underline">
                  View Gallery
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
