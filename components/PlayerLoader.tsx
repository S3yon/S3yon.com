'use client';

import Pikachu from './Pikachu';
import type { SpotifyTrack } from '@/lib/use-spotify';

export type LoaderKind = 'skeleton' | 'record' | 'pikachu' | 'eq';

// What fills the player's 300×152 slot while Spotify's embed loads. Built from the track we
// already have (cover, title), so there's never an empty white box.
export default function PlayerLoader({ kind, track }: { kind: LoaderKind; track?: SpotifyTrack }) {
  const art = track?.albumImageUrl;

  if (kind === 'skeleton') {
    // the Spotify card's shape, in the site's ink, with a light sweep across it
    return (
      <div className="relative flex h-full items-center gap-4 overflow-hidden rounded-xl bg-[#26262A] p-3">
        <span className="block h-[128px] w-[128px] shrink-0 rounded-lg bg-cover bg-center opacity-80" style={{ backgroundImage: art ? `url(${art})` : undefined }} />
        <span className="flex flex-1 flex-col gap-2.5">
          <span className="h-3.5 w-4/5 rounded-full bg-white/15" />
          <span className="h-3 w-1/2 rounded-full bg-white/10" />
          <span className="mt-6 h-7 w-7 self-end rounded-full bg-white/15" />
        </span>
        <span className="animate-[shimmer_1.3s_ease-in-out_infinite] absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    );
  }

  if (kind === 'record') {
    // the record comes out of its sleeve and spins until the player is ready
    return (
      <div className="relative flex h-full items-center gap-5 overflow-hidden rounded-xl bg-[#18181A] px-5">
        <span className="relative mr-12 block h-[112px] w-[112px] shrink-0">
          <span className="absolute inset-0 rounded-md bg-cover shadow-lg" style={{ backgroundImage: art ? `url(${art})` : undefined }} />
          <span
            className="animate-[slide-spin_1.2s_linear_infinite] absolute inset-0 grid place-items-center rounded-full"
            style={{ background: 'repeating-radial-gradient(circle, #111 0 1.5px, #1c1c1c 1.5px 3px)' }}
          >
            <span className="block h-10 w-10 rounded-full bg-cover ring-2 ring-black" style={{ backgroundImage: art ? `url(${art})` : undefined }} />
          </span>
        </span>
        <span className="min-w-0 font-display text-[11px] tracking-[0.22em] text-chalk/60">
          CUEING UP
          <span className="mt-1 block truncate font-sans text-[14px] tracking-normal text-chalk">{track?.title}</span>
        </span>
      </div>
    );
  }

  if (kind === 'pikachu') {
    // Pikachu runs on the spot, fetching the track
    return (
      <div className="relative flex h-full items-center gap-4 overflow-hidden rounded-xl border border-rule bg-paper px-4">
        <span className="relative block h-16 w-16 shrink-0">
          <Pikachu walking fast facing="right" />
        </span>
        <span className="min-w-0">
          <span className="block font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-accent">Fetching…</span>
          <span className="mt-1 block truncate text-[14px] text-ink">{track?.title}</span>
          <span className="mt-2 flex gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-accent" style={{ animation: `pika-dot 0.9s ease-in-out ${i * 0.15}s infinite` }} />
            ))}
          </span>
        </span>
      </div>
    );
  }

  // eq: the cover blurred behind a live equalizer
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
