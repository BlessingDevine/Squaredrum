import "server-only"

import { promises as fs } from "fs"
import path from "path"

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"])

/**
 * Natural sort comparator using Intl.Collator with numeric comparison.
 */
function naturalCompare(a: string, b: string) {
  return new Intl.Collator(undefined, { numeric: true, sensitivity: "base" }).compare(a, b)
}

/**
 * Returns the absolute path to the /public/images directory.
 */
function getImagesRoot(): string {
  // process.cwd() points to the project root during Next.js builds
  return path.join(process.cwd(), "public", "images")
}

/**
 * Sanitize and normalize a slug.
 * Allows only lowercase letters, numbers, dashes, and underscores.
 */
function sanitizeSlug(input: string): string | null {
  const s = (input || "").toString().trim().toLowerCase()
  if (!/^[a-z0-9-_]+$/.test(s)) return null
  return s
}

/**
 * getGalleryFolders()
 * - Returns subfolder names of /public/images
 * - Sorted in natural order
 */
export async function getGalleryFolders(): Promise<string[]> {
  const root = getImagesRoot()
  let dirents: fs.Dirent[]
  try {
    dirents = await fs.readdir(root, { withFileTypes: true })
  } catch {
    return []
  }

  // Only include directories
  const folders = dirents.filter((d) => d.isDirectory()).map((d) => d.name)

  // Natural sort
  folders.sort(naturalCompare)

  return folders
}

/**
 * getGalleryImages(slug)
 * - Returns public URLs for files inside /public/images/<slug>
 * - Only includes supported image extensions
 * - Sorted in natural order
 */
export async function getGalleryImages(slug: string): Promise<string[]> {
  const safe = sanitizeSlug(slug)
  if (!safe) return []

  const folderAbs = path.join(getImagesRoot(), safe)
  let dirents: fs.Dirent[]
  try {
    dirents = await fs.readdir(folderAbs, { withFileTypes: true })
  } catch {
    // Folder may not exist
    return []
  }

  const files = dirents
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((name) => IMAGE_EXTS.has(path.extname(name).toLowerCase()))

  files.sort(naturalCompare)

  // Return public URLs starting with /
  return files.map((name) => path.posix.join("/images", safe, name))
}

// Optionally, a small helper to prettify slugs for headings
export function prettifySlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}
