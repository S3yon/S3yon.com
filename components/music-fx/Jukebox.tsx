'use client';

import { AnimatePresence, motion } from 'motion/react';
import Pikachu from '../Pikachu';
import { useSpotify } from '@/lib/use-spotify';
import { trackUri, useSpotifyEmbed } from '@/lib/use-spotify-embed';

// 4 · Pikachu jukebox: tap Pikachu and it offers to play what Seyon's listening to. The
// player pops out above it in the navy-on-yellow frame from the mood portraits, and Pikachu
// vibes with notes while it plays.
export default function Jukebox() {
  const { data } = useSpotify();
  const { host, state, play, toggle } = useSpotifyEmbed({ height: 80 });
  const uri = trackUri(data?.songUrl);
  if (!data?.title || !uri) return null;
  const open = Boolean(state.uri);
  const vibing = open && !state.paused;
  return (
    <div className="relative h-[190px] w-[340px] max-w-full">
      <div className="absolute bottom-0 left-4 flex items-end gap-3">
        <button type="button" onClick={() => (open ? toggle() : play(uri))} aria-label={open ? 'Play or pause' : `Play ${data.title}`} className="relative block">
          <span className={`block ${vibing ? 'animate-[vibe_0.5s_ease-in-out_infinite]' : ''}`}>
            <Pikachu walking={false} facing="down" />
          </span>
          {vibing &&
            ['♪', '♫', '♪'].map((n, k) => (
              <span key={k} aria-hidden className="absolute left-9 top-3 text-[14px] text-accent" style={{ animation: `note-float 2.4s ease-out ${k * 0.8}s infinite` }}>
                {n}
              </span>
            ))}
        </button>
        {!open && (
          <span className="mb-3 rounded-full border border-rule bg-paper px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-[0.14em] text-ink shadow-[0_6px_18px_-10px_rgba(0,0,0,0.35)]">
            Tap me: play his song
          </span>
        )}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
            style={{ originX: '48px', originY: 1 }}
            className="absolute bottom-[74px] left-0 h-[94px] w-[320px] max-w-full rounded-[10px] border-2 border-[#10061E] bg-[#F1C754] p-[5px] shadow-[0_12px_28px_-12px_rgba(0,0,0,0.5)]"
          >
            <span className="absolute -bottom-[8px] left-[48px] block h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-[#10061E] bg-[#F1C754]" />
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={host} className={`absolute bottom-[81px] left-[7px] z-10 w-[306px] max-w-[calc(100%-14px)] overflow-hidden rounded-md transition-opacity ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`} />
    </div>
  );
}
