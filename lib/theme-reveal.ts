'use client';

import { applyTheme, type Theme } from '@/lib/theme';

type VT = { ready: Promise<void> };

// Switch theme with a quick crossfade. The intro never changes with the theme, and Safari's bar
// colours come from the html/body background and color-scheme, which globals.css keeps the same
// in both themes, so only the timeline panel changes.
// Falls back to an instant switch where View Transitions aren't supported or motion is reduced.
export function switchTheme(next: Theme) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => VT };
  if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    applyTheme(next);
    return;
  }
  const t = doc.startViewTransition(() => applyTheme(next));
  t.ready.then(() => {
    document.documentElement.animate(
      { opacity: [0, 1] },
      { duration: 320, easing: 'ease-out', pseudoElement: '::view-transition-new(root)' }
    );
  });
}
