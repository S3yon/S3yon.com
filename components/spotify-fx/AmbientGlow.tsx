'use client';

import { useEffect, useState } from 'react';
import { useSpotify } from '@/lib/use-spotify';

// The cover takes on the colour of whatever is playing: the album art's dominant colour
// becomes a soft glow behind the name, breathing slowly while the track plays.
export default function AmbientGlow({ children }: { children?: React.ReactNode }) {
  const { data } = useSpotify();
  const [rgb, setRgb] = useState<[number, number, number] | null>(null);

  useEffect(() => {
    if (!data?.albumImageUrl) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = c.height = 24;
      const ctx = c.getContext('2d')!;
      ctx.drawImage(img, 0, 0, 24, 24);
      const px = ctx.getImageData(0, 0, 24, 24).data;
      // average the most saturated pixels so the glow isn't muddy grey
      const cand: [number, number, number, number][] = [];
      for (let i = 0; i < px.length; i += 4) {
        const [r, g, b] = [px[i], px[i + 1], px[i + 2]];
        const max = Math.max(r, g, b);
        const sat = max ? (max - Math.min(r, g, b)) / max : 0;
        cand.push([r, g, b, sat * (max / 255)]);
      }
      cand.sort((a, b) => b[3] - a[3]);
      const top = cand.slice(0, 60);
      const avg = [0, 1, 2].map((k) => Math.round(top.reduce((s, p) => s + p[k], 0) / top.length)) as [number, number, number];
      setRgb(avg);
    };
    img.src = data.albumImageUrl;
  }, [data?.albumImageUrl]);

  const color = rgb ? `rgba(${rgb.join(',')},0.55)` : 'rgba(180,80,42,0.35)';
  return (
    <div className="relative overflow-hidden rounded-3xl bg-charcoal px-8 py-16">
      <span
        aria-hidden
        className={`pointer-events-none absolute -left-24 -top-24 h-[420px] w-[520px] rounded-full blur-[90px] transition-colors duration-[1500ms] ${data?.isPlaying ? 'animate-live-breathe' : ''}`}
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
      />
      <div className="relative">
        {children}
        {data?.title && (
          <p className="mt-6 text-[13px] text-chalk/50">
            Tinted by <span className="text-chalk/80">{data.title}</span> · {data.artist}
          </p>
        )}
      </div>
    </div>
  );
}
