'use client';

import { useEffect, useState } from 'react';

type Rgb = [number, number, number];

// The album cover, loaded and decoded before the island shows it, so the art never pops in or
// blanks mid-morph; a new track's cover replaces the old one only once it is ready. `settled`
// turns true once the current URL has loaded or failed.
// Also the cover's liveliest colour, lifted so it reads on black: what iOS does to the music
// waveform in the Dynamic Island. Spotify's image CDN sends CORS headers, so the canvas can read
// it; anything that blocks the read leaves the tint null (chalk stays). The island's <img> asks
// for the same CORS mode, so it reuses this decoded image instead of fetching its own.
export function useCover(url?: string) {
  const [cover, setCover] = useState<{ url?: string; src?: string; tint: Rgb | null }>({ tint: null });

  useEffect(() => {
    if (!url) return;
    let alive = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.decode().then(
      () => {
        if (alive) setCover({ url, src: url, tint: readTint(img) });
      },
      () => {
        if (alive) setCover({ url, tint: null });
      },
    );
    return () => {
      alive = false;
    };
  }, [url]);

  return { src: cover.src, tint: cover.tint, settled: !url || cover.url === url };
}

function readTint(img: HTMLImageElement): Rgb | null {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 16;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, 16, 16);
  let px: Uint8ClampedArray;
  try {
    px = ctx.getImageData(0, 0, 16, 16).data;
  } catch {
    return null;
  }
  // score each pixel by saturation, favouring mid lightness, and average the best eight
  const scored: { s: number; c: Rgb }[] = [];
  for (let i = 0; i < px.length; i += 4) {
    const c: Rgb = [px[i], px[i + 1], px[i + 2]];
    const max = Math.max(...c);
    const min = Math.min(...c);
    const l = (max + min) / 510;
    const sat = max === min ? 0 : (max - min) / (255 - Math.abs(max + min - 255));
    scored.push({ s: sat * (1 - Math.abs(l - 0.55)), c });
  }
  const top = scored.sort((a, b) => b.s - a.s).slice(0, 8);
  let rgb = [0, 1, 2].map((k) => top.reduce((sum, p) => sum + p.c[k], 0) / top.length);
  // lift a dark pick toward white so it reads on the black island
  const l = (Math.max(...rgb) + Math.min(...rgb)) / 510;
  if (l < 0.6) rgb = rgb.map((v) => v + (255 - v) * (0.6 - l));
  return rgb.map(Math.round) as Rgb;
}
