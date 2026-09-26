'use client';

import { useSpotify } from '@/lib/use-spotify';
import { trackUri, useSpotifyEmbed } from '@/lib/use-spotify-embed';

// 1 · Crate player: each cover in On rotation gets a play button; the Spotify player slides
// open right under the crate with that track.
export default function CratePlay() {
  const { data } = useSpotify();
  const { host, state, play } = useSpotifyEmbed({ height: 80 });
  const covers = data?.recent ?? [];
  if (!covers.length) return null;
  return (
    <div className="max-w-[560px]">
      <div className="flex gap-3">
        {covers.map((t) => {
          const uri = trackUri(t.songUrl)!;
          const on = state.uri === uri;
          return (
            <button
              key={t.songUrl + t.playedAt}
              type="button"
              onClick={() => play(uri)}
              aria-label={`Play ${t.title} by ${t.artist}`}
              className={`group relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-cover shadow-[0_10px_24px_-10px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-1 ${on ? 'ring-2 ring-accent' : ''}`}
              style={{ backgroundImage: `url(${t.albumImageUrl})` }}
            >
              <span className={`absolute inset-0 grid place-items-center bg-black/35 transition-opacity ${on && !state.paused ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </button>
          );
        })}
      </div>
      <div ref={host} className={`${state.uri ? 'mt-4' : 'hidden'} overflow-hidden rounded-xl`} />
    </div>
  );
}
