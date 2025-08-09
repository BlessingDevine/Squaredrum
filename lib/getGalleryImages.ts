import { promises as fs } from "node:fs"
import path from "node:path"

/**
 * Root directory for public images.
 * Example folder structure:
 *   public/images/<artist-slug>/<file>.{jpg,jpeg,png,webp,gif,svg}
 */
const IMAGES_ROOT = path.join(process.cwd(), "public", "images")

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"])
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" })

/**
 * Normalize a slug to a safe, filesystem-friendly and route-safe string.
 * This prevents path traversal and odd unicode forms.
 */
function sanitizeSlug(input: string): string {
  return input
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
  // Intentionally do not trim leading/trailing dashes to keep deterministic mapping
}

/**
 * Returns subfolder names of /public/images (sorted with natural order).
 */
export async function getGalleryFolders(): Promise<string[]> {
  try {
    const entries = await fs.readdir(IMAGES_ROOT, { withFileTypes: true })
    const folders = entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort((a, b) => collator.compare(a, b))

    return folders
  } catch {
    // Folder may not exist yet.
    return []
  }
}

/**
 * Returns public URLs for all files inside /public/images/<slug>
 * with extensions: .jpg .jpeg .png .webp .gif .svg
 * Sorted with natural order.
 */
export async function getGalleryImages(slug: string): Promise<string[]> {
  const safe = sanitizeSlug(slug)
  const dir = path.join(IMAGES_ROOT, safe)

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((name) => allowedExtensions.has(path.extname(name).toLowerCase()))
      .sort((a, b) => collator.compare(a, b))

    // Return public URLs (served by Next.js from /public)
    return files.map((name) => `/images/${safe}/${encodeURIComponent(name)}`)
  } catch {
    // Folder missing or unreadable
    return []
  }
}
