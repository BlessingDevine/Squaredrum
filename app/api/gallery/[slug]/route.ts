import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"
import { artists } from "@/lib/artists-data"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug.toLowerCase()
    
    // Check for photoGallery with external URLs first (blob storage) - highest priority
    const artist = artists.find((a) => a.slug === slug)
    if (artist?.photoGallery && artist.photoGallery.length > 0) {
      // Check if photoGallery uses external URLs (starts with http)
      const hasExternalUrls = artist.photoGallery.some((photo) => photo.src.startsWith("http"))
      if (hasExternalUrls) {
        // Return the external photo gallery URLs directly
        return NextResponse.json(artist.photoGallery.map((photo) => photo.src))
      }
    }

    // Try physical directory for artists without blob storage
    const dir = path.join(process.cwd(), "public", "images", slug)
    if (fs.existsSync(dir)) {
      const files = fs
        .readdirSync(dir)
        .filter((f) => f.toLowerCase().endsWith(".jpg"))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

      if (files.length > 0) {
        return NextResponse.json(files)
      }
    }

    return NextResponse.json([])
  } catch {
    return NextResponse.json([])
  }
}
