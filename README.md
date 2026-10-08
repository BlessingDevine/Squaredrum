# squaredrum.com

The home of SQUAREDRUM Records — the label site that ties together the
seventeen imprints, Musicsquare Radio and the GoSquare app.

Next.js 16 (App Router) · React 19 · plain CSS (`src/app/globals.css`).

## Where the content comes from

Artists, imprints, albums, covers and songs are read live from the **same
Supabase catalogue** Musicsquare Radio and GoSquare use (project "Musicsquare
Radio"). Anything imported there with the radio repo's scripts
(`~/Sites/musicsquareradio-2026/scripts/catalog/…`) appears here within five
minutes — no deploy needed. Audio and covers come from the CloudFront CDN.

The connection details in `src/lib/config.ts` are the public publishable key,
so Vercel needs no environment variables.

Things that are *not* in the catalogue live in **`src/lib/site.ts`**:

- `HERO` — the artists the home page hero rotates through (needs a portrait)
- `FEATURED_RELEASES` — albums shown first under "New releases"
- `IMPRINTS` — names, genres and one-line descriptions of all 17 imprints
- `PORTRAITS` — artists with a photo in `public/roster/<slug>.jpg`
  (copied from the radio site's roster)
- `TOPICS` — the contact form's topics

## Pages

| Path | What |
| --- | --- |
| `/` | Hero, live "On air" turntable, imprints, roster, releases, Radio + GoSquare, story, work with us |
| `/imprints`, `/imprints/[slug]` | All 17 imprints; each with its artists, releases and songs |
| `/artists`, `/artists/[slug]` | The roster; each artist with popular songs and discography |
| `/releases`, `/releases/[slug]` | Every album with a cover (filter with `?imprint=`); album page with tracklist |
| `/about`, `/work-with-us`, `/contact`, `/news`, `/privacy`, `/terms` | |

Old addresses (`/gallery`, `/test-downloads`, old artist slugs) redirect.

## Contact form and newsletter

Messages and sign-ups are saved to the Supabase tables `site_messages` and
`newsletter_signups`. Create them once by running `supabase/site_tables.sql`
in Supabase → SQL Editor. The website can only add rows, never read them; read
them in Supabase → Table Editor.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # what Vercel runs
```

Pushing: commit here, then push with GitHub Desktop. Vercel builds every push;
a branch gets its own preview address, and `main` is squaredrum.com.
