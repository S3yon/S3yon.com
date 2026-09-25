'use client';

import { useSpotify } from '@/lib/use-spotify';

// A record whose label is the album art. It spins only while a track is actually playing,
// the tonearm swings onto it, and on hover the sleeve slides out behind it.
export default function VinylPlayer() {
  const { data } = useSpotify();
  if (!data?.title) return null;
  const playing = data.isPlaying;
  return (
    <a href={data.songUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-5">
      <span className="relative block h-28 w-28 shrink-0">
        {/* sleeve */}
        <span
          className="absolute inset-0 rounded-[4px] bg-cover shadow-lg transition-transform duration-500 ease-out group-hover:-translate-x-10"
          style={{ backgroundImage: `url(${data.albumImageUrl})` }}
        />
        {/* record */}
        <span
          className={`absolute inset-0 grid place-items-center rounded-full shadow-[0_8px_24px_-8px_rgba(0,0,0,0.8)] ${playing ? 'animate-spin-record' : ''}`}
          style={{ background: 'repeating-radial-gradient(circle, #111 0 1.5px, #1c1c1c 1.5px 3px)' }}
        >
          <span className="block h-11 w-11 rounded-full bg-cover ring-2 ring-black" style={{ backgroundImage: `url(${data.albumImageUrl})` }} />
          <span className="absolute h-1.5 w-1.5 rounded-full bg-charcoal" />
        </span>
        {/* tonearm */}
        <span
          className="absolute -right-3 -top-2 h-20 w-1 origin-top rounded-full bg-chalk/70 transition-transform duration-700"
          style={{ transform: playing ? 'rotate(24deg)' : 'rotate(4deg)' }}
        >
          <span className="absolute -bottom-1 -left-1 h-3 w-3 rounded-sm bg-chalk/80" />
        </span>
      </span>
      <span className="min-w-0">
        <span className="block font-display text-[11px] tracking-[0.2em] text-chalk/45">{playing ? 'NOW PLAYING' : 'LAST PLAYED'}</span>
        <span className="mt-1 block truncate text-[16px] text-chalk">{data.title}</span>
        <span className="block truncate text-[13.5px] text-chalk/50">{data.artist}</span>
      </span>
    </a>
  );
}
