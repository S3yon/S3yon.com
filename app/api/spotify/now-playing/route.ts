import { getNowPlaying, getRecentlyPlayed } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

/* eslint-disable @typescript-eslint/no-explicit-any */
const shape = (t: any) => ({
  title: t.name as string,
  artist: t.artists.map((a: any) => a.name).join(', ') as string,
  album: t.album.name as string,
  albumImageUrl: (t.album.images[1] ?? t.album.images[0])?.url as string,
  songUrl: t.external_urls.spotify as string,
});

// Current track (or the last one played), with progress for a live bar, plus the last few
// distinct tracks for a "recently played" view.
export async function GET() {
  try {
    const [nowRes, recentRes] = await Promise.all([getNowPlaying(), getRecentlyPlayed()]);

    const recentItems: any[] = recentRes.status === 200 ? (await recentRes.json()).items ?? [] : [];
    const seen = new Set<string>();
    const recent = recentItems
      .filter((i) => {
        const id = i.track?.id;
        if (!id || seen.has(id)) return false;
        seen.add(id);
        return true;
      })
      .slice(0, 6)
      .map((i) => ({ ...shape(i.track), playedAt: i.played_at as string }));

    const song = nowRes.status === 200 ? await nowRes.json() : null;
    if (song?.item && song.item.type === 'track') {
      return Response.json({
        ...shape(song.item),
        isPlaying: Boolean(song.is_playing),
        progressMs: song.progress_ms ?? 0,
        durationMs: song.item.duration_ms ?? 0,
        fetchedAt: Date.now(),
        recent,
      });
    }

    if (recent.length) {
      const { playedAt, ...last } = recent[0];
      return Response.json({ ...last, isPlaying: false, playedAt, recent });
    }
    return Response.json({ isPlaying: false, recent: [] });
  } catch (error) {
    console.error('Spotify API error:', error);
    return Response.json(
      { isPlaying: false, recent: [], error: error instanceof Error ? error.message : 'Failed to fetch Spotify data' },
      { status: 500 }
    );
  }
}
