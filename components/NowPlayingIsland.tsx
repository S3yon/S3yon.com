'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { timeAgo, useSpotify } from '@/lib/use-spotify';

const MORPH = { type: 'spring', bounce: 0, visualDuration: 0.35 } as const;
// The load-in stretch from dot to pill: a touch of bounce, like the island waking on iPhone.
const BOOT = { type: 'spring', bounce: 0.28, visualDuration: 0.5 } as const;
// When the dot pops in (matches the intro stagger), and how long it sits before stretching.
const APPEAR_MS = 1600;
const DOT_HOLD_MS = 460; // after the 420ms pop finishes, so layout measures an unscaled dot

const fmt = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

// Equalizer: moves only while a track is actually playing (off under reduced motion, globals.css).
function Bars({ playing, big = false }: { playing: boolean; big?: boolean }) {
  const rest = [40, 70, 55, 30];
  return (
    <span aria-hidden className={`flex shrink-0 items-end gap-[3px] ${big ? 'h-4' : 'h-3'}`}>
      {rest.map((h, i) => (
        <span
          key={i}
          className={`w-[3px] origin-bottom rounded-full bg-chalk/80 ${playing ? 'animate-bar' : ''}`}
          style={
            {
              height: playing ? '100%' : `${h}%`,
              '--bar-duration': `${(0.8 + i * 0.17).toFixed(2)}s`,
              '--bar-delay': `${(i * 0.13).toFixed(2)}s`,
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
export default function NowPlayingIsland() {
  const { data: track, progress } = useSpotify();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const lastPointer = useRef('');
  const closeT = useRef(0);

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

  // Load-in: the island pops in as a black dot, then stretches into the pill. Reduced motion
  // skips the dot and the plain fade-in shows the pill straight away.
  const reduce = useReducedMotion();
  const hasTrack = Boolean(track?.title);
  const [booted, setBooted] = useState(false);
  const morph = booted ? MORPH : BOOT;
  useEffect(() => {
    if (!hasTrack || booted) return;
    if (reduce) return setBooted(true);
    const t = window.setTimeout(() => setBooted(true), APPEAR_MS + DOT_HOLD_MS);
    return () => window.clearTimeout(t);
  }, [hasTrack, booted, reduce]);
  useEffect(() => {
    if (open) setBooted(true);
  }, [open]);

  // Nothing from Spotify: no slot. Still loading: keep the slot so the row doesn't jump.
  if (track && !track.title) return null;

  const playing = Boolean(track?.isPlaying);
  const label = playing ? 'NOW PLAYING' : 'LAST PLAYED';
  const dur = track?.durationMs ?? 0;

  return (
    <div className="relative h-10">
      {track?.title && (
        <MotionConfig reducedMotion="user">
          <div
            ref={wrap}
            className="animate-island-in absolute bottom-0 left-0 z-10"
            style={{ animationDelay: `${APPEAR_MS}ms` }}
            onPointerEnter={(e) => {
              if (e.pointerType !== 'mouse') return;
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
              if ((e.target as Element).closest('a')) return;
              if (lastPointer.current === 'mouse') setOpen(true);
              else setOpen((o) => !o);
              lastPointer.current = '';
            }}
          >
            <motion.div
              layout
              data-island={open ? 'open' : 'closed'}
              transition={morph}
              initial={false}
              animate={{ borderRadius: open ? 30 : 20 }}
              style={{ borderRadius: 20 }}
              className="overflow-hidden bg-black text-chalk shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.06]"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {open ? (
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
                ) : !booted ? (
                  <motion.div key="dot" layout exit={{ opacity: 0, transition: { duration: 0.05 } }}>
                    <span aria-hidden className="block h-10 w-10" />
                  </motion.div>
                ) : (
                  <motion.div key="pill" layout initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.12, duration: 0.22 } }} exit={{ opacity: 0, transition: { duration: 0.08 } }}>
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
          </div>
        </MotionConfig>
      )}
    </div>
  );
}
