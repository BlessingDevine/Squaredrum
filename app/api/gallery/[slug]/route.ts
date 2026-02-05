import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"
import { artists } from "@/lib/artists-data"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug.toLowerCase()
    
    // Try physical directory first
    const dir = path.join(process.cwd(), "public", "images", slug)
    if (fs.existsSync(dir)) {
      const files = fs
        .readdirSync(dir)
        .filter((f) => f.toLowerCase().endsWith(".jpg"))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

      // Only return directory files if we actually have files
      if (files.length > 0) {
        return NextResponse.json(files)
      }
    }

    // Fallback to photoGallery from artist data (for blob storage or when no directory exists)
    const artist = artists.find((a) => a.slug === slug)
    if (artist?.photoGallery && artist.photoGallery.length > 0) {
      // Return the photo gallery paths/URLs
      return NextResponse.json(artist.photoGallery.map((photo) => photo.src))
    }

    return NextResponse.json([])
  } catch {
    return NextResponse.json([])
  }
}
