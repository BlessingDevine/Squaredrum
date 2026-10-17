"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DOWNLOADS_PER_WEEK, SignInForm, useAccount } from "@/components/account";
import { PlayButton, type Row, TrackList } from "@/components/play";

type ArtistCard = { id: string; slug: string; name: string; genre: string | null; portrait: string | null };

/** Liked songs, playlists and followed artists: the same library as in GoSquare. */
export function AccountPage() {
  const a = useAccount();
  const [songs, setSongs] = useState<Map<string, Row>>(new Map());
  const [artists, setArtists] = useState<ArtistCard[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  const songIds = [...new Set([...a.liked, ...a.playlists.flatMap((p) => p.songIds)])];
  const key = songIds.join(",") + "|" + [...a.follows].join(",");
  useEffect(() => {
    if (!a.signedIn || key === "|") return;
    let live = true;
    fetch(`/api/library?songs=${songIds.join(",")}&artists=${[...a.follows].join(",")}`)
      .then((r) => r.json())
      .then((d: { songs: Row[]; artists: ArtistCard[] }) => {
        if (!live) return;
        setSongs(new Map(d.songs.map((s) => [s.id, s])));
        setArtists(d.artists);
      });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a.signedIn, key]);

  if (!a.ready) return <main className="sec wrap acct-page" />;
  if (!a.signedIn)
    return (
      <main className="sec wrap acct-page">
        <div className="acct-signin">
          <SignInForm />
        </div>
      </main>
    );

  const rows = (ids: string[]) => ids.flatMap((id) => (songs.has(id) ? [songs.get(id)!] : []));
  const liked = rows([...a.liked]);

  return (
    <main className="sec wrap acct-page">
      <div className="eyebrow mono">GoSquare account</div>
      <h1 className="display acct-title">Your library</h1>
      <p className="acct-who mono">
        {a.email} ·{" "}
        <button className="acct-link" onClick={() => a.signOut()}>
          Sign out
        </button>
      </p>
      <p className="acct-who mono">Same account, likes and playlists as the GoSquare app</p>
      {a.downloadsUsed !== null && (
        <p className="acct-who mono">
          Downloads this week: {a.downloadsUsed} of {DOWNLOADS_PER_WEEK}
        </p>
      )}

      <section className="acct-sec">
        <div className="group-title">
          <h2 className="display">Liked songs</h2>
          <span className="mono">{a.liked.size}</span>
        </div>
        {liked.length ? (
          <>
            <PlayButton items={liked} label="Play liked songs" />
            <TrackList rows={liked} />
          </>
        ) : (
          <p className="acct-empty mono">Tap the heart on any song to keep it here.</p>
        )}
      </section>

      <section className="acct-sec">
        <div className="group-title">
          <h2 className="display">Playlists</h2>
          <span className="mono">{a.playlists.length}</span>
        </div>
        {a.playlists.length ? (
          <ul className="acct-plist">
            {a.playlists.map((p) => {
              const r = rows(p.songIds);
              const isOpen = open === p.id;
              return (
                <li key={p.id}>
                  <div className="acct-prow">
                    <button className="acct-pname" onClick={() => setOpen(isOpen ? null : p.id)} aria-expanded={isOpen}>
                      <b>{p.name}</b>
                      <span className="mono">{p.songIds.length} songs</span>
                    </button>
                    <span className="acct-pbtns mono">
                      <button
                        onClick={() => {
                          const n = prompt("Rename playlist", p.name);
                          if (n?.trim()) a.renamePlaylist(p.id, n);
                        }}
                      >
                        Rename
                      </button>
                      <button onClick={() => confirm(`Delete "${p.name}"?`) && a.deletePlaylist(p.id)}>Delete</button>
                    </span>
                  </div>
                  {isOpen &&
                    (r.length ? (
                      <div className="acct-pbody">
                        <PlayButton items={r} label="Play" />
                        <TrackList rows={r} />
                        <ul className="acct-remove mono">
                          {r.map((s) => (
                            <li key={s.id}>
                              <button onClick={() => a.removeFromPlaylist(p.id, s.id)}>Remove “{s.title}”</button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="acct-empty mono">Empty. Use the + on any song to add it.</p>
                    ))}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="acct-empty mono">Use the + on any song to start a playlist.</p>
        )}
      </section>

      {a.followsOn && (
        <section className="acct-sec">
          <div className="group-title">
            <h2 className="display">Following</h2>
            <span className="mono">{a.follows.size}</span>
          </div>
          {artists.length ? (
            <ul className="acct-artists">
              {artists.map((ar) => (
                <li key={ar.id}>
                  <Link href={`/artists/${ar.slug}`}>
                    {ar.portrait ? <img src={ar.portrait} alt="" loading="lazy" /> : <span className="acct-noimg" />}
                    <b>{ar.name}</b>
                    {ar.genre && <span className="mono">{ar.genre}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="acct-empty mono">Follow artists from their pages.</p>
          )}
        </section>
      )}
    </main>
  );
}
