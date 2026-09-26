'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useSpotify } from '@/lib/use-spotify';
import { trackUri, useSpotifyEmbed } from '@/lib/use-spotify-embed';

// 2 · Sticky dock: a "Listen along" button on the cover's now-playing line. It docks a small
// player in the bottom-right corner that stays with you while you scroll the whole site.
export default function Dock() {
  const { data } = useSpotify();
  const { host, state, play, stop } = useSpotifyEmbed({ height: 80 });
  const uri = trackUri(data?.songUrl);
  if (!data?.title || !uri) return null;
  const open = Boolean(state.uri);
  return (
    <>
      <button
        type="button"
        onClick={() => play(uri)}
        className="group inline-flex items-center gap-3 rounded-full border border-chalk/15 py-1.5 pl-1.5 pr-4 text-left transition-colors hover:border-chalk/40"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1ED760] text-black">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </span>
        <span className="font-display text-[11px] tracking-[0.2em] text-chalk/70 group-hover:text-chalk">
          LISTEN ALONG — {data.title.toUpperCase()}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-4 right-4 z-50 w-[min(92vw,360px)] rounded-2xl bg-[#18181A] p-2 shadow-[0_18px_50px_-15px_rgba(0,0,0,0.7)]"
          >
            <div className="mb-1.5 flex items-center justify-between px-1.5 pt-0.5 font-display text-[10.5px] tracking-[0.2em] text-chalk/50">
              <span>SEYON&apos;S RADIO</span>
              <button type="button" onClick={stop} aria-label="Pause" className="text-chalk/60 hover:text-chalk">
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* the embed lives in a fixed slot so it survives the dock animating */}
      <div
        ref={host}
        className={`fixed bottom-6 right-6 z-50 w-[calc(min(92vw,360px)-16px)] overflow-hidden rounded-xl transition-opacity ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
    </>
  );
}
