'use client';

import { useEffect, useRef } from 'react';
import Letters, { letterEls, prefersReducedMotion } from './Letters';

// Pikachu's move: when the pointer comes near the name, a jagged bolt arcs from the
// pointer to the nearest letter, which jolts and glows yellow. A tap fires one strike.
export default function ThunderCharge({
  text,
  size,
  className = '',
  style,
}: {
  text: string;
  size?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLHeadingElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    if (!el || !cv || prefersReducedMotion()) return;
    const ctx = cv.getContext('2d')!;
    const letters = letterEls(name.current);
    let raf = 0;
    let px = 0;
    let py = 0;
    let active = false;
    let until = 0;
    let lastBolt = 0;
    let target: HTMLSpanElement | null = null;
    let bolt: [number, number][] = [];

    const size = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    const jag = (x1: number, y1: number, x2: number, y2: number) => {
      const out: [number, number][] = [[x1, y1]];
      const steps = Math.max(4, Math.round(Math.hypot(x2 - x1, y2 - y1) / 16));
      const nx = -(y2 - y1);
      const ny = x2 - x1;
      const len = Math.hypot(nx, ny) || 1;
      for (let i = 1; i < steps; i++) {
        const t = i / steps;
        const off = (Math.random() - 0.5) * 22 * Math.sin(Math.PI * t);
        out.push([x1 + (x2 - x1) * t + (nx / len) * off, y1 + (y2 - y1) * t + (ny / len) * off]);
      }
      out.push([x2, y2]);
      return out;
    };

    const setTarget = (next: HTMLSpanElement | null) => {
      if (target === next) return;
      if (target) {
        target.style.color = '';
        target.style.textShadow = '';
        target.style.transform = '';
      }
      target = next;
      if (target) {
        target.style.color = '#F6CE3A';
        target.style.textShadow = '0 0 18px rgba(246,206,58,0.75)';
      }
    };

    const frame = (now: number) => {
      const box = cv.getBoundingClientRect();
      ctx.clearRect(0, 0, box.width, box.height);
      if (!active && now > until) {
        setTarget(null);
        raf = 0;
        return;
      }
      // nearest letter within reach
      let best: HTMLSpanElement | null = null;
      let bd = Infinity;
      let bx = 0;
      let by = 0;
      for (const l of letters) {
        const r = l.getBoundingClientRect();
        const cx = Math.max(r.left + r.width * 0.2, Math.min(px, r.right - r.width * 0.2));
        const cy = Math.max(r.top + r.height * 0.25, Math.min(py, r.bottom - r.height * 0.25));
        const d = Math.hypot(cx - px, cy - py);
        if (d < bd) {
          bd = d;
          best = l;
          bx = cx - box.left;
          by = cy - box.top;
        }
      }
      const reach = 180;
      if (best && bd < reach) {
        setTarget(best);
        if (now - lastBolt > 55) {
          bolt = jag(px - box.left, py - box.top, bx, by);
          lastBolt = now;
          best.style.transform = `translate(${(Math.random() * 3 - 1.5).toFixed(1)}px, ${(Math.random() * 3 - 1.5).toFixed(1)}px)`;
        }
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        for (const [w, col] of [
          [10, 'rgba(246,206,58,0.18)'],
          [4, 'rgba(246,206,58,0.7)'],
          [1.6, 'rgba(255,252,235,1)'],
        ] as const) {
          ctx.strokeStyle = col;
          ctx.lineWidth = w;
          ctx.beginPath();
          bolt.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
          ctx.stroke();
        }
      } else {
        setTarget(null);
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      active = e.pointerType === 'mouse';
      start();
    };
    const down = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      until = performance.now() + 450;
      start();
    };
    const leave = () => {
      active = false;
    };
    // listen page-wide so the bolt reaches out as the cursor approaches from outside
    window.addEventListener('pointermove', move);
    el.addEventListener('pointerdown', down);
    document.addEventListener('pointerleave', leave);
    window.addEventListener('resize', size);
    return () => {
      window.removeEventListener('pointermove', move);
      el.removeEventListener('pointerdown', down);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('resize', size);
      cancelAnimationFrame(raf);
      setTarget(null);
    };
  }, []);

  return (
    <div ref={wrap} className={`relative touch-manipulation ${className}`} style={style}>
      {/* overhangs the name so a bolt can reach out to a cursor that is still approaching */}
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute -inset-[140px] z-10 h-[calc(100%+280px)] w-[calc(100%+280px)]" />
      <Letters ref={name} text={text} size={size} className="[&>span]:transition-[color,text-shadow] [&>span]:duration-150" />
    </div>
  );
}
