'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { EntryKind } from '@/lib/experience-data';
import KindIcon from './KindIcon';

export type DockItem = { key: string; label: string; count: number };

function DockIcon({ k }: { k: string }) {
  if (k === 'all')
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    );
  if (k === 'award') return <KindIcon kind="project" award />;
  return <KindIcon kind={k as EntryKind} award={false} />;
}

// Shown while the panel covers the screen (the same moment the top bar slides in), until the
// feed's end reaches the dock: from there the footer would scroll under it, so it slides away.
// At that point the last entry, with its own bottom padding, already sits clear above the dock.
function useDockShown(feedEl: React.RefObject<HTMLElement | null>, dockEl: React.RefObject<HTMLElement | null>) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const feed = feedEl.current;
      const dock = dockEl.current;
      if (!feed || !dock) return;
      const panel = feed.closest<HTMLElement>('#work') ?? feed;
      const past = panel.getBoundingClientRect().top < 1;
      // where the dock's top sits when shown (its transform moves it while hidden)
      const top = window.innerHeight - dock.offsetHeight - parseFloat(getComputedStyle(dock).bottom || '0');
      setShown(past && feed.getBoundingClientRect().bottom > top);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    // the list changes height on a filter change or when a project opens, without a scroll
    const ro = new ResizeObserver(on);
    if (feedEl.current) ro.observe(feedEl.current);
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, [feedEl, dockEl]);
  return shown;
}

// Phones (under 768px): the filters sit in a glass dock at the bottom of the screen, in thumb
// reach, with the rail marker icons and a count on each. Desktop keeps the tab row in the top bar.
export default function FilterDock({
  items,
  active,
  onChange,
  feedEl,
}: {
  items: DockItem[];
  active: string;
  onChange: (key: string) => void;
  feedEl: React.RefObject<HTMLElement | null>;
}) {
  const dock = useRef<HTMLDivElement>(null);
  const shown = useDockShown(feedEl, dock);
  const reduce = useReducedMotion();
  return (
    <div
      ref={dock}
      data-filter-dock
      data-shown={shown ? '1' : '0'}
      aria-hidden={!shown}
      inert={!shown}
      className={`fixed inset-x-2 bottom-[max(0.625rem,env(safe-area-inset-bottom))] z-30 mx-auto max-w-[480px] transition-[transform,visibility] duration-300 ease-out motion-reduce:duration-0 md:hidden ${
        shown ? 'visible translate-y-0' : 'invisible translate-y-[calc(100%+3rem)]'
      }`}
    >
      <div role="group" aria-label="Filter timeline" className="glass-bar grid grid-cols-6 rounded-[22px] p-0.5 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.3)]">
        {items.map((f) => {
          const on = f.key === active;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={on}
              aria-label={`${f.label}, ${f.count}`}
              onClick={() => onChange(f.key)}
              className={`relative flex h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-[18px] transition-colors duration-200 ${
                on ? 'text-ink' : 'text-ink/55 [@media(hover:hover)]:hover:text-ink/80'
              }`}
            >
              {on && (
                <motion.span
                  layoutId="filter-dock-active"
                  className="absolute inset-0 rounded-[18px] bg-ink/[0.07]"
                  transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }}
                />
              )}
              <span className="relative">
                <DockIcon k={f.key} />
                <span className="absolute -right-3 -top-2 font-sans text-[9.5px] font-semibold tabular-nums text-ink/60">{f.count}</span>
              </span>
              <span className={`relative max-w-full truncate font-sans text-[9.5px] leading-none tracking-[-0.015em] sm:text-[10px] ${on ? 'font-bold' : 'font-medium'}`}>
                {f.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
