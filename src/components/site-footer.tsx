import Link from "next/link";
import { CONTACT_EMAIL, RADIO_URL, SOCIAL } from "@/lib/config";
import { NewsletterForm } from "./forms";

export function SiteFooter() {
  return (
    <footer>
      <div className="wrap foot">
        <div>
          <img src="/brand/squaredrum-stacked-tagline-metallic.svg" alt="SQUAREDRUM — Music Without Borders" />
          <NewsletterForm />
        </div>
        <div>
          <h4>Label</h4>
          <ul>
            <li><Link href="/imprints">Imprints</Link></li>
            <li><Link href="/artists">Artists</Link></li>
            <li><Link href="/releases">Releases</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/news">News</Link></li>
          </ul>
        </div>
        <div>
          <h4>Listen</h4>
          <ul>
            <li><a href={RADIO_URL}>Musicsquare Radio</a></li>
            <li><Link href="/#gosquare">GoSquare app</Link></li>
            <li><a href={SOCIAL.youtube}>YouTube</a></li>
            <li><a href={SOCIAL.instagram}>Instagram</a></li>
          </ul>
        </div>
        <div>
          <h4>Business</h4>
          <ul>
            <li><Link href="/work-with-us">Work with our artists</Link></li>
            <li><Link href="/contact?topic=Press%20%26%20media">Press</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
          </ul>
        </div>
      </div>
      <div className="wrap legal mono">
        <span>© {new Date().getFullYear()} Squaredrum LLC</span>
        <span>
          <Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link>
        </span>
      </div>
    </footer>
  );
}
