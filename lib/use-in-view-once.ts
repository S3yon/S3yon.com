'use client';

import { useEffect, useState, type RefObject } from 'react';

// 'idle' renders visible (server + no-JS). 'hidden' waits for the viewport. 'shown' is final.
export type ViewState = 'idle' | 'hidden' | 'shown';

// Scroll-triggered visibility with failsafes, so nothing can stay stuck hidden:
//  1. Starts hidden only after JS mounts, so no-JS renders fully visible.
//  2. Reduced motion or a missing IntersectionObserver shows immediately.
//  3. A poll reveals anything that reached the viewport the observer missed.
export function useInViewOnce(
  ref: RefObject<Element | null>,
  rootMargin = '0px 0px -12% 0px'
): ViewState {
  const [state, setState] = useState<ViewState>('idle');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setState('shown');
      return;
    }

    setState('hidden');

    const show = () => setState('shown');
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          show();
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);

    const poll = window.setInterval(() => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        show();
        window.clearInterval(poll);
      }
    }, 1500);

    return () => {
      observer.disconnect();
      window.clearInterval(poll);
    };
  }, [ref, rootMargin]);

  return state;
}
