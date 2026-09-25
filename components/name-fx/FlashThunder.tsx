'use client';

import { useEffect, useRef } from 'react';
import Letters, { letterEls, prefersReducedMotion } from './Letters';

type Bolt = { pts: [number, number][]; born: number; life: number; width: number };

// Flashlight reveal, electrified. The name sits dim and a spotlight lights it warm as you
// move. Move fast and the edge of the light crackles with small sparks. Click or tap and a
// bolt strikes the nearest letter from above: the whole name flashes lit for a beat and the
// struck letter jolts and glows yellow.
export default function FlashThunder({ text }: { text: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const dim = useRef<HTMLHeadingElement>(null);
  const lit = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const top = lit.current;
    const cv = canvas.current;
    if (!el || !top || !cv) return;
    if (prefersReducedMotion()) {
      top.style.maskImage = 'none';
      top.style.webkitMaskImage = 'none';
      return;
    }
    const ctx = cv.getContext('2d')!;
    const letters = letterEls(dim.current);
    const bolts: Bolt[] = [];
    let x = -999;
    let y = -999;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    let flashUntil = 0;
    let raf = 0;

    const size = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    const jag = (x1: number, y1: number, x2: number, y2: number, amp: number) => {
      const out: [number, number][] = [[x1, y1]];
      const steps = Math.max(3, Math.round(Math.hypot(x2 - x1, y2 - y1) / 14));
      const nx = -(y2 - y1);
      const ny = x2 - x1;
      const len = Math.hypot(nx, ny) || 1;
      for (let i = 1; i < steps; i++) {
        const t = i / steps;
        const off = (Math.random() - 0.5) * amp * Math.sin(Math.PI * t);
        out.push([x1 + (x2 - x1) * t + (nx / len) * off, y1 + (y2 - y1) * t + (ny / len) * off]);
      }
      out.push([x2, y2]);
      return out;
    };

    const setMask = (radius: number) => {
      const m = `radial-gradient(circle ${radius.toFixed(0)}px at ${x.toFixed(0)}px ${y.toFixed(0)}px, #000 35%, transparent 100%)`;
      top.style.maskImage = m;
      top.style.webkitMaskImage = m;
    };

    const frame = (now: number) => {
      raf = 0;
      const box = el.getBoundingClientRect();
      // flash: the light floods the whole name for a beat after a strike
      if (now < flashUntil) {
        top.style.maskImage = 'none';
        top.style.webkitMaskImage = 'none';
      } else {
        setMask(150);
      }
      ctx.clearRect(0, 0, box.width, box.height);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        const age = (now - b.born) / b.life;
        if (age >= 1) {
          bolts.splice(i, 1);
          continue;
        }
        const a = 1 - age;
        for (const [w, col] of [
          [b.width * 5, `rgba(246,206,58,${(0.16 * a).toFixed(3)})`],
          [b.width * 2, `rgba(246,206,58,${(0.7 * a).toFixed(3)})`],
          [b.width * 0.8, `rgba(255,252,235,${a.toFixed(3)})`],
        ] as const) {
          ctx.strokeStyle = col;
          ctx.lineWidth = w;
          ctx.beginPath();
          b.pts.forEach(([px, py], k) => (k ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
          ctx.stroke();
        }
      }
      if (bolts.length || now < flashUntil + 50) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      const speed = Math.hypot(x - lastX, y - lastY) / dt; // px per ms
      lastX = x;
      lastY = y;
      lastT = now;
      // fast moves crackle at the edge of the light
      if (speed > 0.9 && Math.random() < Math.min(0.9, speed / 3)) {
        const ang = Math.random() * Math.PI * 2;
        const r0 = 70 + Math.random() * 40;
        const r1 = r0 + 18 + Math.random() * 26;
        bolts.push({
          pts: jag(x + Math.cos(ang) * r0, y + Math.sin(ang) * r0, x + Math.cos(ang) * r1, y + Math.sin(ang) * r1, 10),
          born: now,
          life: 120,
          width: 1.2,
        });
      }
      kick();
    };

    const strike = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      // nearest letter to the pointer
      let best = letters[0];
      let bd = Infinity;
      for (const l of letters) {
        const lr = l.getBoundingClientRect();
        const d = Math.hypot(lr.left + lr.width / 2 - e.clientX, lr.top + lr.height / 2 - e.clientY);
        if (d < bd) {
          bd = d;
          best = l;
        }
      }
      const lr = best.getBoundingClientRect();
      const tx = lr.left + lr.width / 2 - r.left;
      const ty = lr.top + lr.height * 0.35 - r.top;
      const now = performance.now();
      const main = jag(tx + (Math.random() - 0.5) * 60, 0, tx, ty, 34);
      bolts.push({ pts: main, born: now, life: 320, width: 2 });
      // a forked branch off the main bolt
      const [bx, by] = main[Math.floor(main.length / 2)];
      bolts.push({ pts: jag(bx, by, bx + (Math.random() < 0.5 ? -1 : 1) * 40, by + 30, 14), born: now, life: 220, width: 1.2 });
      flashUntil = now + 170;
      // struck letter jolts and glows
      best.style.transition = 'none';
      best.style.color = '#F6CE3A';
      best.style.textShadow = '0 0 22px rgba(246,206,58,0.8)';
      best.animate(
        [
          { transform: 'translate(0,0)' },
          { transform: 'translate(-3px,2px)' },
          { transform: 'translate(3px,-2px)' },
          { transform: 'translate(-2px,1px)' },
          { transform: 'translate(0,0)' },
        ],
        { duration: 260 }
      );
      window.setTimeout(() => {
        best.style.transition = 'color 600ms ease, text-shadow 600ms ease';
        best.style.color = '';
        best.style.textShadow = '';
      }, 450);
      kick();
    };

    const leave = () => {
      x = -999;
      y = -999;
      setMask(150);
    };

    setMask(150);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerdown', strike);
    el.addEventListener('pointerleave', leave);
    window.addEventListener('resize', size);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerdown', strike);
      el.removeEventListener('pointerleave', leave);
      window.removeEventListener('resize', size);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrap} className="relative cursor-crosshair touch-none py-10">
      <Letters ref={dim} text={text} className="text-chalk/15" />
      <div ref={lit} aria-hidden className="pointer-events-none absolute inset-0 py-10">
        <Letters
          plain
          text={text}
          style={{
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            backgroundImage:
              'radial-gradient(120% 140% at 20% 10%, #FFF3D6 0%, #F2C46B 28%, #D9773F 55%, #7A3B2A 80%, #2A1A18 100%)',
          }}
        />
      </div>
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 z-10 h-full w-full" />
    </div>
  );
}
