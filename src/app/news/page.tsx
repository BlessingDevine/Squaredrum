import type { Metadata } from "next";
import { PageHead } from "@/components/sections";
import { getNews } from "@/lib/news";

export const revalidate = 21600;
export const metadata: Metadata = { title: "Off the Square", description: "Off the Square: what's happening where AI meets music, headlines collected by Squaredrum." };

export default async function News() {
  const news = await getNews();
  return (
    <main>
      <PageHead eyebrow="News · The wire" title="Off the Square." lede="What's happening beyond the Square, where AI meets music. The latest headlines from around the industry, refreshed through the day." />
      <section className="sec wrap">
        {news.length ? (
          <div className="news-grid">
            {news.map((a) => (
              <a key={a.link} className="news-card" href={a.link} target="_blank" rel="noopener noreferrer">
                <span className="mono">
                  {a.category} · {a.source}
                </span>
                <b>{a.title}</b>
                {a.summary && <p>{a.summary}</p>}
                <span className="mono" style={{ color: "var(--mute)", marginTop: "auto" }}>
                  {a.date ? new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""} ↗
                </span>
              </a>
            ))}
          </div>
        ) : (
          <p className="empty">The headlines are taking a break — check back soon.</p>
        )}
      </section>
    </main>
  );
}
