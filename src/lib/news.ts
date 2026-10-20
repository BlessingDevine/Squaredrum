import "server-only";

/**
 * AI-music industry headlines from Google News, as on the previous site.
 * Fetched at most every six hours; a feed that fails is simply skipped.
 */

export type Article = { title: string; link: string; source: string; category: string; date: string; summary: string };

const FEEDS = [
  { q: "AI music industry", category: "Industry" },
  { q: "Suno AI music", category: "Tools & tech" },
  { q: "Udio AI music", category: "Tools & tech" },
  { q: "AI music copyright", category: "Copyright" },
  { q: "generative AI music", category: "Tools & tech" },
  { q: "AI music streaming", category: "Business" },
];

// Feeds often send their HTML entity-encoded (&lt;a href=…&gt;), so tags are stripped both before and after
// the entities are decoded; &amp; goes last so "&amp;lt;" stays a literal "&lt;".
const decode = (s: string) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const tag = (xml: string, name: string) => decode(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i").exec(xml)?.[1] ?? "");

async function feed(q: string, category: string): Promise<Article[]> {
  try {
    const res = await fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SquaredrumBot/1.0)" },
      next: { revalidate: 21600 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].flatMap(([, item]) => {
      const raw = tag(item, "title");
      const link = tag(item, "link");
      if (!raw || !link) return [];
      // Google News titles end in " - Source".
      const m = raw.match(/^(.*) - ([^-]+)$/);
      const title = m?.[1] ?? raw;
      // Google News descriptions are just the headline and source again: no summary then.
      const desc = tag(item, "description").replace(raw, "").trim();
      const summary = desc.startsWith(title.slice(0, 40)) ? "" : desc.slice(0, 240);
      return [{ title, source: m?.[2]?.trim() ?? "Google News", link, category, date: tag(item, "pubDate"), summary }];
    });
  } catch {
    return [];
  }
}

export async function getNews(limit = 30): Promise<Article[]> {
  const all = (await Promise.all(FEEDS.map((f) => feed(f.q, f.category)))).flat();
  const seen = new Set<string>();
  return all
    .filter((a) => {
      const k = a.title.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, limit);
}
