'use client';

import { useEffect, useState, type RefObject } from 'react';

// 'idle' renders visible with no animation (server, no-JS, reduced motion, skipped).
// 'hidden' waits for the trigger line. 'shown' animates in and stays.
export type ViewState = 'idle' | 'hidden' | 'shown';

interface Options {
  // Reveal when the element's top crosses this fraction of the viewport height.
  line?: number;
  // Already revealed before (e.g. re-mounted by a filter change): stay visible, no animation.
  skip?: boolean;
  // If it is already past the line when it mounts, show it without animating.
  instantIfPast?: boolean;
}

// Scroll-triggered visibility, measured directly on scroll so every element that shares a
// line fires in the same frame. Failsafes, so nothing can stay stuck hidden:
//  1. Starts hidden only after JS mounts, so no-JS renders fully visible.
//  2. Reduced motion shows everything immediately.
//  3. At the bottom of the page, anything on screen shows even if it never reached the line.
//  4. A slow poll re-runs the check in case a scroll event was missed.
export function useInViewOnce(
  ref: RefObject<Element | null>,
  { line = 0.88, skip = false, instantIfPast = false }: Options = {}
): ViewState {
  const [state, setState] = useState<ViewState>('idle');

  useEffect(() => {
    const el = ref.current;
    if (!el || skip) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const reached = () => {
      const top = el.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const atBottom =
        window.scrollY + vh >= document.documentElement.scrollHeight - 4;
      return top < vh * line || (atBottom && top < vh);
    };

    if (instantIfPast && reached()) return;
    if (reached()) {
      // On screen at load: still animate, one frame after hiding.
      setState('hidden');
      const raf = requestAnimationFrame(() => setState('shown'));
      const t = window.setTimeout(() => setState('shown'), 120);
      return () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(t);
      };
    }

    setState('hidden');
    let done = false;
    const check = () => {
      if (done || !reached()) return;
      done = true;
      setState('shown');
      cleanup();
    };
    const poll = window.setInterval(check, 1000);
    const cleanup = () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      window.clearInterval(poll);
    };
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return cleanup;
  }, [ref, line, skip, instantIfPast]);

  return state;
}
