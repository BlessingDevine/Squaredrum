// lib/compilationPrefix.ts
export const normalizeSlug = (s: string) => s.toLowerCase().replace(/&/g, "-and-").replace(/\s+/g, "-")

// Map UI slugs to actual storage prefixes you're using today
const OVERRIDES: Record<string, string> = {
  "r-and-b": "audio/rnb-square/",
  dancehall: "audio/dancehall-square/",
}

export function getCompilationPrefixes(raw: string): string[] {
  const slug = normalizeSlug(raw)
  return OVERRIDES[slug] ? [OVERRIDES[slug]] : [`compilations/${slug}/`, `audio/${slug}/`]
}
