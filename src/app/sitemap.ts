import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog";
import { SITE_URL } from "@/lib/config";

export const revalidate = 3600;

/** Every page search engines should know about: the site, each artist, release and imprint. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getCatalog();
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({ url: `${SITE_URL}${path}`, priority });
  return [
    page("/", 1),
    page("/artists", 0.9),
    page("/news", 0.6),
    page("/about", 0.5),
    page("/work-with-us", 0.5),
    page("/gosquare", 0.6),
    page("/contact", 0.4),
    ...c.artists.map((a) => page(`/artists/${a.slug}`, a.collection ? 0.6 : 0.8)),
    ...c.albums.map((al) => page(`/releases/${al.slug}`, 0.7)),
    ...c.imprints.map((i) => page(`/imprints/${i.slug}`, 0.7)),
  ];
}
