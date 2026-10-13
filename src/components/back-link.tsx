"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// How many pages of this site the visitor has seen in this tab since the page
// last loaded. document.referrer can't tell (it doesn't change on in-app
// navigation), so <NavTracker /> in the layout counts route changes.
const KEY = "sd:pages";
let loaded = false;

export function NavTracker() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      const n = loaded ? Number(sessionStorage.getItem(KEY) ?? 0) + 1 : 1;
      loaded = true;
      sessionStorage.setItem(KEY, String(n));
    } catch {}
  }, [pathname]);
  return null;
}

/**
 * "← Back" to wherever the visitor came from on this site (the home page's
 * New releases, an artist page, a label…), scroll position included.
 * Arriving straight from outside the site, it goes to `fallback` instead.
 * Once the link scrolls out of view, a round floating arrow takes its place
 * just under the header, so the way back is always one tap away.
 */
export function BackLink({ fallback, label = "Back" }: { fallback: string; label?: string }) {
  const router = useRouter();
  const inline = useRef<HTMLAnchorElement>(null);
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const el = inline.current;
    if (!el) return;
    // The header is ~72px tall; count the link as gone once it slides under it.
    const io = new IntersectionObserver(([e]) => setFloating(!e.isIntersecting), { rootMargin: "-80px 0px 0px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const goBack = (e: React.MouseEvent) => {
    let seen = 0;
    try {
      seen = Number(sessionStorage.getItem(KEY) ?? 0);
    } catch {}
    if (seen > 1) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <>
      <Link ref={inline} href={fallback} className="back-link" onClick={goBack}>
        ← {label}
      </Link>
      <Link
        href={fallback}
        className={`back-float${floating ? " on" : ""}`}
        onClick={goBack}
        aria-label={label}
        aria-hidden={!floating}
        tabIndex={floating ? 0 : -1}
      >
        ←
      </Link>
    </>
  );
}
