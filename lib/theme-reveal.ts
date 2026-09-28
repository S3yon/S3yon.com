'use client';

import { applyTheme, setThemeColorMeta, type Theme } from '@/lib/theme';

const DURATION = 650;
const EASING = 'cubic-bezier(0.7, 0, 0.2, 1)';

// Safari 26 on iOS tints the strips under its toolbar and the Dynamic Island from a fixed or
// sticky element touching that edge, else the body background (benfrain.com, jahir.dev,
// upclose.studio posts on Safari 26 tinting). It reads the live page, which already has the new
// theme while the circle is still growing, so the strips used to flip before the circle got there.
// Fix: for the length of the switch, full-width hidden strips pinned to each edge hold the old
// colour and change to the new one as the circle crosses the middle of that edge.

// the colour Safari would read at one edge: first fixed/sticky element there with a background
function edgeSource(y: number): HTMLElement {
  for (const el of document.elementsFromPoint(innerWidth / 2, y)) {
    const s = getComputedStyle(el);
    if ((s.position === 'fixed' || s.position === 'sticky') && !/rgba\(.*, 0\)|transparent/.test(s.backgroundColor)) {
      return el as HTMLElement;
    }
  }
  return document.body;
}
const bg = (el: HTMLElement) => getComputedStyle(el).backgroundColor;

function strip(edge: 'top' | 'bottom') {
  const id = `edge-tint-${edge}`;
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('div');
    el.id = id;
    el.setAttribute('aria-hidden', 'true');
    // 3px, full width, on the edge: the size Safari samples. visibility:hidden still gets
    // sampled but never paints, so the circle reveal doesn't see it.
    Object.assign(el.style, {
      position: 'fixed', left: '0', right: '0', height: '3px', [edge]: '0',
      zIndex: '2147483647', visibility: 'hidden', pointerEvents: 'none', display: 'none',
    });
    document.body.appendChild(el);
  }
  return el;
}

// Switch theme with a circle that grows from (x, y) using the View Transitions API.
// Falls back to an instant switch where it isn't supported or motion is reduced.
export function switchWithCircle(next: Theme, x: number, y: number) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> } };
  if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    applyTheme(next);
    return;
  }
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  // hold both edges at their current colour before the page changes
  const edges = ([['top', 0], ['bottom', innerHeight - 1]] as const).map(([edge, ey]) => {
    const src = edgeSource(ey);
    const el = strip(edge);
    const from = bg(src);
    el.style.backgroundColor = from;
    el.style.display = 'block';
    // eased progress at which the circle reaches the middle of this edge
    const at = Math.min(1, Math.hypot(innerWidth / 2 - x, ey - y) / r);
    return { el, src, from, at };
  });

  const t = doc.startViewTransition(() => applyTheme(next, { meta: false }));
  t.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: DURATION, easing: EASING, pseudoElement: '::view-transition-new(root)' }
    );
    // same duration and easing as the circle, so keyframe offsets are fractions of its radius
    for (const e of edges) {
      const to = bg(e.src);
      const start = Math.max(0, e.at - 0.08);
      const end = Math.min(1, e.at + 0.08);
      e.el.animate(
        [
          { backgroundColor: e.from, offset: 0 },
          { backgroundColor: e.from, offset: start },
          { backgroundColor: to, offset: end },
          { backgroundColor: to, offset: 1 },
        ],
        { duration: DURATION, easing: EASING, fill: 'forwards' }
      );
    }
    // older iOS tints from theme-color instead: change it halfway through
    setTimeout(() => setThemeColorMeta(next), DURATION / 2);
  });
  const done = () => {
    for (const e of edges) {
      e.el.getAnimations().forEach((a) => a.cancel());
      e.el.style.display = 'none';
    }
    setThemeColorMeta(next);
  };
  t.finished.then(done, done);
}
