'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useAnimate,
  useMotionValueEvent,
  useScroll,
  useVelocity,
} from 'motion/react';
import Reveal from './Reveal';
import Pikachu, { type PikaFacing } from './Pikachu';
import { DittoSprite, DittoPika } from './ditto/Ditto';
import { getDuo, setDuo, useDuo, type DittoStage } from '@/lib/duo';
import { useInViewOnce, type ViewState } from '@/lib/use-in-view-once';
import { feed, upcoming, type FeedEntry, type EntryKind, type UpcomingEvent } from '@/lib/experience-data';
import type { GithubStats } from '@/lib/github';
import OnRotation from './OnRotation';
import { useSpotify, type SpotifyState } from '@/lib/use-spotify';
import { ThemeBolt } from './ThunderSwitch';

type FilterKey = 'all' | 'award' | EntryKind;

const isAward = (e: FeedEntry) => /award|place|top \d/i.test(e.title);

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

  const tone = entry.current ? 'border-accent/60 text-accent' : 'border-rule text-muted';
  const award = isAward(entry);

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
          className={`relative grid h-9 w-9 place-items-center rounded-full border ${entry.logo ? 'bg-white dark:bg-[#ECEBE7]' : 'bg-paper'} ${tone}`}
          initial={false}
          animate={hidden ? { scale: 0.5, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={
            hidden
              ? { duration: 0 }
              : { type: 'spring', stiffness: 260, damping: 22, mass: 0.9 }
          }
        >
          {entry.logo ? (
            // org logo; square logos fill the circle, others sit inside it
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={entry.logo}
              alt=""
              loading="lazy"
              decoding="async"
              className={entry.logoFill ? 'h-full w-full rounded-full object-cover' : 'h-[22px] w-[22px] object-contain'}
            />
          ) : (
            <KindIcon kind={entry.kind} award={award} />
          )}
          {entry.logo && award && (
            <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-accent text-paper">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6" />
                <path d="M8.2 13.5 7 22l5-3 5 3-1.2-8.5" />
              </svg>
            </span>
          )}
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
  wink: 'throwing a peace sign',
  grumpy: 'grumpy',
  love: 'delighted',
  sleepy: 'sleepy',
};
const TAP_MOODS: Mood[] = [...MOODS];
const LINES = ['Pika!', 'Pika pika!', 'Chu~', 'Pikachu!'];

// Easter egg: on 1 visit in 10 (or with ?ditto) the rail's Pikachu is Ditto in disguise.
// 'pika' = disguised, 'blob' = the disguise has melted, 'copy' = walks on as a lavender Pikachu.
const DITTO_LINES = ['Ditto!', 'Pika… to!', 'Dit-chu!'];

// Ditto's portraits: its own 12 moods (same order as Pikachu's) and 3 of it as the lavender copy.
const DITTO_ART = {
  ditto: { src: '/sprites/ditto-moods.webp', frames: MOODS.length, label: 'Ditto portrait' },
  copy: { src: '/sprites/ditto-pika.webp', frames: 3, label: 'Ditto as Pikachu portrait' },
} as const;
type BubbleBody =
  | { kind: 'mood'; mood: Mood }
  | { kind: 'ditto'; art: keyof typeof DITTO_ART; frame: number }
  | { kind: 'text'; text: string };
type Bubble = { id: number } & BubbleBody;

// One continuous rail for the whole feed: a hairline, an accent fill that tracks scroll, and
// Pikachu walking at the head of the fill (pinned to the LINE viewport line). It never fades:
// before the first entry it waits at the top. The rail runs on past the last entry to the footer
// campfire and ends on the left seat, so the runner walks straight into its seat.
//
// Personality, all driven by what the reader does:
//  - walks while scrolling, faster on a fast scroll; front view going down, back view going up
//  - hops a little each time an entry pops in; celebrates awards with sparks and a "Pika!"
//  - when the reader stops, breathes, then glances at the content and back, now and then
//  - tap or click it: a mood portrait on the first tap and now and then, otherwise a "Pika!" line
//  - while Spotify is playing and it stands still, it bobs to the beat with notes floating up,
//    and one of its tap lines is the song
//  - sometimes it's Ditto (see DittoStage): the second tap slips ("Pika… Ditto?"), the third
//    melts the disguise, and it walks the rest of the visit as a lavender copy
//  - at the end of the rail it is on the campfire's left seat: the seated sprite takes over on
//    the same spot (ditto/Campfire.tsx) and hands back the moment the runner moves up again
function Rail({
  startsAtRow = false,
  music = null,
  ditto = 'off',
  setDitto,
}: {
  startsAtRow?: boolean;
  music?: string | null;
  ditto?: DittoStage;
  setDitto?: (s: DittoStage) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [hopScope, animateHop] = useAnimate();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const away = useDuo().camp !== 'rail';
  // counts each stand-up from the seat: the desktop seat is 1.5x, so the runner shrinks back
  // from that size instead of popping (the reverse of the seat's grow, Campfire.tsx)
  // (set during render, so the first frame back on the rail is already the big one)
  const [stood, setStood] = useState(0);
  const [wasAway, setWasAway] = useState(away);
  if (wasAway !== away) {
    setWasAway(away);
    if (!away) setStood(stood + 1);
  }

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
  const show = (next: BubbleBody, ms?: number) => {
    const id = ++said.current;
    setBubble({ id, ...next });
    window.clearTimeout(timers.current.bubble);
    timers.current.bubble = window.setTimeout(() => setBubble(null), ms ?? (next.kind === 'mood' ? 1900 : 1400));
  };
  const emote = (mood: Mood, ms?: number) => {
    lastMood.current = mood;
    sinceMood.current = 0;
    show({ kind: 'mood', mood }, ms);
  };
  const dittoArt = useRef(0);
  const dittoPortrait = (art: keyof typeof DITTO_ART, ms?: number) => {
    sinceMood.current = 0;
    show({ kind: 'ditto', art, frame: dittoArt.current++ % DITTO_ART[art].frames }, ms ?? 1900);
  };
  const speak = (text: string) => {
    sinceMood.current += 1;
    show({ kind: 'text', text });
  };
  // First tap always shows a portrait; after that roughly one tap in three, and never more
  // than three "Pika!" lines in a row. The rest are lines, cycling.
  const onTap = () => {
    taps.current += 1;
    // once unmasked: its own portraits (Ditto while melted, the lavender copy after), with its
    // lines in between, same rhythm as Pikachu's
    if (ditto === 'blob') return dittoPortrait('ditto');
    if (ditto === 'copy') {
      if (sinceMood.current >= 2 || Math.random() < 0.4) return dittoPortrait('copy');
      return speak(DITTO_LINES[taps.current % DITTO_LINES.length]);
    }
    if (ditto === 'pika' && taps.current >= 2) {
      if (taps.current === 2) return speak('Pika… Ditto?');
      // melts: "…Ditto.", then its portrait; re-forms as the copy with the copy's portrait
      setDitto?.('blob');
      show({ kind: 'text', text: '…Ditto.' }, 1100);
      window.setTimeout(() => dittoPortrait('ditto', 1100), 1100);
      window.setTimeout(() => {
        setDitto?.('copy');
        dittoPortrait('copy', 1800);
      }, 2200);
      return;
    }
    const portrait = taps.current === 1 || sinceMood.current >= 3 || Math.random() < 0.3;
    if (portrait) {
      const options = TAP_MOODS.filter((m) => m !== lastMood.current);
      emote(options[Math.floor(Math.random() * options.length)]);
    } else {
      const lines = music ? [...LINES, `♪ ${music}`] : LINES;
      speak(lines[(taps.current - 1) % lines.length]);
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

  // Direction comes from the scroll step itself: the velocity value lags a frame, which used to
  // swallow the first scroll after a pause and leave it standing, glancing sideways.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const dy = y - (scrollY.getPrevious() ?? y);
    if (Math.abs(dy) < 0.5) return;
    window.clearTimeout(timers.current.idle);
    setFacing(dy > 0 ? 'down' : 'up');
    setFast(Math.abs(velocity.get()) > 1400);
    setWalking(true);
    window.clearTimeout(timers.current.stop);
    timers.current.stop = window.setTimeout(() => {
      setWalking(false);
      setFast(false);
      scheduleIdle();
    }, 180);
  });

  // The track's bottom is set so the runner, pinned at the track's end, stands exactly on the
  // campfire's left seat. It is at camp while pinned there, on the rail otherwise: pure layout,
  // read on every scroll, so a fling or a phone's bounce can't strand it.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const seatRow = () => document.querySelector('[data-seat-row]');
    const align = () => {
      const row = seatRow();
      const a = anchorRef.current;
      const b = boxRef.current;
      const parent = track.offsetParent;
      if (!row || !a || !b || !parent) return;
      const drop = b.getBoundingClientRect().bottom - a.getBoundingClientRect().top;
      const end = row.getBoundingClientRect().bottom - drop;
      track.style.bottom = `${(parent.getBoundingClientRect().bottom - end).toFixed(1)}px`;
    };
    const dock = () => {
      const a = anchorRef.current;
      if (!a) return;
      const at = a.getBoundingClientRect().top >= track.getBoundingClientRect().bottom - 1 ? 'camp' : 'rail';
      if (getDuo().camp !== at) setDuo({ camp: at });
    };
    const refit = () => {
      align();
      dock();
    };
    // keep measuring while the list's fade-in slide (a filter change) settles
    const until = performance.now() + 800;
    let raf = 0;
    const settle = () => {
      refit();
      if (performance.now() < until) raf = requestAnimationFrame(settle);
    };
    settle();
    const ro = new ResizeObserver(refit);
    ro.observe(document.body);
    window.addEventListener('scroll', dock, { passive: true });
    window.addEventListener('resize', refit);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('scroll', dock);
      window.removeEventListener('resize', refit);
      setDuo({ camp: 'rail' });
    };
  }, []);

  // an Imposter visit: fetch Ditto's portraits ahead of the unmasking
  useEffect(() => {
    if (ditto === 'off') return;
    Object.values(DITTO_ART).forEach((a) => { new Image().src = a.src; });
  }, [ditto]);

  useEffect(() => {
    const onReveal = (e: Event) => {
      // during fast scrolling, skip small reveal hops so running remains smooth and jitter-free
      if (Math.abs(velocity.get()) > 400) return;
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
    // no idle glances until the reader has scrolled and stopped: it faces you until then
    new Image().src = '/sprites/pikachu-moods.webp';

    // Hello: once per visit, the moment a scroll brings Pikachu fully into view (with room for
    // the portrait below the filter bar), it hops and throws a peace sign, even mid-scroll.
    let greeted = false;
    let settle = 0;
    const roomy = () => {
      const r = hopScope.current?.getBoundingClientRect();
      // the inline filter bar, or its fixed copy once that has slid in (a hidden copy sits above the top)
      const bars = [...document.querySelectorAll('[data-filter-bar]')].map((b) => b.getBoundingClientRect().bottom);
      if (!r) return false;
      const portraitTop = r.top - 100; // the framed portrait is ~95px tall above its head
      const floor = Math.max(0, ...bars) + 8;
      return portraitTop >= floor && r.bottom <= window.innerHeight - 8;
    };
    const tryGreet = () => {
      if (greeted || !roomy()) return;
      greeted = true;
      window.removeEventListener('scroll', greet);
      hop(12);
      emote('wink', 2800);
    };
    const greet = () => {
      cancelAnimationFrame(settle);
      settle = requestAnimationFrame(tryGreet);
    };
    window.addEventListener('scroll', greet, { passive: true });
    const t = timers.current;
    return () => {
      window.removeEventListener('timeline:reveal', onReveal);
      window.removeEventListener('scroll', greet);
      cancelAnimationFrame(settle);
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
      {/* The fill and the runner are position: sticky on the LINE viewport line, clamped to the
          track, so the browser moves them with the scroll itself: no per-frame script, no lag on
          a phone's momentum scroll. The fill is a long tail above the runner, clipped to the
          track and faded in over its first stretch. */}
      <span aria-hidden className="absolute inset-0 overflow-clip [mask-image:linear-gradient(to_bottom,transparent,black_200px)]">
        <span className="sticky top-[70svh] block h-0">
          <span className="absolute bottom-0 left-[16.5px] h-[150vh] w-[2px] rounded-full bg-gradient-to-b from-accent/0 via-accent/60 to-accent" />
        </span>
      </span>
      <div ref={anchorRef} className="sticky top-[70svh] z-20 h-0">
        <div ref={boxRef} className="absolute left-1/2 -translate-x-1/2 -translate-y-[62%]">
        <div ref={hopScope} data-rail-runner className={`relative ${away ? 'invisible' : ''}`}>
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
            {/* while music plays and it's standing still, it bobs to the beat */}
            <span key={stood} className={`block ${stood ? 'rail-stand' : ''}`}>
            <span className={`block ${music && !walking ? 'animate-[vibe_0.5s_ease-in-out_infinite]' : ''}`}>
              {ditto === 'off' || ditto === 'pika' ? (
                <Pikachu walking={walking} fast={fast} facing={facing} />
              ) : (
                <AnimatePresence mode="popLayout" initial={false}>
                  {/* the disguise melts into Ditto, then Ditto re-forms as its copy */}
                  <motion.span
                    key={ditto}
                    data-testid="rail-ditto"
                    data-stage={ditto}
                    className="block"
                    initial={{ scaleY: 0.2, scaleX: 1.4, opacity: 0 }}
                    animate={{ scaleY: 1, scaleX: 1, opacity: 1 }}
                    exit={{ scaleY: 0.2, scaleX: 1.5, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                    style={{ originY: 1 }}
                  >
                    {ditto === 'blob' ? <DittoSprite walking /> : <DittoPika walking={walking} facing={facing} />}
                  </motion.span>
                </AnimatePresence>
              )}
            </span>
            </span>
          </button>
          {music && !walking && (
            <span aria-hidden className="pointer-events-none absolute left-9 top-4">
              {['♪', '♫', '♪'].map((n, i) => (
                <span
                  key={i}
                  className="absolute text-[14px] text-accent"
                  style={{ animation: `note-float 2.4s ease-out ${(i * 0.8).toFixed(1)}s infinite` }}
                >
                  {n}
                </span>
              ))}
            </span>
          )}

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
                aria-label={bubble.kind === 'mood' ? `Pikachu is ${MOOD_LABEL[bubble.mood]}` : bubble.kind === 'ditto' ? DITTO_ART[bubble.art].label : bubble.text}
                className="pointer-events-none absolute bottom-[calc(100%-10px)] left-0 block"
                initial={{ opacity: 0, scale: 0.3, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -4 }}
                transition={{ type: 'spring', stiffness: 460, damping: 22 }}
                style={{ originX: '32px', originY: 1 }}
              >
                {bubble.kind !== 'text' ? (
                  <>
                    {/* frame echoes the art: navy double line on a yellow mat */}
                    <span className="block rounded-[8px] border-2 border-[#10061E] bg-[#F1C754] p-[4px] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.5)]">
                      <span className="block overflow-hidden rounded-[4px] border-[1.5px] border-[#10061E] bg-[#EEECEC]">
                        <span
                          className="block h-[72px] w-[72px]"
                          style={
                            bubble.kind === 'mood'
                              ? {
                                  backgroundImage: 'url(/sprites/pikachu-moods.webp)',
                                  backgroundSize: `${MOODS.length * 72}px 72px`,
                                  backgroundPositionX: `${-MOODS.indexOf(bubble.mood) * 72}px`,
                                }
                              : {
                                  backgroundImage: `url(${DITTO_ART[bubble.art].src})`,
                                  backgroundSize: `${DITTO_ART[bubble.art].frames * 72}px 72px`,
                                  backgroundPositionX: `${-bubble.frame * 72}px`,
                                }
                          }
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
        </div>
      </div>
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
function LeadRows({ github, spotify }: { github: GithubStats | null; spotify: SpotifyState | null }) {
  const next = useNextEvent();
  if (!next && !github && !spotify?.recent.length) return null;
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
      <OnRotation spotify={spotify} />
    </div>
  );
}

type BarProps = { active: FilterKey; shown: number; onChange: (key: FilterKey) => void };

// Editorial tab row on a hairline, in the same uppercase micro-label style as the links.
// `id` keeps the underline's layout animation apart when two copies are on the page.
function Tabs({ active, shown, onChange, id, right }: BarProps & { id: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-6 border-b border-rule">
      <nav
        aria-label={id === 'inline' ? 'Filter timeline' : undefined}
        className="-mb-px flex min-w-0 gap-6 overflow-x-auto pr-8 [mask-image:linear-gradient(to_right,black_calc(100%-40px),transparent)] [scrollbar-width:none] sm:gap-8 lg:pr-0 lg:[mask-image:none]"
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
                  layoutId={`filter-underline-${id}`}
                  className="absolute inset-x-0 bottom-0 h-[2px] bg-accent"
                  transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                />
              )}
            </button>
          );
        })}
      </nav>
      {right ?? (
        <p className="hidden shrink-0 pb-3.5 text-[12.5px] tabular-nums text-faint lg:block">
          {shown} {shown === 1 ? 'entry' : 'entries'}
        </p>
      )}
    </div>
  );
}

// Where the inline bar is: `past` once it has scrolled off the top, `ended` once the feed's end
// has too. Read once per frame, set only on change.
function useBarPlace(bar: React.RefObject<HTMLElement | null>, feedEl: React.RefObject<HTMLElement | null>) {
  const [place, setPlace] = useState({ past: false, ended: false });
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const past = !!bar.current && bar.current.getBoundingClientRect().top < 0;
      const ended = !!feedEl.current && feedEl.current.getBoundingClientRect().bottom < 120;
      setPlace((p) => (p.past === past && p.ended === ended ? p : { past, ended }));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, [bar, feedEl]);
  return place;
}

// The bar stays in the page; once it scrolls off the top, a position: fixed copy with the theme
// bolt slides in and takes over. A sticky bar shook on iPhone (WebKit repaints sticky elements
// while the toolbar collapses); a fixed one doesn't.
function FilterBar(props: BarProps & { feedEl: React.RefObject<HTMLDivElement | null> }) {
  const { feedEl, ...bar } = props;
  const ref = useRef<HTMLDivElement>(null);
  const place = useBarPlace(ref, feedEl);
  const shown = place.past && !place.ended;
  return (
    <>
      <div ref={ref} data-filter-bar className="-mx-5 mb-14 px-5 sm:-mx-8 sm:px-8">
        <Tabs {...bar} id="inline" />
      </div>
      <div
        data-filter-bar
        aria-hidden={!shown}
        inert={!shown}
        className={`fixed inset-x-0 top-0 z-30 bg-paper pt-[env(safe-area-inset-top)] transition-transform duration-300 ease-out ${shown ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <Tabs {...bar} id="fixed" right={<ThemeBolt className="mb-2 ml-1" />} />
        </div>
      </div>
    </>
  );
}

export default function Feed({ github = null }: { github?: GithubStats | null }) {
  const { data: spotify } = useSpotify();
  // a song a visitor started from the On rotation crate
  const [siteMusic, setSiteMusic] = useState<string | null>(null);
  useEffect(() => {
    const on = (e: Event) => setSiteMusic((e as CustomEvent<string | null>).detail);
    window.addEventListener('site-music', on);
    return () => window.removeEventListener('site-music', on);
  }, []);
  const music = siteMusic ?? (spotify?.isPlaying ? spotify.title ?? null : null);
  useEffect(() => setDuo({ music: !!music }), [music]);
  const [ditto, setDitto] = useState<DittoStage>('off');
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('ditto') || Math.random() < 0.1) setDitto('pika');
  }, []);
  useEffect(() => setDuo({ stage: ditto }), [ditto]);
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
        <FilterBar active={filter} shown={count} onChange={choose} feedEl={topRef} />
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
            <Rail
              startsAtRow={filter === 'all'}
              music={music}
              ditto={ditto}
              setDitto={setDitto}
            />
            {filter === 'all' && <LeadRows github={github} spotify={spotify} />}
            {groups.map(({ year, entries }) => (
              <YearSection key={year} year={year} entries={entries} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </FeedMode.Provider>
  );
}
