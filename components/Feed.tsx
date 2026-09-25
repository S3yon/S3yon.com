'use client';

import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import Reveal from './Reveal';
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

// Rail marker: springs in with a slight twist when it scrolls into view, then sends out one
// ring. Starts visible (server/no-JS) and only hides after mount — see useInViewOnce.
function RailIcon({ entry }: { entry: FeedEntry }) {
  const ref = useRef<HTMLSpanElement>(null);
  const state = useInViewOnce(ref, '0px 0px -18% 0px');
  const hidden = state === 'hidden';
  const tone = entry.current ? 'border-accent/50 text-accent' : 'border-rule text-muted';

  return (
    <span ref={ref} aria-hidden className="absolute left-0 top-0 z-10 h-9 w-9">
      {state === 'shown' && (
        <motion.span
          className="absolute inset-0 rounded-full border border-accent/60"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />
      )}
      <motion.span
        className={`relative grid h-9 w-9 place-items-center rounded-full border bg-paper ${tone}`}
        initial={false}
        animate={hidden ? { scale: 0.2, opacity: 0, rotate: -30 } : { scale: 1, opacity: 1, rotate: 0 }}
        transition={
          hidden ? { duration: 0 } : { type: 'spring', stiffness: 460, damping: 16, mass: 0.9 }
        }
      >
        <KindIcon kind={entry.kind} award={isAward(entry)} />
      </motion.span>
    </span>
  );
}

function Entry({ entry }: { entry: FeedEntry }) {
  return (
    <article className="relative grid gap-2.5 pb-10 pl-12 sm:grid-cols-[6rem_1fr] sm:gap-8 sm:pl-16">
      <RailIcon entry={entry} />

      <Reveal delay={120}>
        <p className="text-sm text-faint sm:pt-1.5">{entry.month}</p>
      </Reveal>

      <Reveal delay={180} className="min-w-0">
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
      </Reveal>
    </article>
  );
}

// One year: heading, then a hairline rail with an accent beam that fills as you scroll
// through it (the Aceternity timeline pattern, rebuilt on this site's tokens).
function YearSection({
  year,
  entries,
  ref,
}: {
  year: number;
  entries: FeedEntry[];
  ref?: React.Ref<HTMLElement>;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: railRef, offset: ['start 70%', 'end 70%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <motion.section
      ref={ref}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-14 first:pt-0"
    >
      <Reveal>
        <div className="mb-8 flex items-center gap-5">
          <h2 className="font-heading text-[44px] font-extrabold leading-none tracking-[-0.03em] sm:text-[56px]">
            {year}
          </h2>
          <span className="h-px flex-1 bg-rule" aria-hidden />
        </div>
      </Reveal>

      <div ref={railRef} className="relative">
        <span aria-hidden className="absolute bottom-10 left-[17px] top-4 w-px bg-rule" />
        <motion.span
          aria-hidden
          style={{ scaleY: fill, originY: 0 }}
          className="absolute bottom-10 left-[17px] top-4 w-px bg-gradient-to-b from-accent/0 via-accent/70 to-accent"
        />
        <AnimatePresence initial={false} mode="popLayout">
          {entries.map((entry) => (
            <motion.div
              key={entryKey(entry)}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <Entry entry={entry} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

function FilterBar({
  active,
  onChange,
}: {
  active: FilterKey;
  onChange: (key: FilterKey) => void;
}) {
  return (
    <div className="sticky top-3 z-30 -mx-2 mb-14 sm:top-4">
      <nav
        aria-label="Filter timeline"
        className="flex overflow-x-auto rounded-2xl border border-rule bg-paper/85 px-2 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.35)] backdrop-blur-md [scrollbar-width:none]"
      >
        {FILTERS.map((f) => {
          const count = feed.filter(f.match).length;
          const on = f.key === active;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(f.key)}
              className={`relative shrink-0 px-3 py-3.5 font-heading text-[11.5px] font-bold uppercase tracking-[0.16em] transition-colors ${
                on ? 'text-ink' : 'text-faint hover:text-ink/70'
              }`}
            >
              {f.label}
              <sup className="ml-1 text-[9.5px] font-semibold tracking-normal text-faint">{count}</sup>
              {on && (
                <motion.span
                  layoutId="filter-underline"
                  className="absolute inset-x-3 bottom-2 h-[2px] rounded-full bg-accent"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default function Feed() {
  const [filter, setFilter] = useState<FilterKey>('all');
  const topRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => {
    const match = FILTERS.find((f) => f.key === filter)!.match;
    const shown = feed.filter(match);
    const yrs = [...new Set(shown.map((e) => e.year))].sort((a, b) => b - a);
    return yrs.map((year) => ({ year, entries: shown.filter((e) => e.year === year) }));
  }, [filter]);

  const choose = (key: FilterKey) => {
    setFilter(key);
    // If the bar is stuck mid-feed, bring the start of the results back into view.
    const top = topRef.current;
    if (top && top.getBoundingClientRect().top < 0) {
      top.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={topRef} className="scroll-mt-4">
      <FilterBar active={filter} onChange={choose} />
      <AnimatePresence initial={false} mode="popLayout">
        {groups.map(({ year, entries }) => (
          <YearSection
            key={year}
            year={year}
            entries={entries}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
