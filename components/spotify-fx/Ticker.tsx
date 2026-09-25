'use client';

import { useSpotify } from '@/lib/use-spotify';

// A radio-style ticker along the bottom of the cover: the track in huge outlined type,
// scrolling slowly. Fills in on hover; pauses when nothing is playing.
export default function Ticker() {
  const { data } = useSpotify();
  if (!data?.title) return null;
  const line = `${data.isPlaying ? 'NOW PLAYING' : 'LAST PLAYED'} — ${data.title.toUpperCase()} — ${data.artist?.toUpperCase()} — `;
  return (
    <a href={data.songUrl} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden whitespace-nowrap py-2" aria-label={`${data.title} by ${data.artist}`}>
      <span
        className="inline-block font-display text-[clamp(40px,7vw,96px)] leading-none text-transparent transition-colors duration-500 [-webkit-text-stroke:1px_rgba(200,199,195,0.35)] group-hover:text-chalk/80"
        style={{ animation: `ticker ${Math.max(18, line.length * 0.45).toFixed(0)}s linear infinite`, animationPlayState: data.isPlaying ? 'running' : 'paused' }}
      >
        {line}
        {line}
      </span>
    </a>
  );
}
