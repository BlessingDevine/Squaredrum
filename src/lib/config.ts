/**
 * Where the catalogue lives. These are public by design: the publishable key
 * only ever sees what Row Level Security allows (released songs, public
 * files), and it is the same key Musicsquare Radio and GoSquare ship to every
 * browser and phone. Environment variables override them, so Vercel needs no
 * setup for the site to work.
 */

export const SUPABASE_URL = (process.env.CATALOG_SUPABASE_URL ?? "https://gwmjfzjvpzcjoyflzqci.supabase.co").trim();
export const SUPABASE_KEY = (process.env.CATALOG_SUPABASE_KEY ?? "sb_publishable_czmyymNfugt-VGQpdOB4Xg_ZWAMpzeb").trim();
export const AUDIO_BASE = (process.env.CATALOG_AUDIO_BASE_URL ?? "https://d1j1hqrpj9spbo.cloudfront.net").trim().replace(/\/$/, "");

export const SITE_URL = "https://www.squaredrum.com";
export const RADIO_URL = "https://musicsquareradio.com";
export const CONTACT_EMAIL = "info@squaredrum.com";
export const CONTACT_PHONE = "+1 (424) 500-0396";
export const SOCIAL = {
  instagram: "https://instagram.com/squaredrumrecords",
  youtube: "https://youtube.com/@squaredrumrecords",
  x: "https://twitter.com/squaredrumrec",
};
