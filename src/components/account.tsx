"use client";

import type { Session } from "@supabase/supabase-js";
import Link from "next/link";
import { createContext, type ReactNode, use, useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

/**
 * The listener's GoSquare account on squaredrum.com: the same account, likes,
 * playlists and follows as in the GoSquare app (same Supabase project and
 * tables). Sign-in is the app's emailed 6-digit code; the account is created on
 * first sign-in.
 */

export type UserPlaylist = { id: string; name: string; songIds: string[] };
export type DownloadSong = { id: string; title: string; artist: string; src: string };

type Dialog = { kind: "sign-in"; reason?: string } | { kind: "playlist"; songId: string } | { kind: "notice"; title: string; text: string } | null;

/** Free downloads per listener in any 7 days (enforced by claim_download() in the database). */
export const DOWNLOADS_PER_WEEK = 20;

type AccountState = {
  ready: boolean;
  email: string | null;
  signedIn: boolean;
  liked: Set<string>;
  playlists: UserPlaylist[];
  follows: Set<string>;
  /** False until follows load, and stays false if the follows table isn't there yet. */
  followsOn: boolean;
  /** Songs downloaded in the last 7 days (null until known). */
  downloadsUsed: number | null;
  askSignIn: (reason?: string) => void;
  toggleLike: (songId: string) => Promise<void>;
  pickPlaylist: (songId: string) => void;
  createPlaylist: (name: string, songId?: string) => Promise<void>;
  addToPlaylist: (playlistId: string, songId: string) => Promise<void>;
  removeFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  renamePlaylist: (playlistId: string, name: string) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  toggleFollow: (artistId: string) => Promise<void>;
  download: (song: DownloadSong) => Promise<void>;
  signOut: () => Promise<void>;
};

const AccountContext = createContext<AccountState | null>(null);

export function useAccount() {
  const ctx = use(AccountContext);
  if (!ctx) throw new Error("useAccount outside AccountProvider");
  return ctx;
}

const NONE = new Set<string>();

type Library = { userId: string | null; liked: string[]; playlists: UserPlaylist[]; follows: string[]; followsOn: boolean; downloadsUsed: number | null };
const EMPTY: Library = { userId: null, liked: [], playlists: [], follows: [], followsOn: false, downloadsUsed: null };

export function AccountProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);
  const userId = session?.user.id ?? null;
  // The library belongs to the user it was loaded for; another (or no) user sees it empty.
  const [lib, setLib] = useState<Library>(EMPTY);
  const mine = lib.userId === userId && userId !== null;
  const liked = mine ? lib.liked : EMPTY.liked;
  const playlists = mine ? lib.playlists : EMPTY.playlists;
  const follows = mine ? lib.follows : EMPTY.follows;
  const followsOn = mine && lib.followsOn;
  const downloadsUsed = mine ? lib.downloadsUsed : null;
  const setLiked = useCallback((f: (l: string[]) => string[]) => setLib((x) => ({ ...x, liked: f(x.liked) })), []);
  const setPlaylists = useCallback((f: (p: UserPlaylist[]) => UserPlaylist[]) => setLib((x) => ({ ...x, playlists: f(x.playlists) })), []);
  const setFollows = useCallback((f: (l: string[]) => string[]) => setLib((x) => ({ ...x, follows: f(x.follows) })), []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  // The listener's library, loaded once per sign-in.
  useEffect(() => {
    if (!userId) return;
    let live = true;
    (async () => {
      const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();
      const [likes, lists, fol, dls] = await Promise.all([
        supabase.from("liked_songs").select("song_id").order("liked_at", { ascending: false }),
        supabase
          .from("user_playlists")
          .select("user_playlist_id, playlist_name, user_playlist_songs(song_id, position)")
          .order("updated_at", { ascending: false }),
        supabase.from("followed_artists").select("artist_id").order("followed_at", { ascending: false }),
        supabase.from("song_downloads").select("song_id").gt("downloaded_at", weekAgo),
      ]);
      if (!live) return;
      setLib({
        userId,
        liked: (likes.data ?? []).map((r) => r.song_id),
        playlists: (lists.data ?? []).map((p) => ({
          id: p.user_playlist_id,
          name: p.playlist_name,
          songIds: [...(p.user_playlist_songs ?? [])].sort((a, b) => a.position - b.position).map((s) => s.song_id),
        })),
        follows: (fol.data ?? []).map((r) => r.artist_id),
        followsOn: !fol.error,
        downloadsUsed: dls.error ? null : new Set((dls.data ?? []).map((r) => r.song_id)).size,
      });
    })();
    return () => {
      live = false;
    };
  }, [userId]);

  const askSignIn = useCallback((reason?: string) => setDialog({ kind: "sign-in", reason }), []);

  const toggleLike = useCallback(
    async (songId: string) => {
      if (!userId) return askSignIn("Sign in to like songs. They show up in GoSquare too.");
      const was = liked.includes(songId);
      setLiked((l) => (was ? l.filter((id) => id !== songId) : [songId, ...l]));
      const { error } = was
        ? await supabase.from("liked_songs").delete().eq("song_id", songId)
        : await supabase.from("liked_songs").insert({ song_id: songId });
      if (error) setLiked((l) => (was ? [songId, ...l] : l.filter((id) => id !== songId)));
    },
    [userId, liked, askSignIn, setLiked],
  );

  const pickPlaylist = useCallback(
    (songId: string) => {
      if (!userId) return askSignIn("Sign in to make playlists. They show up in GoSquare too.");
      setDialog({ kind: "playlist", songId });
    },
    [userId, askSignIn],
  );

  const addToPlaylist = useCallback(
    async (playlistId: string, songId: string) => {
      const p = playlists.find((x) => x.id === playlistId);
      if (!p || p.songIds.includes(songId)) return;
      const { error } = await supabase
        .from("user_playlist_songs")
        .insert({ user_playlist_id: playlistId, song_id: songId, position: p.songIds.length });
      if (error) return;
      // Touch the playlist so it sorts first, as the app does.
      await supabase.from("user_playlists").update({ playlist_name: p.name }).eq("user_playlist_id", playlistId);
      setPlaylists((ps) => [{ ...p, songIds: [...p.songIds, songId] }, ...ps.filter((x) => x.id !== playlistId)]);
    },
    [playlists, setPlaylists],
  );

  const createPlaylist = useCallback(
    async (name: string, songId?: string) => {
      const { data, error } = await supabase
        .from("user_playlists")
        .insert({ playlist_name: name.trim() })
        .select("user_playlist_id, playlist_name")
        .single();
      if (error || !data) return;
      const p: UserPlaylist = { id: data.user_playlist_id, name: data.playlist_name, songIds: [] };
      if (songId) {
        const { error: e } = await supabase.from("user_playlist_songs").insert({ user_playlist_id: p.id, song_id: songId, position: 0 });
        if (!e) p.songIds = [songId];
      }
      setPlaylists((ps) => [p, ...ps]);
    },
    [setPlaylists],
  );

  const removeFromPlaylist = useCallback(async (playlistId: string, songId: string) => {
    const { error } = await supabase.from("user_playlist_songs").delete().eq("user_playlist_id", playlistId).eq("song_id", songId);
    if (!error) setPlaylists((ps) => ps.map((p) => (p.id === playlistId ? { ...p, songIds: p.songIds.filter((s) => s !== songId) } : p)));
  }, [setPlaylists]);

  const renamePlaylist = useCallback(async (playlistId: string, name: string) => {
    const { error } = await supabase.from("user_playlists").update({ playlist_name: name.trim() }).eq("user_playlist_id", playlistId);
    if (!error) setPlaylists((ps) => ps.map((p) => (p.id === playlistId ? { ...p, name: name.trim() } : p)));
  }, [setPlaylists]);

  const deletePlaylist = useCallback(async (playlistId: string) => {
    const { error } = await supabase.from("user_playlists").delete().eq("user_playlist_id", playlistId);
    if (!error) setPlaylists((ps) => ps.filter((p) => p.id !== playlistId));
  }, [setPlaylists]);

  const toggleFollow = useCallback(
    async (artistId: string) => {
      if (!userId) return askSignIn("Sign in to follow artists. You'll see them in GoSquare too.");
      const was = follows.includes(artistId);
      setFollows((f) => (was ? f.filter((id) => id !== artistId) : [artistId, ...f]));
      const { error } = was
        ? await supabase.from("followed_artists").delete().eq("artist_id", artistId)
        : await supabase.from("followed_artists").insert({ artist_id: artistId });
      if (error) setFollows((f) => (was ? [artistId, ...f] : f.filter((id) => id !== artistId)));
    },
    [userId, follows, askSignIn, setFollows],
  );

  // Free downloads for signed-in listeners. The CDN allows cross-origin reads, so the
  // browser fetches the MP3 and saves it under a readable name.
  const download = useCallback(
    async (song: DownloadSong) => {
      if (!userId) return askSignIn(`Sign in to download songs. It's free: up to ${DOWNLOADS_PER_WEEK} a week.`);
      // The weekly limit is checked (and the download logged) in the database. Until its SQL
      // is run the call fails, and downloads stay open.
      const { data: claim, error: claimError } = await supabase.rpc("claim_download", { p_song_id: song.id });
      if (!claimError && claim) {
        const c = claim as { allowed: boolean; used: number; limit: number; next_at: string | null };
        if (!c.allowed) {
          const when = c.next_at
            ? new Date(c.next_at).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })
            : "in a few days";
          setDialog({
            kind: "notice",
            title: "Weekly limit reached",
            text: `You've used your ${c.limit} free downloads this week. You can download again on ${when}.`,
          });
          return;
        }
        setLib((x) => (x.userId === userId ? { ...x, downloadsUsed: c.used } : x));
      }
      const res = await fetch(song.src);
      if (!res.ok) return;
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = `${song.artist} - ${song.title}.mp3`.replace(/[\\/:*?"<>|]/g, "");
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    },
    [userId, askSignIn],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AccountState>(
    () => ({
      ready,
      email: session?.user.email ?? null,
      signedIn: !!userId,
      liked: userId ? new Set(liked) : NONE,
      playlists,
      follows: userId ? new Set(follows) : NONE,
      followsOn,
      downloadsUsed,
      askSignIn,
      toggleLike,
      pickPlaylist,
      createPlaylist,
      addToPlaylist,
      removeFromPlaylist,
      renamePlaylist,
      deletePlaylist,
      toggleFollow,
      download,
      signOut,
    }),
    [ready, session, userId, liked, playlists, follows, followsOn, downloadsUsed, askSignIn, toggleLike, pickPlaylist, createPlaylist, addToPlaylist, removeFromPlaylist, renamePlaylist, deletePlaylist, toggleFollow, download, signOut],
  );

  return (
    <AccountContext value={value}>
      {children}
      {dialog?.kind === "sign-in" && <SignInDialog reason={dialog.reason} onClose={() => setDialog(null)} />}
      {dialog?.kind === "playlist" && <PlaylistDialog songId={dialog.songId} onClose={() => setDialog(null)} />}
      {dialog?.kind === "notice" && (
        <Modal title={dialog.title} onClose={() => setDialog(null)}>
          <div className="acct-form">
            <div className="eyebrow mono">Free downloads</div>
            <h2 className="display">{dialog.title}</h2>
            <p>{dialog.text}</p>
            <button className="btn btn-gold acct-ok" onClick={() => setDialog(null)}>
              OK
            </button>
          </div>
        </Modal>
      )}
    </AccountContext>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="acct-scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="acct-dialog" role="dialog" aria-modal="true" aria-label={title}>
        <button className="acct-x" onClick={onClose} aria-label="Close">
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

/** Email, then the code the app's sign-in also sends (6–10 digits, per the Supabase setting). */
export function SignInForm({ reason, onDone }: { reason?: string; onDone?: () => void }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } });
    setBusy(false);
    if (err) setError(err.message.includes("rate") ? "Too many tries. Wait a minute and try again." : "That didn't work. Check the email address.");
    else setSent(true);
  };
  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: "email" });
    setBusy(false);
    if (err) setError("That code didn't work. Check it, or send a new one.");
    else onDone?.();
  };

  return (
    <div className="acct-form">
      <div className="eyebrow mono">GoSquare account</div>
      <h2 className="display">{sent ? "Check your email" : "Sign in"}</h2>
      <p>
        {sent
          ? `We sent a sign-in code to ${email.trim()}. Enter it here.`
          : (reason ?? "One account for squaredrum.com and the GoSquare app: your likes, playlists and artists, everywhere.")}
      </p>
      {sent ? (
        <form onSubmit={verify}>
          <input
            className="acct-input mono"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6,10}"
            maxLength={10}
            placeholder="Code from the email"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            autoFocus
            aria-label="Sign-in code"
          />
          <button className="btn btn-gold" disabled={busy || code.length < 6}>
            {busy ? "Checking…" : "Sign in"}
          </button>
          <button type="button" className="acct-link mono" onClick={() => (setSent(false), setCode(""))}>
            Use a different email
          </button>
        </form>
      ) : (
        <form onSubmit={send}>
          <input
            className="acct-input"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            aria-label="Email"
          />
          <button className="btn btn-gold" disabled={busy || !email.includes("@")}>
            {busy ? "Sending…" : "Email me a code"}
          </button>
        </form>
      )}
      {error && <p className="acct-error">{error}</p>}
      <p className="acct-small mono">
        New here? The code creates your account. <Link href="/gosquare/privacy">Privacy</Link>
      </p>
    </div>
  );
}

function SignInDialog({ reason, onClose }: { reason?: string; onClose: () => void }) {
  return (
    <Modal title="Sign in" onClose={onClose}>
      <SignInForm reason={reason} onDone={onClose} />
    </Modal>
  );
}

function PlaylistDialog({ songId, onClose }: { songId: string; onClose: () => void }) {
  const a = useAccount();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <Modal title="Add to playlist" onClose={onClose}>
      <div className="acct-form">
        <div className="eyebrow mono">Add to playlist</div>
        <ul className="acct-lists">
          {a.playlists.map((p) => {
            const has = p.songIds.includes(songId);
            return (
              <li key={p.id}>
                <button
                  disabled={has || busy}
                  onClick={async () => {
                    setBusy(true);
                    await a.addToPlaylist(p.id, songId);
                    onClose();
                  }}
                >
                  <b>{p.name}</b>
                  <span className="mono">{has ? "Already in" : `${p.songIds.length} songs`}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!name.trim()) return;
            setBusy(true);
            await a.createPlaylist(name, songId);
            onClose();
          }}
        >
          <input className="acct-input" placeholder="New playlist name" maxLength={100} value={name} onChange={(e) => setName(e.target.value)} aria-label="New playlist name" />
          <button className="btn btn-gold" disabled={busy || !name.trim()}>
            Create
          </button>
        </form>
      </div>
    </Modal>
  );
}

const Heart = ({ on }: { on: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"
      fill={on ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

/** Like, add to playlist and download, for one song in a track list. */
export function SongActions({ song }: { song: DownloadSong }) {
  const a = useAccount();
  const on = a.liked.has(song.id);
  const [saving, setSaving] = useState(false);
  return (
    <span className="acts">
      <button className={on ? "on" : undefined} onClick={() => a.toggleLike(song.id)} aria-label={on ? `Unlike ${song.title}` : `Like ${song.title}`} aria-pressed={on}>
        <Heart on={on} />
      </button>
      <button onClick={() => a.pickPlaylist(song.id)} aria-label={`Add ${song.title} to a playlist`}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      <button
        disabled={saving}
        onClick={async () => {
          setSaving(true);
          await a.download(song);
          setSaving(false);
        }}
        aria-label={`Download ${song.title}`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </span>
  );
}

export function FollowButton({ artistId, name }: { artistId: string; name: string }) {
  const a = useAccount();
  // Hidden until the follows table exists (it needs a SQL step), except to prompt sign-in.
  if (a.signedIn && !a.followsOn) return null;
  const on = a.follows.has(artistId);
  return (
    <button className={`chip chip-follow${on ? " on" : ""}`} onClick={() => a.toggleFollow(artistId)} aria-pressed={on} aria-label={on ? `Unfollow ${name}` : `Follow ${name}`}>
      {on ? "Following" : "+ Follow"}
    </button>
  );
}

/**
 * Free downloads, on release and artist pages: an invitation to sign in for
 * listeners who aren't, and how many are left this week for those who are.
 * Shows nothing until sign-in is known, so it never flashes the wrong one.
 */
export function DownloadsChip({ className = "chip chip-dl" }: { className?: string }) {
  const a = useAccount();
  if (!a.ready) return null;
  if (!a.signedIn)
    return (
      <button className={className} onClick={() => a.askSignIn(`Sign in to download songs. It's free: up to ${DOWNLOADS_PER_WEEK} a week.`)}>
        ↓ Free downloads · Sign in
      </button>
    );
  if (a.downloadsUsed === null) return null;
  const left = Math.max(0, DOWNLOADS_PER_WEEK - a.downloadsUsed);
  return (
    <Link className={className} href="/account" title="Tap ↓ next to any song to download it">
      ↓ {left} of {DOWNLOADS_PER_WEEK} left this week
    </Link>
  );
}

/** The nav's account link: "Sign in", or the listener's initial once signed in. */
export function AccountLink({ className }: { className?: string }) {
  const a = useAccount();
  if (!a.ready) return null;
  if (!a.signedIn)
    return (
      <button className={className} onClick={() => a.askSignIn()}>
        Sign in
      </button>
    );
  return (
    <Link className={className} href="/account" aria-label="Your account">
      <span className="acct-dot">{(a.email ?? "?")[0].toUpperCase()}</span>
    </Link>
  );
}
