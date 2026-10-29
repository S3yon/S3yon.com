'use client';

import { useEffect, useRef } from 'react';
import Letters, { letterEls, prefersReducedMotion } from './Letters';
import { drawSegs, fitCanvas, forkedBolt, glow, nearest, type Seg } from './bolt';

// Pikachu's move. Hover a letter and it turns yellow. Click or tap one and a branching bolt
// drops on it from the top of the cover: a dim stepped leader feels its way down, the return
// stroke flashes, sparks kick off the letter and it cools from white-hot through yellow and
// amber back to chalk. The same strike lands on the middle of the name after the intro and
// whenever the reader flies back to the top, with a yellow ripple across the other letters.
// Scrolling turns the hover off, since the name slides under a still cursor.
const COOL = ['255,246,214', '246,206,58', '232,119,58']; // white-hot, yellow, amber
const HOVER = 48; // px from a letter's core that still counts as over it
const LEADER = 110; // ms for the leader to reach the letter
const COOLING = 1600;

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
    const struck: number[] = []; // when each letter was last hit
    let over = -1;

    // a cooling letter keeps its strike colour; otherwise the hovered one is yellow
    const paint = (now: number) => {
      let busy = false;
      letters.forEach((l, i) => {
        const a = now - (struck[i] ?? -1e9) - LEADER;
        if (a >= 0 && a < COOLING) {
          busy = true;
          const u = a / COOLING;
          const stop = COOL[Math.min(2, Math.floor(u * 3))];
          l.style.transition = 'none';
          l.style.color = `color-mix(in srgb, rgb(${stop}) ${Math.round((1 - u) * 100)}%, rgb(var(--chalk)))`;
          l.style.textShadow = `0 0 ${Math.round(28 * (1 - u))}px rgba(${stop},${(0.8 * (1 - u)).toFixed(2)})`;
          return;
        }
        if (a < 0 && a > -LEADER) busy = true; // the leader is still on its way down
        l.style.transition = '';
        if (i === over) {
          l.style.color = '#F6CE3A';
          l.style.textShadow = '0 0 18px rgba(246,206,58,0.75)';
        } else if (l.style.color) {
          l.style.color = '';
          l.style.textShadow = '';
        }
      });
      return busy;
    };

    const hover = (i: number) => {
      if (i === over) return;
      over = i;
      paint(performance.now());
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const hit = nearest(letters, e.clientX, e.clientY);
      hover(hit && hit.d < HOVER ? hit.i : -1);
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
        paint(-1e9);
      };
    }

    const ctx = cv.getContext('2d')!;
    let box = fitCanvas(cv, ctx);
    let raf = 0;
    let strike: { segs: Seg[]; t: number; x: number; y: number } | null = null;
    let sparks: { x: number; y: number; vx: number; vy: number; t: number }[] = [];
    let lastStrike = -1e9;

    const frame = (now: number) => {
      box = cv.getBoundingClientRect();
      ctx.clearRect(0, 0, box.width, box.height);
      if (strike) {
        const age = now - strike.t;
        if (age < LEADER) {
          // stepped leader: only the part above the current tip, dim
          const tip = strike.y * (age / LEADER);
          drawSegs(ctx, strike.segs.filter((s) => Math.max(s.a[1], s.b[1]) <= tip), 0.35, 0.7);
        } else {
          // return stroke, then one re-strike, then gone (two flashes, under three a second)
          const t = age - LEADER;
          const pulse = t < 70 ? 1 : t < 140 ? 0.25 : t < 210 ? 0.8 : Math.max(0, 0.8 - (t - 210) / 180);
          if (pulse > 0) {
            drawSegs(ctx, strike.segs, pulse, 1.25);
            // the sky glow stays inside the canvas, or its cut-off edge shows as a hard line
            const sky = Math.max(0, Math.min(420, strike.x, box.width - strike.x, box.height - strike.y * 0.6));
            glow(ctx, strike.x, strike.y * 0.6, sky, 0.07 * pulse);
            glow(ctx, strike.x, strike.y, 60, 0.4 * pulse);
          } else strike = null;
        }
      }
      sparks = sparks.filter((s) => now - s.t < LEADER + 310);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const s of sparks) {
        const t = now - s.t - LEADER; // sparks fly on the return stroke
        if (t < 0) continue;
        const x = s.x + s.vx * t;
        const y = s.y + s.vy * t + 0.0006 * t * t;
        ctx.strokeStyle = `rgba(255,236,170,${(1 - t / 310).toFixed(3)})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - s.vx * 18, y - s.vy * 18);
        ctx.stroke();
      }
      ctx.restore();
      const busy = paint(now) || !!strike || sparks.length > 0;
      raf = busy ? requestAnimationFrame(frame) : 0;
    };

    const fire = (i: number) => {
      const now = performance.now();
      box = cv.getBoundingClientRect();
      const r = letters[i].getBoundingClientRect();
      const x = r.left + r.width * (0.35 + Math.random() * 0.3) - box.left;
      const y = r.top + r.height * 0.18 - box.top;
      strike = { segs: forkedBolt([x + (Math.random() - 0.5) * 220, 0], [x, y], { passes: 7, rough: 0.1, forks: 0.55 }), t: now, x, y };
      lastStrike = now;
      struck[i] = now;
      for (let j = 0; j < 10; j++) {
        const a = -Math.PI * (0.1 + Math.random() * 0.8);
        const s = 0.15 + Math.random() * 0.35;
        sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, t: now });
      }
      if (!raf) raf = requestAnimationFrame(frame);
    };

    // click with a mouse, or tap: strike the letter under the pointer
    const down = (e: PointerEvent) => {
      const hit = nearest(letters, e.clientX, e.clientY);
      if (hit && performance.now() - lastStrike > 700) fire(hit.i);
    };

    // full-name strike: the bolt lands on the middle letter and a yellow charge ripples
    // across the rest, left to right
    let lastFlash = -Infinity;
    const flash = () => {
      const now = performance.now();
      if (now - lastFlash < 2500) return;
      lastFlash = now;
      const mid = Math.floor(letters.length / 2);
      if (letters[mid]) fire(mid);
      // the letters' resting colour, read live so it follows the intro's look and theme
      const rest = name.current ? getComputedStyle(name.current).color : '#C8C7C3';
      letters.forEach((l, i) => {
        if (i === mid) return; // the struck letter cools on its own
        l.animate(
          [
            { color: rest, textShadow: '0 0 0 rgba(246,206,58,0)' },
            { color: '#F6CE3A', textShadow: '0 0 26px rgba(246,206,58,0.85)', offset: 0.25 },
            { color: '#F6CE3A', textShadow: '0 0 14px rgba(246,206,58,0.5)', offset: 0.55 },
            { color: rest, textShadow: '0 0 0 rgba(246,206,58,0)' },
          ],
          { duration: 900, delay: LEADER + Math.abs(i - mid) * 45, easing: 'ease-out' }
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
    const resize = () => {
      box = fitCanvas(cv, ctx);
    };
    const ro = new ResizeObserver(resize);
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
      paint(-1e9);
    };
  }, []);

  return (
    <div ref={wrap} className={`relative touch-manipulation ${className}`} style={style}>
      {/* reaches up past the top of the cover so a strike can fall from there */}
      <canvas
        ref={canvas}
        aria-hidden
        className="pointer-events-none absolute -bottom-[60px] -left-[140px] -right-[140px] -top-[46svh] z-10 h-[calc(100%+46svh+60px)] w-[calc(100%+280px)]"
      />
      <Letters ref={name} text={text} size={size} className="[&>span]:transition-[color,text-shadow] [&>span]:duration-150" />
    </div>
  );
}
