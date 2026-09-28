'use client';

import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
import { THEME_KEY as KEY } from './theme-boot';

const read = (): Theme =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light';

// older iOS Safari tints its bars from this; Safari 26 reads the page instead (see theme-reveal)
export function setThemeColorMeta(t: Theme) {
  const metas = document.querySelectorAll('meta[name="theme-color"]');
  metas.forEach((m) => m.setAttribute('content', t === 'dark' ? '#131315' : '#212225'));
}

// meta: false leaves theme-color for the caller to change in step with an animation
export function applyTheme(t: Theme, { meta = true } = {}) {
  document.documentElement.classList.toggle('dark', t === 'dark');
  try {
    localStorage.setItem(KEY, t);
  } catch {}
  if (meta) setThemeColorMeta(t);
  window.dispatchEvent(new CustomEvent('theme', { detail: t }));
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  useEffect(() => {
    setTheme(read());
    const on = (e: Event) => setTheme((e as CustomEvent<Theme>).detail);
    window.addEventListener('theme', on);
    return () => window.removeEventListener('theme', on);
  }, []);
  const toggle = useCallback(() => applyTheme(read() === 'dark' ? 'light' : 'dark'), []);
  return { theme, toggle, set: applyTheme };
}
