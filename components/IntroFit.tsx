'use client';

import { useEffect } from 'react';

// The intro's content box is as tall as the smallest height the reader can actually see, so
// nothing lands under the browser's toolbars (iOS 26 Safari floats its bar over the page and
// won't draw sticky content under it). CSS gives the floor with 100svh; this measures the real
// visible height and keeps the smallest one seen for the current width, so the box doesn't jump
// as toolbars show and hide while scrolling. Sets --intro-fit on <html>.
export default function IntroFit() {
  useEffect(() => {
    const root = document.documentElement;
    let width = 0;
    let least = Infinity;
    const read = () => {
      const w = window.innerWidth;
      if (w !== width) { width = w; least = Infinity; } // rotated or resized: start over
      const h = Math.min(window.innerHeight, window.visualViewport?.height ?? Infinity);
      if (h > 0 && h < least) {
        least = h;
        root.style.setProperty('--intro-fit', `${Math.round(h)}px`);
      }
    };
    read();
    window.addEventListener('resize', read);
    window.visualViewport?.addEventListener('resize', read);
    return () => {
      window.removeEventListener('resize', read);
      window.visualViewport?.removeEventListener('resize', read);
    };
  }, []);
  return null;
}
