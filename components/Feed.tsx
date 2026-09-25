'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import Reveal from './Reveal';
import Pikachu from './Pikachu';
import { useInViewOnce } from '@/lib/use-in-view-once';
import { feed, type FeedEntry, type EntryKind } from '@/lib/experience-data';

type FilterKey = 'all' | 'award' | EntryKind;

const isAward = (e: FeedEntry) => /award|place/i.test(e.title);

const FILTERS: { key: FilterKey; label: string; match: (e: FeedEntry) => boolean }[] = [
  { key: 'all', label: 'All', match: () => true },
  { key: 'role', label: 'Work', match: (e) => e.kind === 'role' },
  { key: 'project', label: 'Projects', match: (e) => e.kind === 'project' },
  { key: 'award', label: 'Awards', match: isAward },
  { key: 'community', label: 'Community', match: (e) => e.kind === 'community' },
  { key: 'education', label: 'Education', match: (e) => e.kind === 'education' },
];

const entryKey = (e: FeedEntry) => `${e.year}-${e.month}-${e.title}`;

// The rail beam's head sits on this viewport line, and each entry reveals when its marker
// crosses the same line, so the runner arrives exactly as the entry appears.
const LINE = 0.7;
const EASE = [0.16, 1, 0.3, 1] as const;

// Entries already revealed once. A filter change re-mounts them; they must not animate again.
const seen = new Set<string>();
const FeedMode = createContext({ filtered: false });

function KindIcon({ kind, award }: { kind: EntryKind; award: boolean }) {
  const stroke = 'currentColor';
  const common = {
    width: 15,
    height: 15,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (award) {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="6" />
        <path d="M8.2 13.5 7 22l5-3 5 3-1.2-8.5" />
      </svg>
    );
  }

  switch (kind) {
    case 'role':
      return (
        <svg {...common}>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      );
    case 'project':
      return (
        <svg {...common}>
          <path d="m8 18-6-6 6-6" />
          <path d="m16 6 6 6-6 6" />
        </svg>
      );
    case 'community':
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        </svg>
      );
    case 'education':
      return (
        <svg {...common}>
          <path d="M22 10 12 5 2 10l10 5 10-5Z" />
          <path d="M6 12.5V17c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-4.5" />
        </svg>
      );
  }
}

function Entry({ entry }: { entry: FeedEntry }) {
  const key = entryKey(entry);
  const { filtered } = useContext(FeedMode);
  const markerRef = useRef<HTMLSpanElement>(null);
  const state = useInViewOnce(markerRef, {
    line: LINE,
    skip: seen.has(key),
    instantIfPast: filtered,
  });
  const hidden = state === 'hidden';

  useEffect(() => {
    if (state === 'shown') seen.add(key);
  }, [state, key]);

  // One trigger drives the marker and the text, so they always move together.
  const text = (delay: number) => ({
    initial: false as const,
    animate: hidden ? { opacity: 0, y: 14 } : { opacity: 1, y: 0 },
    transition: hidden ? { duration: 0 } : { duration: 0.55, ease: EASE, delay },
  });

  const tone = entry.current ? 'border-accent/50 text-accent' : 'border-rule text-muted';

  return (
    <article className="relative grid gap-2.5 pb-10 pl-12 sm:grid-cols-[6rem_1fr] sm:gap-8 sm:pl-16">
      <span ref={markerRef} aria-hidden className="absolute left-0 top-0 z-10 h-9 w-9">
        {state === 'shown' && (
          <motion.span
            className="absolute inset-0 rounded-full border border-accent/50"
            initial={{ scale: 1, opacity: 0.55 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.05 }}
          />
        )}
        <motion.span
          className={`relative grid h-9 w-9 place-items-center rounded-full border bg-paper ${tone}`}
          initial={false}
          animate={hidden ? { scale: 0.5, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={
            hidden
              ? { duration: 0 }
              : { type: 'spring', stiffness: 260, damping: 22, mass: 0.9 }
          }
        >
          <KindIcon kind={entry.kind} award={isAward(entry)} />
        </motion.span>
      </span>

      <motion.p {...text(0)} className="text-sm text-faint sm:pt-1.5">
        {entry.month}
      </motion.p>

      <motion.div {...text(0.05)} className="min-w-0">
        <h3 className="font-heading text-[19px] font-extrabold leading-snug tracking-[-0.01em] text-balance sm:text-[21px]">
          {entry.title}
          {entry.org && (
            <>
              <span className="font-normal text-faint"> @ </span>
              {entry.orgUrl ? (
                <a
                  href={entry.orgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-2 decoration-rule underline-offset-[5px] transition-colors hover:decoration-accent"
                >
                  {entry.org}
                </a>
              ) : (
                <span>{entry.org}</span>
              )}
            </>
          )}
          {entry.current && (
            <span className="ml-2 inline-block align-middle rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-accent">
              now
            </span>
          )}
        </h3>

        <p className="mt-2 max-w-[72ch] text-[15px] leading-relaxed text-muted">
          {entry.description}
        </p>

        {entry.links && entry.links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {entry.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 font-heading text-[11.5px] font-bold uppercase tracking-[0.16em] text-ink/70 transition-colors hover:text-accent"
              >
                <span className="border-b border-rule pb-0.5 transition-colors group-hover:border-accent">
                  {link.label}
                </span>
                <span aria-hidden className="text-[13px] leading-none">↗</span>
              </a>
            ))}
          </div>
        )}

        {entry.tags && entry.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <li key={tag} className="rounded-md bg-ink/[0.045] px-2 py-1 text-[12.5px] text-muted">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </article>
  );
}

// The rail for one year: a hairline, an accent fill that tracks scroll, and Pikachu running
// at the head of the fill. The head sits on the LINE viewport line.
function Rail() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: [`start ${LINE * 100}%`, `end ${LINE * 100}%`],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 34, restDelta: 0.0005 });
  const height = useTransform(progress, (v) => `${(v * 100).toFixed(2)}%`);
  const runnerOpacity = useTransform(progress, [0, 0.015, 0.985, 1], [0, 1, 1, 0]);

  const [running, setRunning] = useState(false);
  const [facing, setFacing] = useState<'down' | 'up'>('down');
  const last = useRef(0);
  const stop = useRef<number | undefined>(undefined);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0 && v < 1) {
      setFacing(v >= last.current ? 'down' : 'up');
      setRunning(true);
      window.clearTimeout(stop.current);
      stop.current = window.setTimeout(() => setRunning(false), 160);
    }
    last.current = v;
  });

  useEffect(() => () => window.clearTimeout(stop.current), []);

  return (
    <div ref={trackRef} aria-hidden className="pointer-events-none absolute bottom-10 left-0 top-[18px] w-9">
      <span className="absolute inset-y-0 left-[17px] w-px bg-rule" />
      <motion.span
        style={{ height }}
        className="absolute left-[16.5px] top-0 w-[2px] rounded-full bg-gradient-to-b from-accent/0 via-accent/60 to-accent"
      />
      <motion.span
        style={{ top: height, opacity: runnerOpacity }}
        className="absolute left-1/2 z-20 -translate-x-1/2 -translate-y-[85%]"
      >
        <Pikachu running={running} facing={facing} />
      </motion.span>
    </div>
  );
}

function YearSection({ year, entries }: { year: number; entries: FeedEntry[] }) {
  const { filtered } = useContext(FeedMode);
  return (
    <section className="pt-14 first:pt-0">
      <Reveal instantIfPast={filtered}>
        <div className="mb-8 flex items-center gap-5">
          <h2 className="font-heading text-[44px] font-extrabold leading-none tracking-[-0.03em] sm:text-[56px]">
            {year}
          </h2>
          <span className="h-px flex-1 bg-rule" aria-hidden />
        </div>
      </Reveal>

      <div className="relative">
        <Rail />
        {entries.map((entry) => (
          <Entry key={entryKey(entry)} entry={entry} />
        ))}
      </div>
    </section>
  );
}

// Editorial tab row on a hairline, in the same uppercase micro-label style as the links.
function FilterBar({
  active,
  shown,
  onChange,
}: {
  active: FilterKey;
  shown: number;
  onChange: (key: FilterKey) => void;
}) {
  return (
    <div className="sticky top-0 z-30 -mx-5 mb-14 bg-paper/90 px-5 backdrop-blur-md sm:-mx-8 sm:px-8">
      <div className="flex items-end justify-between gap-6 border-b border-rule">
        <nav
          aria-label="Filter timeline"
          className="-mb-px flex gap-6 overflow-x-auto [scrollbar-width:none] sm:gap-8"
        >
          {FILTERS.map((f) => {
            const on = f.key === active;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={on}
                onClick={() => onChange(f.key)}
                className={`relative shrink-0 pb-3.5 pt-5 font-heading text-[11.5px] font-bold uppercase tracking-[0.16em] transition-colors duration-300 ${
                  on ? 'text-ink' : 'text-faint hover:text-ink/70'
                }`}
              >
                {f.label}
                <span className="ml-1.5 font-sans text-[11px] font-medium tracking-normal tabular-nums text-faint">
                  {feed.filter(f.match).length}
                </span>
                {on && (
                  <motion.span
                    layoutId="filter-underline"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-accent"
                    transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
        <p className="hidden shrink-0 pb-3.5 text-[12.5px] tabular-nums text-faint lg:block">
          {shown} {shown === 1 ? 'entry' : 'entries'}
        </p>
      </div>
    </div>
  );
}

export default function Feed() {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [filtered, setFiltered] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const { groups, count } = useMemo(() => {
    const match = FILTERS.find((f) => f.key === filter)!.match;
    const shown = feed.filter(match);
    const yrs = [...new Set(shown.map((e) => e.year))].sort((a, b) => b - a);
    return {
      count: shown.length,
      groups: yrs.map((year) => ({ year, entries: shown.filter((e) => e.year === year) })),
    };
  }, [filter]);

  const choose = (key: FilterKey) => {
    if (key === filter) return;
    setFiltered(true);
    setFilter(key);
  };

  // Runs while the old list is faded out and before the new one mounts: if the bar is stuck
  // mid-feed, jump back to the start of the results so the new list lays out in place.
  const resetScroll = () => {
    const top = topRef.current;
    if (top && top.getBoundingClientRect().top < 0) {
      window.scrollTo({ top: window.scrollY + top.getBoundingClientRect().top, behavior: 'instant' });
    }
  };

  return (
    <FeedMode.Provider value={{ filtered }}>
      <div ref={topRef}>
        <FilterBar active={filter} shown={count} onChange={choose} />
        {/* Crossfade the whole list on a filter change instead of animating each entry. */}
        <AnimatePresence mode="wait" initial={false} onExitComplete={resetScroll}>
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {groups.map(({ year, entries }) => (
              <YearSection key={year} year={year} entries={entries} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </FeedMode.Provider>
  );
}
