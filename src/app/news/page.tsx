import type { Metadata } from "next";
import { PageHead } from "@/components/sections";
import { NewsImage } from "@/components/news-image";
import { getNews, type Article } from "@/lib/news";

export const revalidate = 21600;
export const metadata: Metadata = { title: "Off the Square", description: "Off the Square: what's happening where AI meets music, headlines collected by Squaredrum." };

const day = (d: string) => (d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "");
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

/** One story. lead = the front-page story, side = the two beside it, card = the grid, brief = the compact list. */
function Story({ a, size }: { a: Article; size: "lead" | "side" | "card" | "brief" }) {
  const meta = (
    <span className="mono news-meta">
      {a.source}
      {a.date && ` · ${day(a.date)}`}
    </span>
  );
  if (size === "brief") {
    return (
      <article className="news-brief">
        {a.image && <NewsImage src={a.image} href={a.link} className="news-thumb" />}
        <div>
          {meta}
          <h3>
            <a href={a.link} {...ext}>
              {a.title}
            </a>
          </h3>
        </div>
      </article>
    );
  }
  return (
    <article className={`news-card news-${size}`}>
      {a.image && <NewsImage src={a.image} href={a.link} />}
      {meta}
      <h3 className={size === "lead" ? "display" : undefined}>
        <a href={a.link} {...ext}>
          {a.title}
        </a>
      </h3>
      {a.summary && size !== "side" && <p>{a.summary}</p>}
      <a className="mono news-read" href={a.link} {...ext} aria-label={`Read “${a.title}” on ${a.source}`}>
        Read on {a.source} ↗
      </a>
    </article>
  );
}

export default async function News() {
  const news = await getNews();
  // The newest story with a picture leads; everything else keeps its newest-first order.
  const leadAt = Math.max(0, news.findIndex((a) => a.image));
  const [lead, ...rest] = [news[leadAt], ...news.filter((_, i) => i !== leadAt)].filter(Boolean);
  const side = rest.slice(0, 2);
  const cards = rest.slice(2, 8);
  const briefs = rest.slice(8);
  return (
    <main>
      <PageHead eyebrow="News · The wire" title="Off the Square." lede="What's happening beyond the Square, where AI meets music. The latest stories from the music press, refreshed through the day." />
      <section className="sec wrap">
        {lead ? (
          <>
            <div className="news-front">
              <Story a={lead} size="lead" />
              {side.map((a) => (
                <Story key={a.link} a={a} size="side" />
              ))}
            </div>
            {cards.length > 0 && (
              <div className="news-grid">
                {cards.map((a) => (
                  <Story key={a.link} a={a} size="card" />
                ))}
              </div>
            )}
            {briefs.length > 0 && (
              <>
                <h2 className="mono news-more">More from the wire</h2>
                <div className="news-briefs">
                  {briefs.map((a) => (
                    <Story key={a.link} a={a} size="brief" />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <p className="empty">The headlines are taking a break — check back soon.</p>
        )}
      </section>
    </main>
  );
}
