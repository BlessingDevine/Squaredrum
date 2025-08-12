export function safeBlobUrl(url: string): string {
  if (!url) return url

  return url
    .replace(/ /g, "%20") // Replace spaces with %20
    .replace(/'/g, "%27") // Replace apostrophes with %27
    .replace(/#/g, "%23") // Replace # with %23
    .replace(/\(/g, "%28") // Replace ( with %28
    .replace(/\)/g, "%29") // Replace ) with %29
}

export function getCompilationFolderPrefix(slug: string): string {
  if (slug === "r-and-b" || slug === "r&b") {
    return "audio/rnb-square/"
  }
  if (slug === "dancehall") {
    return "audio/dancehall-square/"
  }
  // For other compilations, use existing logic
  return `audio/${slug}/`
}
