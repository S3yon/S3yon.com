'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/lib/theme';
import { switchWithCircle } from '@/lib/theme-reveal';

// Dark mode toggle. Tap the bolt and the new theme floods out from it in a growing circle, like a
// lightning flash lighting (or blacking out) the page. It lives in two places:
//   PanelSwitch rides up with the intro's arc panel, top-right, and scrolls away with the intro.
//   DockSwitch appears at the right end of the filter bar once the bar sticks to the top (just
//   outside the column at lg), so it never sits over the timeline.

// read the live page, not state, so the switch can never go the wrong way
const flip = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  const isDark = document.documentElement.classList.contains('dark');
  switchWithCircle(isDark ? 'light' : 'dark', r.left + r.width / 2, r.top + r.height / 2);
};

const label = (dark: boolean) => (dark ? 'Switch to light mode' : 'Switch to dark mode');

function Bolt({ dark, size = 18 }: { dark: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className="transition-transform duration-300 group-hover:rotate-12 group-active:scale-90">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" fill={dark ? '#F6CE3A' : 'currentColor'} />
    </svg>
  );
}

// in the arc panel's corner; fades in with the name so it never flies up with the arc
export function PanelSwitch() {
  const { theme } = useTheme();
  return (
    <button
      type="button"
      onClick={(e) => flip(e.currentTarget)}
      aria-label={label(theme === 'dark')}
      style={{
        top: 'max(14px, env(safe-area-inset-top))',
        right: 'max(14px, env(safe-area-inset-right))',
        animationDelay: '650ms',
      }}
      className="animate-intro-fade group pointer-events-auto absolute grid h-11 w-11 place-items-center rounded-full border border-chalk/20 text-chalk transition-colors hover:border-chalk/50"
    >
      <Bolt dark={theme === 'dark'} />
    </button>
  );
}

const filterBar = () => document.querySelector('nav[aria-label="Filter timeline"]')?.parentElement?.parentElement as HTMLElement | null;

// shown only while the filter bar is stuck to the top. Positioned by CSS (.dock-switch) on the
// right side of the screen at all times, so it never teleports across the screen or glitches on load.
export function DockSwitch() {
  const { theme } = useTheme();
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const b = filterBar();
      if (!b) return setStuck(false);
      const r = b.getBoundingClientRect();
      setStuck(r.top <= 0.5);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  return (
    <button
      type="button"
      data-dock-switch={stuck ? 'shown' : ''}
      tabIndex={stuck ? 0 : -1}
      onClick={(e) => flip(e.currentTarget)}
      aria-label={label(theme === 'dark')}
      className={`dock-switch group fixed z-40 grid h-10 w-10 place-items-center rounded-full border border-rule bg-paper text-ink/70 transition-[opacity,transform,border-color] duration-300 hover:border-ink/30 hover:text-ink ${
        stuck ? 'scale-100 opacity-100' : 'pointer-events-none scale-50 opacity-0'
      }`}
    >
      <Bolt dark={theme === 'dark'} size={17} />
    </button>
  );
}
