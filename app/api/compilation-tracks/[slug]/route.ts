import { NextResponse } from "next/server"
import { list } from "@vercel/blob"
import { getCompilationPrefixes, normalizeCompilationSlug } from "@/lib/compilation-prefix"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const slug = normalizeCompilationSlug(params.slug || "")
  const prefixes = getCompilationPrefixes(slug)

  for (const prefix of prefixes) {
    try {
      // On Vercel, token is injected automatically. Locally, you can set BLOB_READ_WRITE_TOKEN.
      const { blobs } = await list({
        prefix,
        limit: 1000,
        token: process.env.BLOB_READ_WRITE_TOKEN, // optional locally
      })

      const urls = (blobs || [])
        .map((b) => b.url) // already a public URL
        .filter((u) => u.toLowerCase().endsWith(".mp3"))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

      if (urls.length) {
        console.log("COMPILATION_PREFIX_USED", slug, prefix, "files:", urls.length)
        return NextResponse.json(urls)
      }
    } catch {
      // try the next prefix
    }
  }

  console.warn("No tracks for", slug, "checked:", prefixes)
  return NextResponse.json([])
}
