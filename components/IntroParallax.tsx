'use client';

import { useEffect } from 'react';

// As the timeline panel (#work) rides up, the intro's content drifts up at a third of the scroll
// speed and fades. Modern browsers use compositor-driven animation-timeline in globals.css.
// This hook provides a fallback for browsers without scroll-driven animation support.
export default function IntroParallax() {
  useEffect(() => {
    if (typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timeline: scroll()')) {
      return;
    }
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
