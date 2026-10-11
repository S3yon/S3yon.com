'use client';
// Thunder rings (chosen 2026-10-11 from the design lab): with a mouse, a yellow dot stands in
// for the arrow and swells over links; every click or tap sends a ring out from where it landed.
// Fingers get the rings only. Reduced motion keeps the normal cursor and no rings.
import { useEffect, useRef, useState } from 'react';

type Ring = { id: number; x: number; y: number };

export default function ThunderRings() {
  const dot = useRef<HTMLDivElement>(null);
  const [rings, setRings] = useState<Ring[]>([]);

  useEffect(() => {
    const d = dot.current;
    if (!d || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement;
    const q = { x: 0, y: 0, down: false, hot: false, on: false };
    let x = 0, y = 0, s = 10, raf = 0, n = 0;

    const loop = () => {
      x += (q.x - x) * 0.3;
      y += (q.y - y) * 0.3;
      s += ((q.down ? 26 : q.hot ? 22 : 10) - s) * 0.2;
      d.style.transform = `translate(${(x - s / 2).toFixed(1)}px,${(y - s / 2).toFixed(1)}px)`;
      d.style.width = d.style.height = `${s.toFixed(1)}px`;
      raf = requestAnimationFrame(loop);
    };
    const hide = () => {
      q.on = false;
      d.style.opacity = '0';
      root.classList.remove('thunder-cursor');
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const move = (e: PointerEvent) => {
      // a finger on a touchscreen laptop hands the page back to the normal cursor
      if (e.pointerType !== 'mouse') return hide();
      q.x = e.clientX;
      q.y = e.clientY;
      q.hot = !!(e.target as Element).closest?.('a,button,[role="button"],label,summary');
      if (!q.on) {
        q.on = true;
        x = q.x;
        y = q.y;
        d.style.opacity = '1';
        root.classList.add('thunder-cursor');
        raf = requestAnimationFrame(loop);
      }
    };
    const down = () => { q.down = true; };
    const up = () => { q.down = false; };
    const click = (e: MouseEvent) => {
      if (e.detail === 0) return; // keyboard "clicks" have no position
      const id = ++n;
      setRings((r) => [...r, { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => setRings((r) => r.filter((ring) => ring.id !== id)), 800);
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    window.addEventListener('click', click, true);
    root.addEventListener('mouseleave', hide);
    return () => {
      hide();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('click', click, true);
      root.removeEventListener('mouseleave', hide);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      {rings.map((r) => (
        <span key={r.id} className="thunder-ring" style={{ left: r.x, top: r.y }} />
      ))}
      <div ref={dot} className="thunder-dot" />
    </div>
  );
}
