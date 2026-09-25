'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useAnimate,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';
import Reveal from './Reveal';
import Pikachu, { type PikaFacing } from './Pikachu';
import { useInViewOnce, type ViewState } from '@/lib/use-in-view-once';
import { feed, upcoming, type FeedEntry, type EntryKind, type UpcomingEvent } from '@/lib/experience-data';
import type { GithubStats } from '@/lib/github';

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
    if (state !== 'shown') return;
    seen.add(key);
    window.dispatchEvent(new CustomEvent('timeline:reveal', { detail: { award: isAward(entry) } }));
  }, [state, key, entry]);

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
                className="group -my-2 inline-flex items-center gap-1.5 py-2 font-heading text-[11.5px] font-bold uppercase tracking-[0.16em] text-ink/70 transition-colors hover:text-accent"
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

// Mood portraits, in order, in public/sprites/pikachu-moods.webp (216px each, shown at 72px).
const MOODS = [
  'question', 'angry', 'shocked', 'smug', 'hearts', 'sad',
  'lookback', 'cap', 'wink', 'grumpy', 'love', 'sleepy',
] as const;
type Mood = (typeof MOODS)[number];
const MOOD_LABEL: Record<Mood, string> = {
  question: 'confused',
  angry: 'fired up',
  shocked: 'shocked',
  smug: 'smug',
  hearts: 'overjoyed',
  sad: 'sad',
  lookback: 'glancing back',
  cap: 'wearing a cap',
  wink: 'winking',
  grumpy: 'grumpy',
  love: 'delighted',
  sleepy: 'sleepy',
};
const TAP_MOODS: Mood[] = [...MOODS];
const LINES = ['Pika!', 'Pika pika!', 'Chu~', 'Pikachu!'];

type BubbleBody = { kind: 'mood'; mood: Mood } | { kind: 'text'; text: string };
type Bubble = { id: number } & BubbleBody;

// One continuous rail for the whole feed: a hairline, an accent fill that tracks scroll, and
// Pikachu walking at the head of the fill (pinned to the LINE viewport line). It never fades:
// before the first entry it waits at the top, after the last it waits at the bottom.
//
// Personality, all driven by what the reader does:
//  - walks while scrolling, faster on a fast scroll; front view going down, back view going up
//  - hops a little each time an entry pops in; celebrates awards with sparks and a "Pika!"
//  - when the reader stops, breathes, then glances at the content and back, now and then
//  - tap or click it: a mood portrait on the first tap and now and then, otherwise a "Pika!" line
function Rail({ startsAtRow = false }: { startsAtRow?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hopScope, animateHop] = useAnimate();
  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: [`start ${LINE * 100}%`, `end ${LINE * 100}%`],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 34, restDelta: 0.0005 });
  const height = useTransform(progress, (v) => `${(v * 100).toFixed(2)}%`);
  const velocity = useVelocity(scrollY);

  const [walking, setWalking] = useState(false);
  const [fast, setFast] = useState(false);
  const [facing, setFacing] = useState<PikaFacing>('down');
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const [sparks, setSparks] = useState(0);
  const timers = useRef<{ stop?: number; idle?: number; bubble?: number }>({});
  const said = useRef(0);

  const lastMood = useRef<Mood | null>(null);
  const taps = useRef(0);
  const sinceMood = useRef(0);
  const show = (next: BubbleBody) => {
    const id = ++said.current;
    setBubble({ id, ...next });
    window.clearTimeout(timers.current.bubble);
    timers.current.bubble = window.setTimeout(() => setBubble(null), next.kind === 'mood' ? 1900 : 1400);
  };
  const emote = (mood: Mood) => {
    lastMood.current = mood;
    sinceMood.current = 0;
    show({ kind: 'mood', mood });
  };
  const speak = (text: string) => {
    sinceMood.current += 1;
    show({ kind: 'text', text });
  };
  // First tap always shows a portrait; after that roughly one tap in three, and never more
  // than three "Pika!" lines in a row. The rest are lines, cycling.
  const onTap = () => {
    taps.current += 1;
    const portrait = taps.current === 1 || sinceMood.current >= 3 || Math.random() < 0.3;
    if (portrait) {
      const options = TAP_MOODS.filter((m) => m !== lastMood.current);
      emote(options[Math.floor(Math.random() * options.length)]);
    } else {
      speak(LINES[(taps.current - 1) % LINES.length]);
    }
  };

  const hop = (height = 10) => {
    if (!hopScope.current) return;
    animateHop(hopScope.current, { y: [0, -height, 0] }, { duration: 0.34, ease: 'easeOut' });
  };

  // Idle loop: after a pause, glance at the content, then back at the reader.
  const scheduleIdle = () => {
    window.clearTimeout(timers.current.idle);
    const steps: [PikaFacing, number][] = [
      ['right', 2600],
      ['down', 1400],
      ['left', 900],
      ['down', 5200],
    ];
    let i = 0;
    const next = () => {
      const [dir, wait] = steps[i % steps.length];
      timers.current.idle = window.setTimeout(() => {
        setFacing(dir);
        i += 1;
        next();
      }, wait);
    };
    next();
  };

  useMotionValueEvent(scrollY, 'change', () => {
    const v = velocity.get();
    if (Math.abs(v) < 5) return;
    window.clearTimeout(timers.current.idle);
    setFacing(v > 0 ? 'down' : 'up');
    setFast(Math.abs(v) > 1400);
    setWalking(true);
    window.clearTimeout(timers.current.stop);
    timers.current.stop = window.setTimeout(() => {
      setWalking(false);
      setFast(false);
      scheduleIdle();
    }, 180);
  });

  useEffect(() => {
    const onReveal = (e: Event) => {
      const { award } = (e as CustomEvent<{ award: boolean }>).detail;
      if (award) {
        hop(16);
        setSparks((n) => n + 1);
        speak('Pika!');
      } else {
        hop(8);
      }
    };
    window.addEventListener('timeline:reveal', onReveal);
    scheduleIdle();
    new Image().src = '/sprites/pikachu-moods.webp';
    const t = timers.current;
    return () => {
      window.removeEventListener('timeline:reveal', onReveal);
      window.clearTimeout(t.stop);
      window.clearTimeout(t.idle);
      window.clearTimeout(t.bubble);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={trackRef}
      className={`pointer-events-none absolute bottom-10 left-0 w-9 ${startsAtRow ? 'top-[18px]' : 'top-[22px] sm:top-[28px]'}`}
    >
      <span aria-hidden className="absolute inset-y-0 left-[17px] w-px bg-rule" />
      <motion.span
        aria-hidden
        style={{ height }}
        className="absolute left-[16.5px] top-0 w-[2px] rounded-full bg-gradient-to-b from-accent/0 via-accent/60 to-accent"
      />
      <motion.div
        style={{ top: height }}
        className="absolute left-1/2 z-20 -translate-x-1/2 -translate-y-[62%]"
      >
        <div ref={hopScope} className="relative">
          <button
            type="button"
            aria-label="Pikachu"
            onClick={() => {
              hop(14);
              setFacing('down');
              onTap();
            }}
            className="pointer-events-auto block cursor-pointer"
          >
            <Pikachu walking={walking} fast={fast} facing={facing} />
          </button>

          {/* award sparks */}
          <AnimatePresence>
            {sparks > 0 && (
              <motion.span
                key={sparks}
                aria-hidden
                className="pointer-events-none absolute inset-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.9, delay: 0.3 }}
                onAnimationComplete={() => setSparks(0)}
              >
                {[-60, -20, 20, 60].map((deg) => (
                  <motion.svg
                    key={deg}
                    width="10"
                    height="14"
                    viewBox="0 0 10 14"
                    className="absolute left-1/2 top-6"
                    initial={{ x: -5, y: 0, rotate: deg, scale: 0.4 }}
                    animate={{
                      x: -5 + Math.round(Math.sin((deg * Math.PI) / 180) * 26),
                      y: -Math.round(Math.cos((deg * Math.PI) / 180) * 22),
                      scale: 1,
                    }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <path d="M6 0 L1 8 L5 8 L3 14 L9 5 L5 5 Z" fill="#F6CE3A" stroke="#B4502A" strokeWidth="0.8" />
                  </motion.svg>
                ))}
              </motion.span>
            )}
          </AnimatePresence>

          {/* mood portrait (framed like the art) or a "Pika!" line, popping out above its head */}
          <AnimatePresence>
            {bubble && (
              <motion.span
                key={bubble.id}
                role="status"
                aria-label={bubble.kind === 'mood' ? `Pikachu is ${MOOD_LABEL[bubble.mood]}` : bubble.text}
                className="pointer-events-none absolute bottom-[calc(100%-10px)] left-0 block"
                initial={{ opacity: 0, scale: 0.3, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -4 }}
                transition={{ type: 'spring', stiffness: 460, damping: 22 }}
                style={{ originX: '32px', originY: 1 }}
              >
                {bubble.kind === 'mood' ? (
                  <>
                    {/* frame echoes the art: navy double line on a yellow mat */}
                    <span className="block rounded-[8px] border-2 border-[#10061E] bg-[#F1C754] p-[4px] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.5)]">
                      <span className="block overflow-hidden rounded-[4px] border-[1.5px] border-[#10061E]">
                        <span
                          className="block h-[72px] w-[72px]"
                          style={{
                            backgroundImage: 'url(/sprites/pikachu-moods.webp)',
                            backgroundSize: `${MOODS.length * 72}px 72px`,
                            backgroundPositionX: `${-MOODS.indexOf(bubble.mood) * 72}px`,
                          }}
                        />
                      </span>
                    </span>
                    <span className="absolute -bottom-[7px] left-[32px] block h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-[#10061E] bg-[#F1C754]" />
                  </>
                ) : (
                  <>
                    <span className="block whitespace-nowrap rounded-full border border-rule bg-paper px-2.5 py-1 font-heading text-[11px] font-bold uppercase tracking-[0.14em] text-ink shadow-[0_6px_18px_-10px_rgba(0,0,0,0.35)]">
                      {bubble.text}
                    </span>
                    <span className="absolute -bottom-[4px] left-[32px] block h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-rule bg-paper" />
                  </>
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// Year heading sits on the rail: a node on the line, the year aligned with the entry text.
function YearSection({ year, entries }: { year: number; entries: FeedEntry[] }) {
  const { filtered } = useContext(FeedMode);
  return (
    <section className="pt-14 first:pt-0">
      <Reveal instantIfPast={filtered}>
        <div className="relative mb-8 flex items-center gap-5 pl-12 sm:pl-16">
          <span
            aria-hidden
            className="absolute left-[11px] top-1/2 z-10 h-[14px] w-[14px] -translate-y-1/2 rounded-full border-2 border-ink/25 bg-paper"
          />
          <h2 className="font-heading text-[44px] font-extrabold leading-none tracking-[-0.03em] sm:text-[56px]">
            {year}
          </h2>
          <span className="h-px flex-1 bg-rule" aria-hidden />
        </div>
      </Reveal>

      {entries.map((entry) => (
        <Entry key={entryKey(entry)} entry={entry} />
      ))}
    </section>
  );
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Next upcoming event, picked on the client so a cached page never shows a past one.
function useNextEvent(): { event: UpcomingEvent; when: string } | null {
  const [next, setNext] = useState<{ event: UpcomingEvent; when: string } | null>(null);
  useEffect(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const event = [...upcoming].sort((a, b) => a.date.localeCompare(b.date)).find((e) => e.date >= today);
    if (!event) return;
    const [y, m, d] = event.date.split('-').map(Number);
    const days = Math.round((new Date(y, m - 1, d).getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / 86400000);
    const rel = days === 0 ? 'today' : days === 1 ? 'tomorrow' : days < 7 ? `in ${days} days` : '';
    setNext({ event, when: `${MONTHS[m - 1]} ${d}${rel ? ` · ${rel}` : ''}` });
  }, []);
  return next;
}

// Counts up from 0 the first time it scrolls into view. Renders the real number on the
// server and without JS; only shows 0 while it is waiting to animate.
function CountUp({ value, state, delay = 0 }: { value: number; state: ViewState; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (state !== 'shown' || !ref.current) return;
    const el = ref.current;
    const controls = animate(0, value, {
      duration: 1.6,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = Math.round(v).toLocaleString('en-CA');
      },
    });
    return () => controls.stop();
  }, [state, value, delay]);
  return (
    <span ref={ref} className="tabular-nums">
      {state === 'hidden' ? '0' : value.toLocaleString('en-CA')}
    </span>
  );
}

function ago(iso: string) {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 2) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  return `${h} hour${h === 1 ? '' : 's'} ago`;
}

// "Still building": live public contribution counts. The marker pulses like a live signal
// and the numbers count up from 0 the first time the row comes into view.
function GithubRow({ github }: { github: GithubStats }) {
  const ref = useRef<HTMLElement>(null);
  const state = useInViewOnce(ref, { line: 0.85 });
  const hidden = state === 'hidden';
  const [updated, setUpdated] = useState<string | null>(null);
  useEffect(() => setUpdated(ago(github.fetchedAt)), [github.fetchedAt]);

  return (
    <article ref={ref} className="relative grid gap-1.5 pb-10 pl-12 sm:grid-cols-[6rem_1fr] sm:gap-8 sm:pl-16">
      <span aria-hidden className="absolute left-0 top-0 z-10 h-9 w-9">
        <span className="animate-live-ring absolute inset-0 rounded-full border border-[#2DA44E]" />
        <span className="animate-live-ring absolute inset-0 rounded-full border border-[#2DA44E] [animation-delay:1.2s]" />
        <motion.span
          className="relative grid h-9 w-9 place-items-center rounded-full bg-ink text-paper"
          initial={false}
          animate={hidden ? { scale: 0.5, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={hidden ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 18 }}
        >
          <svg className="animate-live-breathe" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .3Z" />
          </svg>
          {/* live dot */}
          <span className="absolute -right-0.5 -top-0.5 grid h-3 w-3 place-items-center">
            <span className="animate-live-dot absolute h-3 w-3 rounded-full bg-[#2DA44E]/50" />
            <span className="relative h-2 w-2 rounded-full border border-paper bg-[#2DA44E]" />
          </span>
        </motion.span>
      </span>

      <motion.p
        initial={false}
        animate={hidden ? { opacity: 0, y: 14 } : { opacity: 1, y: 0 }}
        transition={hidden ? { duration: 0 } : { duration: 0.55, ease: EASE }}
        className="flex items-center gap-1.5 font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-[#2DA44E] sm:pt-2"
      >
        Live
      </motion.p>
      <motion.div
        initial={false}
        animate={hidden ? { opacity: 0, y: 14 } : { opacity: 1, y: 0 }}
        transition={hidden ? { duration: 0 } : { duration: 0.55, ease: EASE, delay: 0.05 }}
        className="min-w-0"
      >
        <h3 className="font-heading text-[19px] font-extrabold leading-snug tracking-[-0.01em] sm:text-[21px]">Still building</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          <a href={github.profileUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline decoration-2 decoration-rule underline-offset-[4px] transition-colors hover:decoration-accent">
            <CountUp value={github.last30} state={state} /> GitHub contributions
          </a>{' '}
          in the last 30 days, <CountUp value={github.thisYear} state={state} delay={0.15} /> this year.
        </p>
        {updated && <p className="mt-1 text-[12.5px] text-faint">Pulled from GitHub {updated}</p>}
      </motion.div>
    </article>
  );
}

// Rows that sit on the rail above the years: what's next, and proof of steady work.
function LeadRows({ github }: { github: GithubStats | null }) {
  const next = useNextEvent();
  if (!next && !github) return null;
  return (
    <div className="pb-6">
      {next && (
        <Reveal>
          <article className="relative grid gap-1.5 pb-10 pl-12 sm:grid-cols-[6rem_1fr] sm:gap-8 sm:pl-16">
            <span aria-hidden className="absolute left-0 top-0 z-10 grid h-9 w-9 place-items-center rounded-full border border-dashed border-faint/60 bg-paper text-faint">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M3 10h18" />
              </svg>
            </span>
            <p className="font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-accent sm:pt-2">Next up</p>
            <div className="min-w-0">
              <h3 className="font-heading text-[19px] font-extrabold leading-snug tracking-[-0.01em] text-ink/60 sm:text-[21px]">
                {next.event.url ? (
                  <a href={next.event.url} target="_blank" rel="noopener noreferrer" className="underline decoration-2 decoration-rule underline-offset-[5px] transition-colors hover:decoration-accent">
                    {next.event.title}
                  </a>
                ) : (
                  next.event.title
                )}
              </h3>
              <p className="mt-1 text-sm text-faint">{next.when}</p>
              {next.event.detail && (
                <p className="mt-2 max-w-[72ch] text-[15px] leading-relaxed text-muted">{next.event.detail}</p>
              )}
            </div>
          </article>
        </Reveal>
      )}
      {github && <GithubRow github={github} />}
    </div>
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
          className="-mb-px flex gap-6 overflow-x-auto pr-8 [mask-image:linear-gradient(to_right,black_calc(100%-40px),transparent)] [scrollbar-width:none] sm:gap-8 lg:pr-0 lg:[mask-image:none]"
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

export default function Feed({ github = null }: { github?: GithubStats | null }) {
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
            className="relative"
          >
            <Rail startsAtRow={filter === 'all'} />
            {filter === 'all' && <LeadRows github={github} />}
            {groups.map(({ year, entries }) => (
              <YearSection key={year} year={year} entries={entries} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </FeedMode.Provider>
  );
}
