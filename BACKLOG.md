# squaredrum.com — backlog

Robert's running list for the label site. Newest ideas at the bottom of each
section. (GoSquare has its own list in the gosquare-app repo.)

## Principles

- **Openly AI.** Every Squaredrum artist is an AI persona, run by real people.
  Say so wherever they appear, and label every collaboration.
- **Work with us = collaborations, not licensing.** Brands work with our
  artists/influencers to promote, hype, educate and entertain.
- AI music is free to enjoy for now, until the law settles what it is.

## Scale target

**300 artists and 20,000 songs** (Oct 2026: ~39 artists, ~2,580 songs — about 8× to go).
What has to change on the way, roughly in order of when it starts to hurt:

1. **GoSquare loads the whole catalogue onto the phone** (and caches it). Fine at
   2,600 songs; at 20,000 it means slow first opens and a large download. Move to
   asking the server for pages and search results instead. *Before ~8,000 songs.*
2. **Artist info lives in code** — the portrait list and hero albums in
   `src/lib/site.ts`, photos copied into `public/roster` (and into the radio repo).
   300 artists needs artist profiles in the catalogue (photos on the CDN, persona,
   colours, links) that Robert fills from the artist folders. *Do this as part of
   the artist mini-site work.*
3. **squaredrum.com reads the whole catalogue every 5 minutes** to build pages.
   Fine now; at 20,000 songs switch to per-page queries. Artist and release lists
   need search, filters and paging (300 artists / thousands of albums).
4. **Imports** read every file under IMPRINT each run; fine, but keep an eye on
   run time and on Google Drive downloading cloud-only files.
5. **Storage and bandwidth** — ~20,000 × ~7 MB ≈ 140 GB on S3/CloudFront: cheap
   to store; bandwidth grows with listeners, not songs.

## Next

1. **Artist pages as mini websites** — each artist's page becomes their own
   world inside squaredrum.com: photo gallery, music, videos and clips, lyrics,
   persona/story, socials, their own colours. Pilot with one artist.
   *Waiting on Robert:* organise each artist folder — pick the photos, add the
   persona brief (see ARTISTS PERSONAS.docx), videos.
2. **One account for every platform** — the same sign-in on squaredrum.com,
   GoSquare and Musicsquare Radio (the shared Supabase project already has
   GoSquare's 6-digit email code sign-in).
3. **Free downloads for signed-in fans** — downloads tagged with artist +
   Squaredrum + personal-use note; decide which songs (all, or picks/drops).
4. **Follow an artist** — fans follow artists; news and drops by artist.

## Later

- **Artists as influencers** — fans interact with artists: text chat in the
  artist's voice first, then voice notes, then video messages. Mostly in
  GoSquare (accounts, notifications). Needs moderation (young fans) and clear
  AI labelling.
- AI summaries on the News page (the old site had them via ANTHROPIC_API_KEY).

## Waiting on music

- Seven Riot Temple artists (Crimson Union, Dusk Canon, Hollow District,
  Knox Havoc, Lucid Arrow, Steel Vandal, Throne Attic): files renamed, held
  off air; Robert is checking mastering before import and release. They also
  need photos and album covers.
