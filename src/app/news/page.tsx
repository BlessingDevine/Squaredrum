import type { Metadata } from "next";
import { PageHead } from "@/components/sections";
import { NewsImage } from "@/components/news-image";
import { getNews } from "@/lib/news";

export const revalidate = 21600;
export const metadata: Metadata = { title: "Off the Square", description: "Off the Square: what's happening where AI meets music, headlines collected by Squaredrum." };

export default async function News() {
  const news = await getNews();
  return (
    <main>
      <PageHead eyebrow="News · The wire" title="Off the Square." lede="What's happening beyond the Square, where AI meets music. The latest stories from the music press, refreshed through the day." />
      <section className="sec wrap">
        {news.length ? (
          <div className="news-grid">
            {news.map((a) => (
              <article key={a.link} className="news-card">
                {a.image && <NewsImage src={a.image} href={a.link} />}
                <span className="mono news-meta">
                  {a.source}
                  {a.date && ` · ${new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                </span>
                <h3>
                  <a href={a.link} target="_blank" rel="noopener noreferrer">
                    {a.title}
                  </a>
                </h3>
                {a.summary && <p>{a.summary}</p>}
                <a className="mono news-read" href={a.link} target="_blank" rel="noopener noreferrer" aria-label={`Read “${a.title}” on ${a.source}`}>
                  Read on {a.source} ↗
                </a>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty">The headlines are taking a break — check back soon.</p>
        )}
      </section>
    </main>
  );
}
