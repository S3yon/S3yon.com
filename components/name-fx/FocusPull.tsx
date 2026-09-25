'use client';

import { useEffect, useRef } from 'react';
import Letters, { letterEls, prefersReducedMotion } from './Letters';

// Shallow depth of field: letters near the pointer are sharp, the rest fall out of focus.
// A small focus reticle follows the pointer. At rest everything is sharp.
export default function FocusPull({ text }: { text: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLHeadingElement>(null);
  const reticle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el || prefersReducedMotion()) return;
    const letters = letterEls(name.current);
    let raf = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      raf = 0;
      for (const l of letters) {
        const r = l.getBoundingClientRect();
        const d = Math.hypot(r.left + r.width / 2 - px, r.top + r.height / 2 - py);
        const blur = Math.min(5, Math.max(0, (d - r.width * 0.9) / 45));
        l.style.filter = `blur(${blur.toFixed(2)}px)`;
        l.style.opacity = (1 - Math.min(0.45, blur / 14)).toFixed(2);
      }
      const box = el.getBoundingClientRect();
      if (reticle.current) {
        reticle.current.style.transform = `translate(${(px - box.left).toFixed(1)}px, ${(py - box.top).toFixed(1)}px)`;
        reticle.current.style.opacity = '1';
      }
    };
    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const leave = () => {
      for (const l of letters) {
        l.style.filter = 'blur(0px)';
        l.style.opacity = '1';
      }
      if (reticle.current) reticle.current.style.opacity = '0';
    };
    for (const l of letters) l.style.transition = 'filter 180ms ease-out, opacity 180ms ease-out';
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrap} className="relative cursor-none touch-none py-10">
      <Letters ref={name} text={text} />
      <div ref={reticle} aria-hidden className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-200">
        <div className="relative -left-7 -top-5 h-10 w-14">
          {['left-0 top-0 border-l border-t', 'right-0 top-0 border-r border-t', 'left-0 bottom-0 border-l border-b', 'right-0 bottom-0 border-r border-b'].map((c) => (
            <span key={c} className={`absolute h-2.5 w-2.5 border-accent ${c}`} />
          ))}
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
        </div>
      </div>
    </div>
  );
}
