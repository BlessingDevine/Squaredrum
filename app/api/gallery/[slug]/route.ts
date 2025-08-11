import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug.toLowerCase()
    const dir = path.join(process.cwd(), "public", "images", slug)

    if (!fs.existsSync(dir)) return NextResponse.json([])

    const files = fs
      .readdirSync(dir)
      .filter((f) => f.toLowerCase().endsWith(".jpg"))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

    return NextResponse.json(files)
  } catch {
    return NextResponse.json([])
  }
}
