'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { timeAgo, useSpotify } from '@/lib/use-spotify';

const MORPH = { type: 'spring', bounce: 0, visualDuration: 0.35 } as const;

const fmt = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

// Equalizer: moves only while a track is actually playing. While loading, the bars rise one after
// another instead, left to right. Both are off under reduced motion (globals.css).
function Bars({ playing, loading = false, big = false }: { playing: boolean; loading?: boolean; big?: boolean }) {
  const rest = [40, 70, 55, 30];
  return (
    <span aria-hidden className={`flex shrink-0 items-end gap-[3px] ${big ? 'h-4' : 'h-3'}`}>
      {rest.map((h, i) => (
        <span
          key={i}
          className={`w-[3px] origin-bottom rounded-full bg-chalk/80 ${loading ? 'animate-bar-wait' : playing ? 'animate-bar' : ''}`}
          style={
            {
              height: playing || loading ? '100%' : `${h}%`,
              '--bar-duration': `${(0.8 + i * 0.17).toFixed(2)}s`,
              '--bar-delay': `${(i * (loading ? 0.14 : 0.13)).toFixed(2)}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  );
}

// The cover morphs from the pill into the card (shared layoutId). No crossfade: the pill fades out
// around it, and the shared-element crossfade otherwise holds the new cover near 0.08 opacity.
function Cover({ src, big }: { src?: string; big: boolean }) {
  const cls = big ? 'h-14 w-14' : 'h-7 w-7';
  const style = { borderRadius: big ? 12 : 14 };
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <motion.img layoutId="island-cover" layoutCrossfade={false} src={src} alt="" className={`${cls} shrink-0 object-cover`} style={style} transition={MORPH} />
  ) : (
    <motion.span layoutId="island-cover" layoutCrossfade={false} className={`${cls} shrink-0 bg-chalk/20`} style={style} transition={MORPH} />
  );
}

// Bottom-left of the cover: what Spotify is playing (or played last), as a Dynamic Island. A black
// pill (cover + bars) morphs into a card with a Motion layout animation: hover opens it with a
// mouse, a tap toggles it on touch, a tap outside or Escape closes it. The slot keeps the pill's
// height and the card grows up over the cover, so opening it never moves the layout. Reduced
// motion (MotionConfig "user") swaps pill and card without the morph; the fades stay.
// Before the first fetch returns, the island is a short capsule with the bars rising in turn; when
// the track arrives it widens into the pill and its grey dot becomes the cover. If Spotify has
// nothing, the capsule shrinks away and the slot goes.
export default function NowPlayingIsland() {
  const { data: track, progress } = useSpotify();
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const lastPointer = useRef('');
  const closeT = useRef(0);

  // a later poll can drop the track (close the card) or bring one back (show the island again)
  useEffect(() => {
    if (track?.title) setGone(false);
    else setOpen(false);
  }, [track?.title]);

  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      requestAnimationFrame(() => btn.current?.focus());
    };
    document.addEventListener('pointerdown', down);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('pointerdown', down);
      document.removeEventListener('keydown', key);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeT.current), []);

  // Nothing from Spotify, once the capsule has shrunk away: no slot. Loading: the capsule holds it.
  if (gone) return null;

  const playing = Boolean(track?.isPlaying);
  const label = playing ? 'NOW PLAYING' : 'LAST PLAYED';
  const dur = track?.durationMs ?? 0;

  return (
    <div className="relative h-10">
      <MotionConfig reducedMotion="user">
        <div
          ref={wrap}
          className="animate-intro-fade absolute bottom-0 left-0 z-10"
          style={{ animationDelay: '1600ms' }}
          onPointerEnter={(e) => {
            if (e.pointerType !== 'mouse' || !track?.title) return;
            window.clearTimeout(closeT.current);
            setOpen(true);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType !== 'mouse') return;
            closeT.current = window.setTimeout(() => setOpen(false), 160);
          }}
          onPointerDown={(e) => {
            lastPointer.current = e.pointerType;
          }}
          onClick={(e) => {
            if ((e.target as Element).closest('a') || !track?.title) return;
            if (lastPointer.current === 'mouse') setOpen(true);
            else setOpen((o) => !o);
            lastPointer.current = '';
          }}
        >
          <AnimatePresence initial={false} onExitComplete={() => setGone(true)}>
            {(!track || track.title) && (
              <motion.div
                key="island"
                layout
                data-island={!track ? 'loading' : open ? 'open' : 'closed'}
                transition={MORPH}
                initial={false}
                animate={{ borderRadius: open ? 30 : 20 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                style={{ borderRadius: 20, transformOrigin: '0% 50%' }}
                className="overflow-hidden bg-black text-chalk shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.06]"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {!track?.title ? (
                    <motion.div key="loading" layout exit={{ opacity: 0, transition: { duration: 0.08 } }}>
                      <span role="status" className="flex h-10 items-center gap-3 pl-1.5 pr-3.5">
                        <span className="sr-only">Loading what Seyon is listening to</span>
                        <Cover big={false} />
                        <Bars playing={false} loading />
                      </span>
                    </motion.div>
                  ) : open ? (
                    <motion.div
                      key="card"
                      layout
                      className="w-[min(340px,calc(100vw-48px))] p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.05, duration: 0.2 } }}
                      exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    >
                      <button
                        ref={btn}
                        type="button"
                        aria-expanded
                        aria-label={`${label.toLowerCase()}: ${track.title} by ${track.artist}. Close`}
                        className="flex w-full items-center gap-3.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-chalk/40"
                      >
                        <Cover src={track.albumImageUrl} big />
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-[10.5px] tracking-[0.2em] text-chalk/45">{label}</span>
                          <span className="mt-1 block truncate font-heading text-[16px] font-bold tracking-[-0.01em] text-chalk">{track.title}</span>
                          <span className="block truncate text-[13px] text-chalk/60">{track.artist}</span>
                        </span>
                        <Bars playing={playing} big />
                      </button>
                      {dur > 0 ? (
                        <div className="mt-4">
                          <div className="h-1 overflow-hidden rounded-full bg-chalk/15">
                            <div
                              data-progress
                              className="h-full origin-left rounded-full bg-chalk/85 transition-transform duration-500 ease-linear motion-reduce:transition-none"
                              style={{ transform: `scaleX(${progress.toFixed(3)})` }}
                            />
                          </div>
                          <div className="mt-1.5 flex justify-between text-[11px] tabular-nums text-chalk/45">
                            <span>{fmt(progress * dur)}</span>
                            <span>-{fmt((1 - progress) * dur)}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-3 text-[12px] text-chalk/45">Played {timeAgo(track.playedAt)}</p>
                      )}
                      {track.songUrl && (
                        <div className="mt-2.5">
                          <a
                            href={track.songUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group -my-2 inline-flex items-center gap-1.5 py-2 font-heading text-[11.5px] font-bold uppercase tracking-[0.16em] text-chalk/70 transition-colors hover:text-chalk"
                          >
                            <span className="border-b border-chalk/25 pb-0.5 transition-colors group-hover:border-chalk">Open in Spotify</span>
                            <span aria-hidden className="text-[13px] leading-none">↗</span>
                          </a>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="pill" layout initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.05, duration: 0.18 } }} exit={{ opacity: 0, transition: { duration: 0.08 } }}>
                      <button
                        ref={btn}
                        type="button"
                        aria-expanded={false}
                        aria-label={`${label.toLowerCase()}: ${track.title} by ${track.artist}. Open`}
                        className="flex h-10 items-center gap-10 pl-1.5 pr-4 outline-none focus-visible:ring-2 focus-visible:ring-chalk/40"
                      >
                        <Cover src={track.albumImageUrl} big={false} />
                        <Bars playing={playing} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MotionConfig>
    </div>
  );
}
