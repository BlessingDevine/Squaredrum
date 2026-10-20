import "server-only";

/**
 * Off the Square (/news): AI-music stories from the music-industry press. Each publication's own feed gives
 * a real summary and a direct link to the article, which Google News doesn't (its items are headline-only
 * and link through a Google redirect). Google News only fills in when the publications return too few.
 * Fetched at most every six hours; a feed that fails is simply skipped.
 */

/** `image` is the article's own picture (its share image), loaded straight from the publication; "" when there is none. */
export type Article = { title: string; link: string; source: string; category: string; date: string; summary: string; image: string };

// `ai: true` feeds are already AI-only sections; the others are whole-site feeds, filtered for AI stories
// (and Rolling Stone's AI section also for music). WordPress feeds serve older items as ?paged=2, 3.
const PUBLISHERS = [
  { source: "Music Business Worldwide", url: "https://www.musicbusinessworldwide.com/tag/artificial-intelligence/feed/", ai: true, pages: 1 },
  { source: "Rolling Stone", url: "https://www.rollingstone.com/t/artificial-intelligence/feed/", ai: true, music: true, pages: 2 },
  { source: "Music Ally", url: "https://musically.com/feed/", pages: 3 },
  { source: "Complete Music Update", url: "https://completemusicupdate.com/feed/", pages: 3 },
];

const GOOGLE = ["AI music industry", "AI music copyright", "Suno Udio AI music"];

const AI = /\b(AI|A\.I\.|artificial intelligence|Suno|Udio|generative|deepfakes?|voice clon\w*)\b/i;
const MUSIC = /\b(music|songs?|artists?|labels?|records?|streaming|Spotify|tracks?|albums?|singers?|rappers?|royalt\w*|musicians?)\b/i;

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
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const tag = (xml: string, name: string) => decode(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i").exec(xml)?.[1] ?? "");

/** A summary of two or three lines: feed footers ("The post … appeared first on …", "The post is from …", a trailing
 * "Source") dropped, cut at a word. */
function summarize(text: string) {
  const s = text
    .replace(/\s*The post .* appeared first on .*$/i, "")
    .replace(/\s*The post is from [^.]*\.?\s*$/i, "")
    .replace(/\s*Source:?\s*$/i, "")
    .replace(/\s*\[(…|\.\.\.|&hellip;)\]\s*$/, "")
    .trim();
  if (s.length <= 220) return s;
  return s.slice(0, 220).replace(/\s+\S*$/, "") + "…";
}

function categorize(text: string) {
  if (/copyright|lawsuit|sue[sd]?\b|court|licens|legislat|law\b|rights/i.test(text)) return "Copyright";
  if (/Suno|Udio|tool|model|launch|app\b|plugin|feature/i.test(text)) return "Tools & tech";
  if (/Spotify|stream|deal|revenue|royalt|label|fund|invest|market/i.test(text)) return "Business";
  return "Industry";
}

async function get(url: string, timeout = 15000) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; SquaredrumBot/1.0)" },
    next: { revalidate: 21600 },
    signal: AbortSignal.timeout(timeout),
  });
  return res.ok ? res.text() : "";
}

const httpsOnly = (u: string | undefined) => {
  const url = (u ?? "").replace(/&amp;|&#0*38;/g, "&").trim();
  return /^https:\/\/[^\s"'<>]+$/.test(url) ? url : "";
};

/** The picture a feed item carries: media:content / media:thumbnail, an image enclosure, or the first <img> in its HTML. */
function feedImage(item: string) {
  const html = item.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
  return httpsOnly(
    /<media:(?:content|thumbnail)[^>]*url="([^"]+)"/i.exec(item)?.[1] ??
      /<enclosure[^>]*url="([^"]+)"[^>]*type="image/i.exec(item)?.[1] ??
      /<img[^>]+src=["']([^"']+)["']/i.exec(html)?.[1],
  );
}

/** Feeds without pictures (MBW, Rolling Stone): the article page's share image (og:image). */
async function pageImage(link: string) {
  const html = await get(link, 8000).catch(() => "");
  return httpsOnly(
    /<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i.exec(html)?.[1] ??
      /<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image["']/i.exec(html)?.[1],
  );
}

async function publisher(p: (typeof PUBLISHERS)[number]): Promise<Article[]> {
  const pages = await Promise.all(
    Array.from({ length: p.pages }, (_, i) => get(p.url + (i ? `?paged=${i + 1}` : "")).catch(() => "")),
  );
  return pages.flatMap((xml) =>
    [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].flatMap(([, item]) => {
      const title = tag(item, "title");
      const link = tag(item, "link");
      const summary = summarize(tag(item, "description"));
      const text = `${title} ${summary}`;
      if (!title || !link || !summary) return [];
      if (!p.ai && !AI.test(text)) return [];
      if ((p.music || !p.ai) && !MUSIC.test(text)) return [];
      return [{ title, link, source: p.source, category: categorize(text), date: tag(item, "pubDate"), summary, image: feedImage(item) }];
    }),
  );
}

async function google(q: string): Promise<Article[]> {
  const xml = await get(`https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`).catch(() => "");
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].flatMap(([, item]) => {
    const raw = tag(item, "title");
    const link = tag(item, "link");
    if (!raw || !link) return [];
    // Google News titles end in " - Source"; their descriptions only repeat the headline, so no summary.
    const m = raw.match(/^(.*) - ([^-]+)$/);
    const title = m?.[1] ?? raw;
    return [{ title, link, source: m?.[2]?.trim() ?? "Google News", category: categorize(title), date: tag(item, "pubDate"), summary: "", image: "" }];
  });
}

export async function getNews(limit = 30): Promise<Article[]> {
  let all = (await Promise.all(PUBLISHERS.map(publisher))).flat();
  if (all.length < 12) all = all.concat((await Promise.all(GOOGLE.map(google))).flat());
  const seen = new Set<string>();
  const news = all
    .filter((a) => {
      const k = a.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    // Latest news only: the last 30 days, but never fewer than 12 stories.
    .filter((a, i) => i < 12 || Date.now() - Date.parse(a.date) < 30 * 86400000)
    .slice(0, limit);
  // Only the articles shown get their page read, and those pages are cached like the feeds.
  await Promise.all(news.map(async (a) => (a.image ||= a.summary ? await pageImage(a.link) : "")));
  return news;
}
