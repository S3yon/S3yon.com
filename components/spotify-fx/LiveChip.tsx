'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { timeAgo, useSpotify } from '@/lib/use-spotify';

const fmt = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}`;

// A compact player: art, title, a progress bar that moves in real time, and an equalizer.
// Click to open the last few tracks.
export default function LiveChip() {
  const { data, progress } = useSpotify();
  const [open, setOpen] = useState(false);
  if (!data?.title) return null;
  const playing = data.isPlaying;
  return (
    <div className="relative w-[min(100%,340px)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-2xl border border-chalk/10 bg-white/[0.04] p-2.5 pr-4 text-left backdrop-blur transition-colors hover:bg-white/[0.07]"
      >
        <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cover" style={{ backgroundImage: `url(${data.albumImageUrl})` }} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 font-display text-[10.5px] tracking-[0.2em] text-[#1ED760]">
            {playing && (
              <span className="flex h-2.5 items-end gap-[2px]">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="animate-bar w-[2px] origin-bottom rounded-full bg-[#1ED760]" style={{ height: '100%', ['--bar-duration' as string]: `${(0.8 + i * 0.2).toFixed(2)}s` }} />
                ))}
              </span>
            )}
            {playing ? 'LISTENING NOW' : `LAST PLAYED ${timeAgo(data.playedAt).toUpperCase()}`}
          </span>
          <span className="mt-0.5 block truncate text-[14.5px] text-chalk">{data.title}</span>
          <span className="block truncate text-[12.5px] text-chalk/50">{data.artist}</span>
          {data.durationMs ? (
            <span className="mt-1.5 flex items-center gap-2 text-[10px] tabular-nums text-chalk/40">
              {fmt(progress * data.durationMs)}
              <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-chalk/15">
                <span className="absolute inset-y-0 left-0 rounded-full bg-chalk/80 transition-[width] duration-500 ease-linear" style={{ width: `${(progress * 100).toFixed(2)}%` }} />
              </span>
              {fmt(data.durationMs)}
            </span>
          ) : null}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full left-0 mb-2 w-full space-y-1 rounded-2xl border border-chalk/10 bg-[#18181A]/95 p-2 backdrop-blur"
          >
            <li className="px-2 pb-1 pt-1 font-display text-[10.5px] tracking-[0.2em] text-chalk/40">RECENTLY PLAYED</li>
            {data.recent.slice(0, 5).map((t) => (
              <li key={t.songUrl + t.playedAt}>
                <a href={t.songUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-white/5">
                  <span className="block h-8 w-8 shrink-0 rounded bg-cover" style={{ backgroundImage: `url(${t.albumImageUrl})` }} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] text-chalk">{t.title}</span>
                    <span className="block truncate text-[11.5px] text-chalk/45">{t.artist}</span>
                  </span>
                  <span className="shrink-0 text-[10.5px] text-chalk/35">{timeAgo(t.playedAt)}</span>
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
