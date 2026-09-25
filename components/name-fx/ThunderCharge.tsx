'use client';

import { useEffect, useRef } from 'react';
import Letters, { letterEls, prefersReducedMotion } from './Letters';

// Pikachu's move: when the pointer comes near the name, a jagged bolt arcs from the
// pointer to the nearest letter, which jolts and glows yellow. A tap fires one strike.
// The whole name also flashes yellow after the intro and when the reader flies back to the top.
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
    // Full-name flash: a bolt drops onto the middle of the name and a yellow charge ripples
    // across every letter, left to right. Fired once after the intro animation, and again
    // whenever the reader flies back up to the top.
    let lastFlash = -Infinity;
    const flash = () => {
      const now = performance.now();
      if (now - lastFlash < 2500) return;
      lastFlash = now;
      const mid = letters[Math.floor(letters.length / 2)];
      if (mid) {
        const r = mid.getBoundingClientRect();
        px = r.left + r.width / 2 + (Math.random() - 0.5) * 30;
        py = r.top - 150;
        until = now + 380;
        start();
      }
      letters.forEach((l, i) => {
        l.animate(
          [
            { color: '#C8C7C3', textShadow: '0 0 0 rgba(246,206,58,0)' },
            { color: '#F6CE3A', textShadow: '0 0 26px rgba(246,206,58,0.85)', offset: 0.25 },
            { color: '#F6CE3A', textShadow: '0 0 14px rgba(246,206,58,0.5)', offset: 0.55 },
            { color: '#C8C7C3', textShadow: '0 0 0 rgba(246,206,58,0)' },
          ],
          { duration: 900, delay: 80 + i * 45, easing: 'ease-out' }
        );
      });
    };

    // after the intro fade-in (starts at 650ms, lasts 700ms)
    const introFlash = window.setTimeout(flash, 1450);

    // fast return to the top: upward speed over ~1.5 px/ms that lands near scrollY 0
    let lastY = window.scrollY;
    let lastT = performance.now();
    let upSpeed = 0;
    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const v = (lastY - y) / Math.max(1, now - lastT);
      upSpeed = v > 0 ? Math.max(v, upSpeed * 0.85) : 0;
      lastY = y;
      lastT = now;
      if (y <= 8 && upSpeed > 1.5) {
        upSpeed = 0;
        flash();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    window.addEventListener('pointermove', move);
    el.addEventListener('pointerdown', down);
    document.addEventListener('pointerleave', leave);
    window.addEventListener('resize', size);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(introFlash);
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
