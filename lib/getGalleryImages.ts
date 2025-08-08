import 'server-only'

import { promises as fs } from 'fs'
import path from 'path'

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'])

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

/**
 * Sanitize a slug to avoid path traversal and invalid characters.
 * Allows a–z, 0–9, -, _
 */
function sanitizeSlug(input: string) {
  const s = (input || '').toString()
  const cleaned = s.replace(/[^a-zA-Z0-9-_]/g, '')
  // Prevent sneaky path traversal
  if (cleaned.includes('..')) return ''
  return cleaned
}

/**
 * Returns subfolder names under /public/images in natural-sorted order.
 */
export async function getGalleryFolders(): Promise<string[]> {
  const imagesDir = path.join(process.cwd(), 'public', 'images')

  try {
    const entries = await fs.readdir(imagesDir, { withFileTypes: true })
    const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name)
    dirs.sort(collator.compare)
    return dirs
  } catch {
    // If the folder doesn't exist yet, return empty.
    return []
  }
}

/**
 * Returns public URLs for all image files inside /public/images/<slug>
 * Extensions: .jpg .jpeg .png .webp .gif .svg
 * Sorted in natural order.
 */
export async function getGalleryImages(slug: string): Promise<string[]> {
  const safe = sanitizeSlug(slug)
  if (!safe) return []

  const dir = path.join(process.cwd(), 'public', 'images', safe)
  try {
    const stats = await fs.stat(dir)
    if (!stats.isDirectory()) return []
  } catch {
    return []
  }

  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))

  files.sort(collator.compare)

  // Return public URLs
  return files.map((name) => `/images/${safe}/${name}`)
}
