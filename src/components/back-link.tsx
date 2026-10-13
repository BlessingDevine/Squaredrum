"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

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
 */
export function BackLink({ fallback, label = "Back" }: { fallback: string; label?: string }) {
  const router = useRouter();
  return (
    <Link
      href={fallback}
      className="back-link"
      onClick={(e) => {
        let seen = 0;
        try {
          seen = Number(sessionStorage.getItem(KEY) ?? 0);
        } catch {}
        if (seen > 1) {
          e.preventDefault();
          router.back();
        }
      }}
    >
      ← {label}
    </Link>
  );
}
