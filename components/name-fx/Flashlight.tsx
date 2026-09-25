'use client';

import { useEffect, useRef } from 'react';
import Letters, { prefersReducedMotion } from './Letters';

// The name sits dim. A soft spotlight follows the pointer and lights the letters up with a
// warm, film-like fill (swap the gradient for a real photo to reveal a hidden picture).
export default function Flashlight({ text }: { text: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const lit = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const top = lit.current;
    if (!el || !top) return;
    if (prefersReducedMotion()) {
      top.style.maskImage = 'none';
      top.style.webkitMaskImage = 'none';
      return;
    }
    let raf = 0;
    let x = -999;
    let y = -999;
    const apply = () => {
      raf = 0;
      const m = `radial-gradient(circle 150px at ${x.toFixed(0)}px ${y.toFixed(0)}px, #000 35%, transparent 100%)`;
      top.style.maskImage = m;
      top.style.webkitMaskImage = m;
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const leave = () => {
      x = -999;
      y = -999;
      apply();
    };
    apply();
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrap} className="relative cursor-crosshair touch-none py-10">
      <Letters text={text} className="text-chalk/15" />
      <div ref={lit} aria-hidden className="pointer-events-none absolute inset-0 py-10">
        {/* plain text: background-clip:text does not reach through per-letter inline-blocks */}
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
    </div>
  );
}
