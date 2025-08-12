// lib/normalizeMediaUrl.ts
export function normalizeMediaUrl(raw: string): string {
  if (!raw) return raw
  let u = raw.trim()

  // Normalize extension to lowercase
  u = u.replace(/\.mp3$/i, ".mp3")

  // Escape common breakers (before encodeURI)
  u = u.replace(/'/g, "%27").replace(/#/g, "%23").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/ /g, "%20")

  try {
    u = encodeURI(u)
  } catch {}
  return u
}
