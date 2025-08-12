export const normalizeCompilationSlug = (s: string) => s.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "-and-")

const OVERRIDES: Record<string, string> = {
  "r-and-b": "audio/rnb-square/",
  dancehall: "audio/dancehall-square/",
}

export function getCompilationPrefixes(raw: string): string[] {
  const slug = normalizeCompilationSlug(raw)
  // Try override first; fall back to existing scheme
  const out = []
  if (OVERRIDES[slug]) out.push(OVERRIDES[slug])
  // Keep the app's current default(s)
  out.push(`compilations/${slug}/`, `audio/${slug}/`)
  return out
}
