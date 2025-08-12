export const normalizeCompilationSlug = (s: string) => s.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "-and-")

const OVERRIDES: Record<string, string> = {
  "r-and-b": "audio/rnb-square/",
  dancehall: "audio/dancehall-square/",
}

export function getCompilationPrefixes(raw: string): string[] {
  const slug = normalizeCompilationSlug(raw)
  const out: string[] = []
  if (OVERRIDES[slug]) out.push(OVERRIDES[slug])
  // Keep existing scheme as fallbacks (adjust if your app uses different defaults)
  out.push(`compilations/${slug}/`, `audio/${slug}/`)
  return out
}
