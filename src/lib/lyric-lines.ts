/**
 * The lyric band on an artist's page: a few hand-picked lines from their songs
 * (approved by Robert), one shown at random on each visit. Lines are copied
 * from the lyric sheets as sung and kept family-friendly. An artist without
 * lines shows no band.
 */
export type LyricLine = { line: string; title: string };

export const LYRIC_LINES: Record<string, LyricLine[]> = {};
