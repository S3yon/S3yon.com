'use client';

import { useEffect } from 'react';

// As the timeline panel (#work) rides up, the intro's content drifts up at a third of the scroll
// speed and fades. `--p` (0 → 1) is how far the panel has risen, set on the intro only so a
// scroll never restyles the whole page. The CSS is in globals.css.
export default function IntroParallax() {
  useEffect(() => {
    const intro = document.querySelector<HTMLElement>('[data-intro]');
    if (!intro) return;
    let raf = 0;
    let last = -1;
    const read = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      if (Math.abs(p - last) < 0.001) return;
      last = p;
      intro.style.setProperty('--p', p.toFixed(4));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);
  return null;
}
