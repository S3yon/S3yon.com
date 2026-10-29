'use client';

import { useEffect, useRef } from 'react';
import Letters, { letterEls, prefersReducedMotion } from './Letters';

// Pikachu's move. Hover a letter and it turns yellow. Click or tap one and a jagged bolt drops
// onto it from just above the name, flickering for a moment while the letter jolts and glows
// yellow. The same strike lands on the middle letter after the intro and whenever the reader
// flies back to the top, with a yellow ripple across every letter.
// Scrolling turns the hover off, since the name slides under a still cursor.
const HOVER = 48; // px from a letter's core that still counts as over it
const YELLOW = { color: '#F6CE3A', textShadow: '0 0 18px rgba(246,206,58,0.75)' };

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
    if (!el || !cv) return;
    const letters = letterEls(name.current);
    let over = -1; // hovered letter
    let hit = -1; // struck letter, while its bolt is on screen

    // the hovered and the struck letter are yellow, the rest rest
    const paint = () => {
      letters.forEach((l, i) => {
        if (i === over || i === hit) {
          l.style.color = YELLOW.color;
          l.style.textShadow = YELLOW.textShadow;
        } else if (l.style.color) {
          l.style.color = '';
          l.style.textShadow = '';
        }
        if (i !== hit && l.style.transform) l.style.transform = '';
      });
    };

    // the letter whose core is closest to a viewport point
    const nearest = (px: number, py: number) => {
      let best = -1;
      let bd = Infinity;
      letters.forEach((l, i) => {
        const r = l.getBoundingClientRect();
        const cx = Math.max(r.left + r.width * 0.2, Math.min(px, r.right - r.width * 0.2));
        const cy = Math.max(r.top + r.height * 0.25, Math.min(py, r.bottom - r.height * 0.25));
        const d = Math.hypot(cx - px, cy - py);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      return { i: best, d: bd };
    };

    const hover = (i: number) => {
      if (i === over) return;
      over = i;
      paint();
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const n = nearest(e.clientX, e.clientY);
      hover(n.d < HOVER ? n.i : -1);
    };
    const leave = () => hover(-1);
    window.addEventListener('pointermove', move);
    document.addEventListener('pointerleave', leave);

    // a colour change is not motion, so reduced motion keeps the hover and drops the strikes
    if (prefersReducedMotion()) {
      window.addEventListener('scroll', leave, { passive: true });
      return () => {
        window.removeEventListener('pointermove', move);
        document.removeEventListener('pointerleave', leave);
        window.removeEventListener('scroll', leave);
        over = -1;
        paint();
      };
    }

    const ctx = cv.getContext('2d')!;
    let raf = 0;
    let until = 0;
    let lastBolt = 0;
    let bolt: [number, number][] = [];
    let from: [number, number] = [0, 0];

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

    const frame = (now: number) => {
      const box = cv.getBoundingClientRect();
      ctx.clearRect(0, 0, box.width, box.height);
      if (hit < 0 || now > until) {
        hit = -1;
        paint();
        raf = 0;
        return;
      }
      // re-jag every ~55ms so the bolt flickers, and jolt the letter with it
      if (now - lastBolt > 55) {
        const r = letters[hit].getBoundingClientRect();
        bolt = jag(from[0] - box.left, from[1] - box.top, from[0] - box.left, r.top + r.height * 0.25 - box.top);
        lastBolt = now;
        letters[hit].style.transform = `translate(${(Math.random() * 3 - 1.5).toFixed(1)}px, ${(Math.random() * 3 - 1.5).toFixed(1)}px)`;
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
      raf = requestAnimationFrame(frame);
    };

    // a bolt from 150px above the letter down onto it
    const strike = (i: number, ms: number) => {
      const r = letters[i].getBoundingClientRect();
      from = [r.left + r.width / 2 + (Math.random() - 0.5) * 30, r.top - 150];
      hit = i;
      until = performance.now() + ms;
      lastBolt = 0;
      paint();
      if (!raf) raf = requestAnimationFrame(frame);
    };

    // click with a mouse, or tap: strike the letter under the pointer
    const down = (e: PointerEvent) => {
      if (performance.now() < until) return;
      const n = nearest(e.clientX, e.clientY);
      if (n.i >= 0) strike(n.i, 450);
    };

    // Full-name flash: a bolt drops onto the middle of the name and a yellow charge ripples
    // across every letter, left to right
    let lastFlash = -Infinity;
    const flash = () => {
      const now = performance.now();
      if (now - lastFlash < 2500) return;
      lastFlash = now;
      const mid = Math.floor(letters.length / 2);
      if (letters[mid]) strike(mid, 380);
      // the letters' resting colour, read live so it follows the intro's look and theme
      const rest = name.current ? getComputedStyle(name.current).color : '#C8C7C3';
      letters.forEach((l, i) => {
        l.animate(
          [
            { color: rest, textShadow: '0 0 0 rgba(246,206,58,0)' },
            { color: '#F6CE3A', textShadow: '0 0 26px rgba(246,206,58,0.85)', offset: 0.25 },
            { color: '#F6CE3A', textShadow: '0 0 14px rgba(246,206,58,0.5)', offset: 0.55 },
            { color: rest, textShadow: '0 0 0 rgba(246,206,58,0)' },
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
      leave();
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

    // the canvas follows the name's width, which changes when the web font replaces the
    // fallback after mount; refit then too, or the bitmap stretches and bolts miss the letters
    const ro = new ResizeObserver(size);
    ro.observe(cv);
    window.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('pointerdown', down);
    return () => {
      ro.disconnect();
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('scroll', onScroll);
      el.removeEventListener('pointerdown', down);
      window.clearTimeout(introFlash);
      cancelAnimationFrame(raf);
      over = -1;
      hit = -1;
      paint();
    };
  }, []);

  return (
    <div ref={wrap} className={`relative touch-manipulation ${className}`} style={style}>
      {/* overhangs the name so a bolt can drop onto it from above */}
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute -inset-[140px] z-10 h-[calc(100%+280px)] w-[calc(100%+280px)]" />
      <Letters ref={name} text={text} size={size} className="[&>span]:transition-[color,text-shadow] [&>span]:duration-150" />
    </div>
  );
}
