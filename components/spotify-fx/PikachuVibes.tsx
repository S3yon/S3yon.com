'use client';

import Pikachu from '../Pikachu';
import { useSpotify } from '@/lib/use-spotify';

// Pikachu listens along: while a track plays it bobs to a steady beat, music notes drift
// up, and a small card says what it's listening to. Idle when nothing plays.
export default function PikachuVibes() {
  const { data } = useSpotify();
  const playing = Boolean(data?.isPlaying);
  return (
    <div className="flex items-center gap-4">
      <span className="relative block h-16 w-16">
        <span className={`block ${playing ? 'animate-[vibe_0.5s_ease-in-out_infinite]' : ''}`}>
          <Pikachu walking={false} facing="down" />
        </span>
        {playing &&
          ['♪', '♫', '♪'].map((n, i) => (
            <span
              key={i}
              aria-hidden
              className="absolute left-8 top-2 text-[15px] text-accent"
              style={{ animation: `note-float 2.4s ease-out ${i * 0.8}s infinite` }}
            >
              {n}
            </span>
          ))}
      </span>
      {data?.title && (
        <a href={data.songUrl} target="_blank" rel="noopener noreferrer" className="flex min-w-0 items-center gap-2.5 rounded-full border border-rule bg-paper py-1.5 pl-1.5 pr-4 shadow-[0_6px_18px_-12px_rgba(0,0,0,0.4)]">
          <span className="block h-8 w-8 shrink-0 rounded-full bg-cover" style={{ backgroundImage: `url(${data.albumImageUrl})` }} />
          <span className="min-w-0 text-[13px] leading-tight">
            <span className="block truncate text-ink">{data.title}</span>
            <span className="block truncate text-faint">{playing ? `vibing to ${data.artist}` : `last vibed to ${data.artist}`}</span>
          </span>
        </a>
      )}
    </div>
  );
}
