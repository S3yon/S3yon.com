'use client';

import { useEffect, useState } from 'react';

interface Track {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  songUrl?: string;
}

// A quiet "now playing" line in the corner of the intro. Only the 12px indicator
// moves — nothing animates behind the headline.
export default function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch('/api/spotify/now-playing');
        setTrack(await res.json());
      } catch {
        setTrack({ isPlaying: false });
      }
    };
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!track?.title) return null;

  const playing = Boolean(track.isPlaying);

  return (
    <a
      href={track.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="animate-intro-fade group absolute bottom-7 left-6 z-10 flex max-w-[min(70vw,420px)] items-center gap-2.5 sm:bottom-9 sm:left-12"
      style={{ animationDelay: '1600ms' }}
    >
      <span className="flex h-3 items-end gap-[2px]" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`w-[2px] origin-bottom rounded-full bg-chalk/50 ${
              playing ? 'animate-bar' : ''
            }`}
            style={
              {
                height: playing ? '100%' : '30%',
                '--bar-duration': `${(0.9 + i * 0.25).toFixed(2)}s`,
                '--bar-delay': `${(i * 0.18).toFixed(2)}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </span>
      <span className="truncate font-display text-[11px] tracking-[0.18em] text-chalk/40 transition-colors group-hover:text-chalk/75">
        {playing ? 'NOW PLAYING' : 'LAST PLAYED'} — {track.title} · {track.artist}
      </span>
    </a>
  );
}
