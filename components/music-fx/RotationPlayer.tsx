'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { timeAgo, useSpotify } from '@/lib/use-spotify';
import { trackUri, useSpotifyEmbed } from '@/lib/use-spotify-embed';

// 5 · On rotation + square player: the existing crate, but clicking a cover plays it in a
// small square Spotify player that loads to the right of the crate.
// layout 'square': the track's cover art as a small square with Spotify's slim 80px player
// along its bottom edge. layout 'card': Spotify's standard 152px card, 300px wide.
export default function RotationPlayer({ layout = 'square' }: { layout?: 'square' | 'card' }) {
  const { data: spotify } = useSpotify();
  const { host, state, play } = useSpotifyEmbed({ height: layout === 'square' ? 80 : 152 });
  const [hover, setHover] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const crate = useRef<HTMLDivElement>(null);
  const [room, setRoom] = useState(480);

  const covers = spotify?.recent ?? [];
  const hasCovers = covers.length > 0;

  // measure the space the crate can fan into (re-run once covers exist and the crate mounts)
  useEffect(() => {
    // the row holding the crate and the touch button
    const el = crate.current?.parentElement?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(() => setRoom(el.clientWidth - (window.matchMedia('(hover: none)').matches ? 48 : 0)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [hasCovers]);

  if (!covers.length) return null;
  const playing = spotify?.isPlaying;
  const size = 88;
  // fanned spacing shrinks to fit narrow screens
  const step = Math.max(12, Math.min(76, (room - size) / Math.max(1, covers.length - 1)));
  const shown = hover !== null ? covers[hover] : covers[0];
  const current = covers.find((t) => trackUri(t.songUrl) === state.uri);
  const status = hover === null || hover === 0 ? (playing ? 'playing now' : timeAgo(shown.playedAt)) : timeAgo(shown.playedAt);

  return (
    <div>
      <article className="relative grid gap-1.5 pb-10 pl-12 sm:grid-cols-[6rem_1fr] sm:gap-8 sm:pl-16">
        {/* marker: a tiny record with the current cover as its label */}
        <span aria-hidden className="absolute left-0 top-0 z-10 h-9 w-9">
          <span
            className={`grid h-9 w-9 place-items-center rounded-full ${playing ? 'animate-spin-record' : ''}`}
            style={{ background: 'repeating-radial-gradient(circle, #111 0 1px, #232323 1px 2px)' }}
          >
            <span className="block h-3.5 w-3.5 rounded-full bg-cover ring-1 ring-black" style={{ backgroundImage: `url(${covers[0].albumImageUrl})` }} />
          </span>
        </span>
        <p className="font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-faint sm:pt-2">On rotation</p>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
          <div
            ref={crate}
            className="relative h-[88px] shrink-0 transition-[width] duration-500 ease-out"
            style={{ width: open ? size + step * (covers.length - 1) : size + 50 }}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
            onPointerLeave={(e) => {
              if (e.pointerType !== 'mouse') return;
              setOpen(false);
              setHover(null);
            }}
          >
            {covers.map((t, i) => (
              <motion.button
                type="button"
                key={t.songUrl + i}
                onClick={() => play(trackUri(t.songUrl)!)}
                aria-label={`Play ${t.title} by ${t.artist}`}
                onPointerEnter={() => setHover(i)}
                onFocus={() => {
                  setOpen(true);
                  setHover(i);
                }}
                className="absolute top-0 block rounded-md bg-cover shadow-[0_10px_24px_-10px_rgba(0,0,0,0.5)] ring-1 ring-black/5"
                style={{ backgroundImage: `url(${t.albumImageUrl})`, width: size, height: size, zIndex: covers.length - i }}
                initial={false}
                animate={{
                  x: open ? i * step : i * 10,
                  y: open && hover === i ? -8 : 0,
                  rotate: open ? 0 : (i - 2) * 3,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              >
                {state.uri === trackUri(t.songUrl) && (
                  <span className="absolute inset-0 rounded-md ring-2 ring-accent ring-offset-2 ring-offset-paper" />
                )}
                <span className="absolute inset-0 grid place-items-center rounded-md bg-black/35 opacity-0 transition-opacity hover:opacity-100">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                </span>
              </motion.button>
            ))}
          </div>
          {/* touch screens can't hover: a small button fans the crate out and back */}
          <button
            type="button"
            onClick={() => {
              setOpen((o) => !o);
              setHover(null);
            }}
            aria-expanded={open}
            aria-label={open ? 'Stack the albums' : 'Spread out the albums'}
            className="hidden h-9 w-9 shrink-0 place-items-center rounded-full border border-rule bg-paper text-muted shadow-[0_4px_12px_-8px_rgba(0,0,0,0.4)] transition-colors active:bg-ink/5 [@media(hover:none)]:grid"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300"
              style={{ transform: open ? 'rotate(180deg)' : 'none' }}
            >
              <path d="m9 6 6 6-6 6" />
            </svg>
          </button>
          {/* the player, to the right of the crate */}
          <div
            className={`relative shrink-0 overflow-hidden rounded-xl shadow-[0_12px_30px_-14px_rgba(0,0,0,0.5)] transition-[opacity,transform] duration-500 ${state.uri ? 'scale-100 opacity-100' : 'pointer-events-none scale-90 opacity-0'}`}
            style={{ width: layout === 'square' ? 184 : 300, height: layout === 'square' ? 184 : 152, display: state.uri ? undefined : 'none' }}
          >
            {layout === 'square' && current && (
              <span className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${current.albumImageUrl})` }} />
            )}
            <div ref={host} className={layout === 'square' ? 'absolute inset-x-0 bottom-0 h-20' : 'h-full w-full'} />
          </div>
          </div>
          <p className="mt-4 truncate font-heading text-[17px] font-extrabold leading-snug sm:text-[19px]">{shown.title}</p>
          <p className="truncate text-[14px] text-muted">
            {shown.artist} · {status}
          </p>
        </div>
      </article>
    </div>
  );
}
