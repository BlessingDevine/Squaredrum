/**
 * Local roster photos are 960×1200; send them through Next's image resizer
 * at a sensible width. Anything else (CDN covers, already sized) is returned as is.
 */
export function img(src: string, width: 384 | 640 | 828 | 1080 = 640) {
  return src.startsWith("/roster/") ? `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75` : src;
}
