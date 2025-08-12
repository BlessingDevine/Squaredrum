import { NextResponse } from "next/server"
import { getCompilationPrefixes, normalizeCompilationSlug } from "@/lib/compilation-prefix"
import { safeBlobUrl } from "@/lib/audio-url-utils"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function listBlobFilenames(prefix: string): Promise<string[]> {
  // This is a placeholder - in a real implementation, you would use:
  // import { list } from '@vercel/blob';
  // const { blobs } = await list({ prefix });
  // return blobs.map(blob => blob.pathname.replace(prefix, ''));

  // For now, return empty array to prevent errors
  console.log(`Would list files with prefix: ${prefix}`)
  return []
}

function buildPublicUrl(prefix: string, filename: string) {
  const base = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/"
  return safeBlobUrl(base + prefix + filename)
}

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const slug = normalizeCompilationSlug(params.slug || "")
  const candidates = getCompilationPrefixes(slug)

  for (const prefix of candidates) {
    try {
      const files = await listBlobFilenames(prefix)
      const mp3s = (files || [])
        .filter((n) => n.toLowerCase().endsWith(".mp3"))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      if (mp3s.length) {
        const urls = mp3s.map((name) => buildPublicUrl(prefix, name))
        return NextResponse.json(urls)
      }
    } catch {
      /* try next */
    }
  }

  console.warn("No tracks for", slug, "checked:", candidates)
  return NextResponse.json([])
}
