import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"
import { artists } from "@/lib/artists-data"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug.toLowerCase()
    const dir = path.join(process.cwd(), "public", "images", slug)

    // Check if physical directory exists
    if (fs.existsSync(dir)) {
      const files = fs
        .readdirSync(dir)
        .filter((f) => f.toLowerCase().endsWith(".jpg"))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

      return NextResponse.json(files)
    }

    // If no physical directory, check for photoGallery in artist data
    const artist = artists.find((a) => a.slug === slug)
    if (artist?.photoGallery && artist.photoGallery.length > 0) {
      // Return the photo gallery URLs directly
      return NextResponse.json(artist.photoGallery.map((photo) => photo.src))
    }

    return NextResponse.json([])
  } catch {
    return NextResponse.json([])
  }
}
