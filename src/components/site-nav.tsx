"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { RADIO_URL, SOCIAL } from "@/lib/config";

const LINKS = [
  { href: "/imprints", label: "Imprints" },
  { href: "/artists", label: "Artists" },
  { href: "/releases", label: "Releases" },
  { href: "/about", label: "About" },
];

const MENU = [
  ...LINKS,
  { href: "/work-with-us", label: "Work with us" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

/**
 * On the home page the nav sits over the split hero (dark logo on the white
 * side, white links on the black side). Everywhere else it is a black bar.
 */
export function SiteNav() {
  const path = usePathname();
  // The menu remembers the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === path;
  const setOpen = (v: boolean) => setOpenOn(v ? path : null);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);
  const here = (href: string) => (path === href || path.startsWith(`${href}/`) ? "page" : undefined);

  const menu = open && (
    <div className="menu" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="menu-top">
        <Link href="/">
          <img src="/brand/squaredrum-horizontal-dark.svg" alt="SQUAREDRUM" />
        </Link>
        <button className="menu-close" onClick={() => setOpen(false)} aria-label="Close menu">
          ✕
        </button>
      </div>
      <nav className="menu-links">
        {MENU.map((l) => (
          <Link key={l.href} href={l.href} aria-current={here(l.href)}>
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="menu-foot mono">
        <a href={RADIO_URL}>
          <span className="live-dot" />
          Musicsquare Radio
        </a>
        <a href={SOCIAL.instagram}>Instagram</a>
        <a href={SOCIAL.youtube}>YouTube</a>
      </div>
    </div>
  );

  if (path === "/") {
    return (
      <>
        <nav className="nav nav-home" aria-label="Main">
          <div className="nav-left">
            <Link href="/">
              <img src="/brand/squaredrum-horizontal-light.svg" alt="SQUAREDRUM" />
            </Link>
            <div className="nav-links mono">
              <Link href="/imprints">
                Imprints <span className="gold">+</span>
              </Link>
              <Link href="/artists">Artists</Link>
              <Link href="/releases">Releases</Link>
              <Link href="/about">About</Link>
            </div>
          </div>
          <div className="nav-right mono">
            <a href="#onair" className="hide-m">
              <span className="live-dot" />
              Radio · Live
            </a>
            <a href="#gosquare" className="hide-m">
              GoSquare App
            </a>
            <Link href="/work-with-us" className="hide-m">
              Work with us
            </Link>
            <button className="menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">
              <span />
            </button>
          </div>
        </nav>
        {menu}
      </>
    );
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-in wrap">
          <Link href="/">
            <img src="/brand/squaredrum-horizontal-dark.svg" alt="SQUAREDRUM" />
          </Link>
          <nav className="topbar-links mono" aria-label="Main">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} aria-current={here(l.href)}>
                {l.label}
              </Link>
            ))}
            <Link href="/work-with-us" className="hide-t" aria-current={here("/work-with-us")}>
              Work with us
            </Link>
            <button className="menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">
              <span />
            </button>
          </nav>
        </div>
      </header>
      {menu}
    </>
  );
}
