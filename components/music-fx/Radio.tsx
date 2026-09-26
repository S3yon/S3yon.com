'use client';

import { useState } from 'react';
import { useSpotify } from '@/lib/use-spotify';
import { trackUri, useSpotifyEmbed } from '@/lib/use-spotify-embed';

// 3 · Radio: one "Tune in" button plays your last six tracks in order, moving to the next
// when each ends. The queue shows what's on now and what's next.
export default function Radio() {
  const { data } = useSpotify();
  const covers = data?.recent ?? [];
  const [i, setI] = useState(-1);
  const { host, state, play } = useSpotifyEmbed({
    height: 152,
    onEnded: () => {
      const n = (i + 1) % covers.length;
      setI(n);
      play(trackUri(covers[n].songUrl)!);
    },
  });
  if (!covers.length) return null;
  const start = (n: number) => {
    setI(n);
    play(trackUri(covers[n].songUrl)!);
  };
  return (
    <div className="grid max-w-[720px] gap-5 sm:grid-cols-[1fr_260px]">
      <div>
        {i < 0 ? (
          <button type="button" onClick={() => start(0)} className="flex h-[152px] w-full items-center justify-center gap-3 rounded-xl border border-dashed border-rule text-ink transition-colors hover:border-accent hover:text-accent">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            <span className="font-heading text-[12px] font-bold uppercase tracking-[0.16em]">Tune in to my last six</span>
          </button>
        ) : null}
        <div ref={host} className={`${i < 0 ? 'hidden' : ''} overflow-hidden rounded-xl`} />
      </div>
      <ol className="space-y-1.5">
        {covers.map((t, n) => (
          <li key={t.songUrl + n}>
            <button type="button" onClick={() => start(n)} className={`flex w-full items-center gap-2.5 rounded-lg p-1 text-left transition-colors hover:bg-ink/5 ${n === i ? 'bg-ink/[0.06]' : ''}`}>
              <span className="block h-8 w-8 shrink-0 rounded bg-cover" style={{ backgroundImage: `url(${t.albumImageUrl})` }} />
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-[13px] ${n === i ? 'font-semibold text-accent' : 'text-ink'}`}>{t.title}</span>
                <span className="block truncate text-[11.5px] text-faint">{t.artist}</span>
              </span>
              {n === i && !state.paused && <span className="text-[11px] text-accent">♪</span>}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
