/** The artist's Instagram, as a chip beside Play all. */
export function InstagramChip({ handle, name }: { handle: string | null; name: string }) {
  if (!handle) return null;
  return (
    <a
      className="chip chip-ig"
      href={instagramUrl(handle)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} on Instagram (@${handle})`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
      </svg>
      @{handle}
    </a>
  );
}

export const instagramUrl = (handle: string) => `https://www.instagram.com/${handle}/`;
