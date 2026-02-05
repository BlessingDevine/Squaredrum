import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"
import { artists } from "@/lib/artists-data"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug.toLowerCase()
    
    console.log("[v0] Gallery API called for slug:", slug)
    
    // Try physical directory first
    const dir = path.join(process.cwd(), "public", "images", slug)
    const dirExists = fs.existsSync(dir)
    console.log("[v0] Directory exists:", dirExists, "at path:", dir)
    
    if (dirExists) {
      const files = fs
        .readdirSync(dir)
        .filter((f) => f.toLowerCase().endsWith(".jpg"))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

      console.log("[v0] Found", files.length, "files in directory")
      
      // Only return directory files if we actually have files
      if (files.length > 0) {
        return NextResponse.json(files)
      }
    }

    // Fallback to photoGallery from artist data (for blob storage or when no directory exists)
    const artist = artists.find((a) => a.slug === slug)
    console.log("[v0] Artist found:", !!artist)
    console.log("[v0] PhotoGallery length:", artist?.photoGallery?.length || 0)
    
    if (artist?.photoGallery && artist.photoGallery.length > 0) {
      // Return the photo gallery paths/URLs
      const urls = artist.photoGallery.map((photo) => photo.src)
      console.log("[v0] Returning photoGallery URLs, first URL:", urls[0])
      return NextResponse.json(urls)
    }

    console.log("[v0] No gallery found, returning empty array")
    return NextResponse.json([])
  } catch (error) {
    console.log("[v0] Gallery API error:", error)
    return NextResponse.json([])
  }
}
