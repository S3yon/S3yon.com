'use client';

import { useEffect, useRef } from 'react';
import Letters, { prefersReducedMotion } from './Letters';

// Long-exposure light painting: the pointer drags a glowing trail across the name that
// fades out over about a second, like light trails in a slow shutter photo.
export default function LightPainting({ text }: { text: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    if (!el || !cv || prefersReducedMotion()) return;
    const ctx = cv.getContext('2d')!;
    const pts: { x: number; y: number; t: number }[] = [];
    let raf = 0;
    const size = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const LIFE = 1100;
    const draw = () => {
      const now = performance.now();
      while (pts.length && now - pts[0].t > LIFE) pts.shift();
      const r = el.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const life = 1 - (now - b.t) / LIFE;
        for (const [w, col] of [
          [18, `rgba(180,80,42,${(0.18 * life).toFixed(3)})`],
          [8, `rgba(246,206,58,${(0.35 * life).toFixed(3)})`],
          [2.5, `rgba(255,248,230,${(0.9 * life).toFixed(3)})`],
        ] as const) {
          ctx.strokeStyle = col;
          ctx.lineWidth = w;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      raf = pts.length ? requestAnimationFrame(draw) : 0;
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pts.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() });
      if (!raf) raf = requestAnimationFrame(draw);
    };
    el.addEventListener('pointermove', move);
    window.addEventListener('resize', size);
    return () => {
      el.removeEventListener('pointermove', move);
      window.removeEventListener('resize', size);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrap} className="relative touch-none py-10">
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
      <Letters text={text} className="relative mix-blend-screen" />
    </div>
  );
}
