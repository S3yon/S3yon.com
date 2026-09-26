'use client';

import { useTheme } from '@/lib/theme';
import { switchWithCircle } from './reveal';

// 2 · Thunder switch: tap the bolt and the new theme floods out from it in a growing circle,
// like a lightning flash lighting (or blacking out) the page.
export default function ThunderSwitch() {
  const { theme } = useTheme();
  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        switchWithCircle(theme === 'dark' ? 'light' : 'dark', r.left + r.width / 2, r.top + r.height / 2);
      }}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="group grid h-11 w-11 place-items-center rounded-full border border-current/30 transition-colors hover:border-current"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" className="transition-transform duration-300 group-hover:rotate-12 group-active:scale-90">
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" fill={theme === 'dark' ? '#F6CE3A' : 'currentColor'} />
      </svg>
    </button>
  );
}
