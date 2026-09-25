'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import Reveal from './Reveal';
import { timeAgo, type SpotifyState } from '@/lib/use-spotify';

// "On rotation": the last six tracks as a crate of records on the rail. Hover (or tap) to
// fan them out and read each one; the marker is a small record that spins while music plays.
export default function OnRotation({ spotify }: { spotify: SpotifyState | null }) {
  const [hover, setHover] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const crate = useRef<HTMLDivElement>(null);
  const [room, setRoom] = useState(480);

  const covers = spotify?.recent ?? [];
  const hasCovers = covers.length > 0;

  // measure the space the crate can fan into (re-run once covers exist and the crate mounts)
  useEffect(() => {
    const el = crate.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(() => setRoom(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [hasCovers]);

  if (!covers.length) return null;
  const playing = spotify?.isPlaying;
  const size = 88;
  // fanned spacing shrinks to fit narrow screens
  const step = Math.max(12, Math.min(76, (room - size) / Math.max(1, covers.length - 1)));
  const shown = hover !== null ? covers[hover] : covers[0];
  const status = hover === null || hover === 0 ? (playing ? 'playing now' : timeAgo(shown.playedAt)) : timeAgo(shown.playedAt);

  return (
    <Reveal>
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
          <div
            ref={crate}
            className="relative h-[88px] transition-[width] duration-500 ease-out"
            style={{ width: open ? size + step * (covers.length - 1) : size + 50 }}
            onPointerEnter={() => setOpen(true)}
            onPointerLeave={() => {
              setOpen(false);
              setHover(null);
            }}
          >
            {covers.map((t, i) => (
              <motion.a
                key={t.songUrl + i}
                href={t.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.title} by ${t.artist}`}
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
              />
            ))}
          </div>
          <p className="mt-4 truncate font-heading text-[17px] font-extrabold leading-snug sm:text-[19px]">{shown.title}</p>
          <p className="truncate text-[14px] text-muted">
            {shown.artist} · {status}
          </p>
        </div>
      </article>
    </Reveal>
  );
}
