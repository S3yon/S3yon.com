'use client';

import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
import { THEME_KEY as KEY } from './theme-boot';

const read = (): Theme =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light';

export function applyTheme(t: Theme) {
  document.documentElement.classList.toggle('dark', t === 'dark');
  try {
    localStorage.setItem(KEY, t);
  } catch {}
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', t === 'dark' ? '#161618' : '#212225');
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
