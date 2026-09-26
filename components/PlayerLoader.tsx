'use client';

import type { SpotifyTrack } from '@/lib/use-spotify';

// Fills the player's slot while Spotify's embed loads: the cover blurred into a colour wash
// behind a moving equalizer, so there's never an empty white box. The player fades in over it.
export default function PlayerLoader({ track }: { track?: SpotifyTrack }) {
  const art = track?.albumImageUrl;
  return (
    <div className="relative grid h-full place-items-center overflow-hidden rounded-xl bg-[#18181A]">
      <span className="absolute inset-0 scale-125 bg-cover bg-center opacity-70 blur-2xl" style={{ backgroundImage: art ? `url(${art})` : undefined }} />
      <span className="relative flex h-10 items-end gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="animate-bar w-1.5 origin-bottom rounded-full bg-white/90"
            style={{ height: '100%', ['--bar-duration' as string]: `${(0.7 + i * 0.13).toFixed(2)}s`, ['--bar-delay' as string]: `${(i * 0.09).toFixed(2)}s` }}
          />
        ))}
      </span>
    </div>
  );
}
