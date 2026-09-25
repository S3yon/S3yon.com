'use client';

import { useState } from 'react';
import { timeAgo, useSpotify } from '@/lib/use-spotify';

// "On rotation": the last six covers stacked like records in a crate, fanning out on hover.
// Hover a cover to read it; the first one is what's playing (or played last).
export default function RecentFan() {
  const { data } = useSpotify();
  const [hover, setHover] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const covers = data?.recent ?? [];
  if (!covers.length) return null;
  const shown = hover !== null ? covers[hover] : covers[0];
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
      <div
        className="relative h-24 shrink-0 transition-[width] duration-500 ease-out"
        style={{ width: open ? `${covers.length * 76}px` : '150px' }}
        onPointerEnter={() => setOpen(true)}
        onPointerLeave={() => {
          setOpen(false);
          setHover(null);
        }}
      >
        {covers.map((t, i) => (
          <a
            key={t.songUrl + i}
            href={t.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            onPointerEnter={() => setHover(i)}
            className="absolute top-0 block h-24 w-24 rounded-md bg-cover shadow-[0_10px_24px_-10px_rgba(0,0,0,0.5)] ring-1 ring-black/5 transition-all duration-500 ease-out"
            style={{
              backgroundImage: `url(${t.albumImageUrl})`,
              left: open ? i * 76 : i * 10,
              zIndex: covers.length - i,
              transform: open ? `translateY(${hover === i ? -8 : 0}px)` : `rotate(${(i - 2) * 3}deg)`,
            }}
          />
        ))}
      </div>
      <div className="min-w-0">
        <p className="font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-faint">On rotation</p>
        <p className="mt-1 truncate font-heading text-[19px] font-extrabold text-ink">{shown.title}</p>
        <p className="truncate text-[14px] text-muted">
          {shown.artist} · {hover === null || hover === 0 ? (data?.isPlaying ? 'playing now' : timeAgo(shown.playedAt)) : timeAgo(shown.playedAt)}
        </p>
      </div>
    </div>
  );
}
