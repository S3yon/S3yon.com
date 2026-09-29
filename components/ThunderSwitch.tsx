'use client';

import { useTheme } from '@/lib/theme';
import { switchTheme } from '@/lib/theme-reveal';

// Dark mode toggle for the timeline (the intro keeps one look). ThemeBolt sits at the right end
// of the fixed filter bar, which only shows once the inline bar has scrolled off the top.

// read the live page, not state, so the switch can never go the wrong way
const flip = () => switchTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');

function Bolt({ dark, size = 18 }: { dark: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className="transition-transform duration-300 group-hover:rotate-12 group-active:scale-90">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" fill={dark ? '#F6CE3A' : 'currentColor'} />
    </svg>
  );
}

export function ThemeBolt({ className = '' }: { className?: string }) {
  const { theme } = useTheme();
  return (
    <button
      type="button"
      onClick={flip}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`group grid h-9 w-9 shrink-0 place-items-center rounded-full border border-rule text-ink/70 transition-colors hover:border-ink/30 hover:text-ink ${className}`}
    >
      <Bolt dark={theme === 'dark'} size={15} />
    </button>
  );
}
