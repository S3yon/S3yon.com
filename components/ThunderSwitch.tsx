'use client';

import { useTheme } from '@/lib/theme';
import { switchWithCircle } from '@/lib/theme-reveal';

// Dark mode toggle, fixed top-right on every page: tap the bolt and the new theme floods out
// from it in a growing circle, like a lightning flash lighting (or blacking out) the page.
// Readable over both the charcoal cover and the paper timeline; clears the iOS status bar.
export default function ThunderSwitch() {
  const { theme } = useTheme();
  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        // read the live page, not state, so the switch can never go the wrong way
        const isDark = document.documentElement.classList.contains('dark');
        switchWithCircle(isDark ? 'light' : 'dark', r.left + r.width / 2, r.top + r.height / 2);
      }}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ top: 'max(12px, env(safe-area-inset-top))', right: 'max(12px, env(safe-area-inset-right))' }}
      className="group fixed z-50 grid h-11 w-11 place-items-center rounded-full border border-chalk/20 bg-charcoal/70 text-chalk shadow-[0_6px_20px_-8px_rgba(0,0,0,0.5)] backdrop-blur-md transition-colors hover:border-chalk/50"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" className="transition-transform duration-300 group-hover:rotate-12 group-active:scale-90">
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" fill={theme === 'dark' ? '#F6CE3A' : 'currentColor'} />
      </svg>
    </button>
  );
}
