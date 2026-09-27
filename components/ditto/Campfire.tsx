'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Pikachu, { type PikaFacing } from '../Pikachu';
import { DittoPika, DittoSprite } from './Ditto';
import { getDuo, setDuo, useDuo, type DittoStage } from '@/lib/duo';

// The footer campfire: the site's pixel sprites sitting round a pixel fire, right under the end
// of the timeline rail (Trailhead). Tap one and its hand-drawn art pops up above it, next mood each tap. Every 4th Ditto tap it transforms: the sprite becomes the
// lavender Pikachu and the portrait is Pikachu in Ditto's colours. The next tap turns it back.
//
// The rail runner (whoever it is) always takes the LEFT seat, nearest the rail; the other one
// waits in the RIGHT seat. When the runner reaches the end of the rail it takes one short hop down
// into its seat; the first bit of upward scroll sends it hopping back onto the line. Normally Ditto waits and Pikachu joins. On an Imposter
// visit Pikachu waits, and the rail's Ditto lands still in its disguise, then turns back into
// Ditto. Portraits pop by character, not seat. The footer's links send `campfire:flare` (the fire
// flares) and `campfire:welcome` (both turn to face you and hop).
const MOODS = 12; // frames in pikachu-moods.webp and ditto-moods.webp, same mood order
const COPIES = 3; // frames in ditto-pika.webp
const TRANSFORM_EVERY = 4;

function Portrait({ src, frames, frame, label }: { src: string; frames: number; frame: number; label: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      className="block h-[120px] w-[120px]"
      style={{ backgroundImage: `url(${src})`, backgroundSize: `${frames * 120}px 120px`, backgroundPositionX: `${-frame * 120}px` }}
    />
  );
}

// Two hand-placed pixel frames, swapped for the flicker. Each cell is one 4px pixel.
const FIRE = [
  ['...y....', '..yyo...', '..yoo.y.', '.yoooyy.', '.ooyooo.', 'oooyyooo', '.ooyyoo.', 'ww.oo.ww', '.wwwwww.', 'ww....ww'],
  ['....y...', '...oyy..', '.y.ooy..', '.yyoooy.', '.oooyoo.', 'oooyyooo', '.ooyyoo.', 'ww.oo.ww', '.wwwwww.', 'ww....ww'],
];
const PX: Record<string, string> = { y: '#F6CE3A', o: '#E8773A', w: '#7A4B34' };

function PixelFire({ flare }: { flare: boolean }) {
  const [f, setF] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setF((n) => 1 - n), 220);
    return () => clearInterval(t);
  }, []);
  return (
    <svg viewBox="0 0 8 10" width={40} height={50} shapeRendering="crispEdges" className="transition-transform duration-300" style={{ transform: flare ? 'scale(1.25)' : undefined, transformOrigin: '50% 100%' }}>
      {FIRE[f].flatMap((row, y) => [...row].map((ch, x) => (PX[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={PX[ch]} /> : null)))}
    </svg>
  );
}

// The portraits' frame: navy double line on a yellow mat.
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <span className="block rounded-[10px] border-2 border-[#10061E] bg-[#F1C754] p-[5px] shadow-[0_14px_30px_-16px_rgba(0,0,0,0.5)]">
      <span className="block overflow-hidden rounded-[5px] border-[1.5px] border-[#10061E] bg-[#EEECEC]">{children}</span>
    </span>
  );
}

type Look = 'pika' | 'copy' | 'ditto';
type Spot = { x: number; y: number; s: number }; // bottom-centre, page coordinates; s = scale against 64px
const railLook = (s: DittoStage): Look => (s === 'copy' ? 'copy' : s === 'blob' ? 'ditto' : 'pika');

function Sprite({ look, facing, walking = false }: { look: Look; facing: PikaFacing; walking?: boolean }) {
  if (look === 'ditto') return <DittoSprite facing={facing} walking={walking} />;
  if (look === 'copy') return <DittoPika facing={facing} walking={walking} />;
  return <Pikachu facing={facing} walking={walking} />;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const frame = () => new Promise((r) => requestAnimationFrame(() => r(null)));
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function spotOf(el: Element | null | undefined): Spot | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2 + window.scrollX, y: r.bottom + window.scrollY, s: r.height / 64 };
}
// Keep a start point inside the viewport, so a hop never begins off screen.
const onScreen = (p: Spot | null): Spot | null => (p ? { ...p, y: Math.min(p.y, window.scrollY + window.innerHeight - 6) } : null);

// Place the flyer: bottom-centre on p, squashed by sx/sy.
function put(el: HTMLElement, p: Spot, sx = 1, sy = 1) {
  el.style.transform = `translate(${p.x - 32}px, ${p.y - 64}px) scale(${p.s * sx}, ${p.s * sy})`;
  el.style.opacity = '1';
}
const EASE = { easeOut: (t: number) => 1 - (1 - t) * (1 - t), easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : 1 - (2 - 2 * t) ** 2 / 2) };
// A 0→1 tween on rAF. Resolves true when it runs to the end, false if `stop` cut it short.
const tween = (duration: number, onUpdate: (t: number) => void, ease: keyof typeof EASE = 'easeInOut', stop?: () => boolean) =>
  new Promise<boolean>((done) => {
    const t0 = performance.now();
    const step = (now: number) => {
      if (stop?.()) return done(false);
      const t = Math.min(1, (now - t0) / (duration * 1000));
      onUpdate(EASE[ease](t));
      if (t < 1) requestAnimationFrame(step);
      else done(true);
    };
    requestAnimationFrame(step);
  });

// A quadratic curve from a to b whose middle rises `lift` px above the higher end, head kept
// below the 64px sticky filter bar.
function arc(a: Spot, b: Spot, t: number, lift: number): Spot {
  const ceiling = window.scrollY + 64 + 64 * Math.max(a.s, b.s);
  const top = Math.max(Math.min(a.y, b.y) - lift, Math.min(ceiling, Math.min(a.y, b.y)));
  const cx = (a.x + b.x) / 2;
  const cy = 2 * top - (a.y + b.y) / 2;
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * cx + t * t * b.x, y: u * u * a.y + 2 * u * t * cy + t * t * b.y, s: lerp(a.s, b.s, t) };
}

// Three dust puffs kicked out sideways from a landing.
function puff(p: Spot) {
  const el = document.createElement('span');
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = `position:absolute;left:${p.x}px;top:${p.y}px;pointer-events:none;z-index:49;`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 600);
  [-1, 1, -0.4].forEach((d, i) => {
    const b = document.createElement('span');
    const r = (6 + i * 2) * p.s;
    b.style.cssText = `position:absolute;width:${r}px;height:${r}px;left:${-r / 2}px;top:${-r}px;border-radius:50%;background:rgba(150,140,130,0.45);`;
    el.appendChild(b);
    b.animate(
      [{ transform: 'translate(0,0) scale(0.4)', opacity: 0.9 }, { transform: `translate(${d * 22 * p.s}px,${-6 * p.s}px) scale(1.2)`, opacity: 0 }],
      { duration: 480, easing: 'cubic-bezier(0.2,0.7,0.3,1)', fill: 'forwards' },
    );
  });
}

// One hop: crouch, a smooth curve with a little stretch in the air, squash and dust on landing.
// Both ends are read every frame (the page scrolls and the rail's spring slides the runner), so
// the curve never starts from a stale spot. If `rush` turns true mid-hop (a fast scroll), it
// stops where it is and returns false; the caller swaps it straight into place.
async function hop(el: HTMLElement, from: () => Spot | null, to: () => Spot | null, lift: number, pace: number, rush: () => boolean) {
  let a = from();
  let b = to();
  if (!a || !b) return false;
  if (!(await tween(0.1 * pace, (t) => { a = from() ?? a!; put(el, a, 1 + 0.18 * t, 1 - 0.22 * t); }, 'easeOut', rush))) return false;
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const flew = await tween(clamp(0.45 + dist / 1800, 0.5, 0.9) * pace, (t) => {
    a = from() ?? a!;
    b = to() ?? b!;
    const k = Math.sin(t * Math.PI);
    put(el, arc(a, b, t, lift), 1 - 0.08 * k, 1 + 0.1 * k);
  }, 'easeInOut', rush);
  if (!flew) return false;
  puff(b);
  await tween(0.18 * pace, (t) => { b = to() ?? b!; put(el, b, 1.22 - 0.22 * t, 0.78 + 0.22 * t); }, 'easeOut', rush);
  return true;
}

// Warm light thrown by the fire, centred on it, flickering. The footer puts it behind the scene.
export function CampGlow({ size = 560, strong = 0.2 }: { size?: number; strong?: number }) {
  return (
    <span
      aria-hidden
      className="camp-glow pointer-events-none absolute left-[82px] top-[40px] -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full sm:left-[114px] sm:top-[56px]"
      style={{ width: size, height: size, background: `radial-gradient(closest-side, rgba(232,119,58,${strong}), rgba(232,119,58,${strong / 3}) 45%, transparent)` }}
    >
      <style>{`
        @keyframes camp-glow { 0%,100% { opacity: .85; transform: translate(-50%,-50%) scale(1); } 30% { opacity: 1; transform: translate(-50%,-50%) scale(1.04); } 60% { opacity: .75; transform: translate(-50%,-50%) scale(.98); } }
        .camp-glow { animation: camp-glow 2.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .camp-glow { animation: none; } }
      `}</style>
    </span>
  );
}
type Who = 'pika' | 'ditto';

export default function Campfire() {
  const [open, setOpen] = useState<null | { who: Who; left: number; top: number }>(null);
  const [mood, setMood] = useState(10);
  const [dtap, setDtap] = useState(0); // Ditto taps so far
  const copying = dtap > 0 && dtap % TRANSFORM_EVERY === 0;
  const [flare, setFlare] = useState(false);
  const [welcome, setWelcome] = useState(0); // >0: both turn to face you and hop (the footer asks)
  const box = useRef<HTMLDivElement>(null);
  const { stage } = useDuo();
  const imposter = stage !== 'off';
  const runnerWho: Who = imposter ? 'ditto' : 'pika';
  const waiterWho: Who = imposter ? 'pika' : 'ditto';
  // the left seat: empty (null) until the runner lands, then what it looks like
  const [join, setJoin] = useState<Look | null>(null);
  const [fly, setFly] = useState<{ look: Look; facing: PikaFacing; walking: boolean } | null>(null);
  const flyer = useRef<HTMLSpanElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const seat = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let seen = 0;
    let busy = false;
    let alive = true;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const runner = () => document.querySelector('[data-rail-runner] button');
    const from = () => spotOf(runner());
    const to = () => spotOf(seat.current);
    // Scroll speed in px/ms, smoothed; it counts as zero once scrolling has paused for 120ms.
    let speed = 0;
    let lastT = 0;
    const fast = () => performance.now() - lastT < 120 && speed > 3;
    // mount the flyer (starts at opacity 0) and return it once React has put it in the page
    const show = async (look: Look, facing: PikaFacing) => {
      setFly({ look, facing, walking: true });
      for (let i = 0; i < 4 && !flyer.current; i++) await frame();
      return flyer.current;
    };
    // after landing in its disguise, an Imposter Ditto turns back into itself
    let swap = 0;
    const seatIn = (look: Look) => {
      setJoin(look);
      if (look !== 'ditto' && getDuo().stage !== 'off') swap = window.setTimeout(() => setJoin('ditto'), 450);
    };
    // No flight when it can't read well: reduced motion, a fast scroll, or ends far apart.
    // Then it's an instant swap with a dust puff where it lands.
    const skip = () => {
      const a = from();
      const b = to();
      return reduce || fast() || !a || !b || Math.abs(a.y - b.y) > window.innerHeight * 1.5;
    };
    // The hand-off: the flyer is placed and shown on the source's spot first, and only then is
    // the source hidden, so there is never a frame with nobody on screen. Landing is the same in
    // reverse: the destination shows, then the flyer goes a frame later.
    const fly1 = async (look: Look, dir: 'down' | 'up', hideSource: () => void) => {
      const el = await show(look, dir);
      const src = dir === 'down' ? from : () => onScreen(to());
      const dst = dir === 'down' ? to : from;
      const a = src();
      if (!el || !a || skip()) {
        hideSource();
        return false;
      }
      put(el, a);
      hideSource();
      try {
        return dir === 'down' ? await hop(el, src, dst, 22, 0.8, fast) : await hop(el, src, dst, 44, 0.75, fast);
      } catch {
        return false; // never leave the runner stuck mid-air
      }
    };
    const down = async () => {
      busy = true;
      const look = railLook(getDuo().stage);
      if (skip()) {
        seatIn(look);
        setDuo({ camp: 'camp' });
        const b = to();
        if (b && !reduce) puff(b);
      } else {
        const flew = await fly1(look, 'down', () => setDuo({ camp: 'flying' }));
        if (!alive) return;
        if (!flew) { const b = to(); if (b && !reduce) puff(b); }
        seatIn(look);
        await frame();
        setFly(null);
        if (flew && look !== 'ditto' && getDuo().stage !== 'off') await wait(450);
        setDuo({ camp: 'camp' });
      }
      busy = false;
      settle();
    };
    const up = async () => {
      busy = true;
      clearTimeout(swap);
      const look = railLook(getDuo().stage);
      if (skip()) {
        setJoin(null);
        setDuo({ camp: 'rail' });
        const a = from();
        if (a && !reduce) puff(a);
      } else {
        if (getDuo().stage !== 'off' && look !== 'ditto') {
          setJoin(look); // back into the disguise before it jumps
          await wait(180);
        }
        const flew = await fly1(look, 'up', () => { setDuo({ camp: 'flying' }); setJoin(null); });
        if (!alive) return;
        if (!flew) { const a = from(); if (a && !reduce) puff(a); }
        setDuo({ camp: 'rail' });
        await frame();
        setFly(null);
      }
      busy = false;
      settle();
    };
    // Going down, the runner has reached the end of the rail, just above the seat. Going
    // up, the first bit of upward scroll sends it back to the end of the line, while the seat is
    // still on screen (the rail's end sits well above the runner's line at the page bottom, so
    // waiting for the gap to grow would start the hop off screen). `way` is the last scroll
    // direction, `climbed` the upward scroll since it sat down.
    let way = 0;
    let climbed = 0;
    let lastY = window.scrollY;
    const gap = () => {
      const a = spotOf(runner());
      const b = spotOf(seat.current);
      return a && b ? b.y - a.y : Infinity;
    };
    const check = () => {
      if (busy || !alive) return;
      const at = getDuo().camp;
      const reach = 64 * (spotOf(seat.current)?.s ?? 1) + 120;
      if (at === 'rail' && seen > 0 && gap() < reach && way >= 0) down();
      else if (at === 'camp' && climbed > 24) up();
    };
    let raf = 0;
    let until = 0;
    const poll = () => {
      raf = 0;
      check();
      if (performance.now() < until) raf = requestAnimationFrame(poll);
    };
    // re-check for a moment: after a scroll, and after a hop (the spring may still be moving)
    const settle = () => {
      until = performance.now() + 1200;
      if (!raf) raf = requestAnimationFrame(poll);
    };
    const onScroll = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      const now = performance.now();
      if (dy) {
        way = Math.sign(dy);
        climbed = dy < 0 && getDuo().camp === 'camp' ? climbed - dy : 0;
        const v = Math.abs(dy) / Math.max(8, now - lastT);
        speed = now - lastT > 120 ? v : 0.5 * speed + 0.5 * v;
        lastT = now;
      }
      settle();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const io = new IntersectionObserver(([e]) => { seen = e.intersectionRatio; onScroll(); }, { threshold: [0, 0.2, 0.6, 1] });
    if (row.current) io.observe(row.current);
    return () => {
      alive = false;
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(swap);
      window.removeEventListener('scroll', onScroll);
      setDuo({ camp: 'rail' });
    };
  }, []);

  // anything on the page can stoke the fire (the footer's links do, on hover)
  useEffect(() => {
    let t = 0;
    const on = () => { setFlare(true); clearTimeout(t); t = window.setTimeout(() => setFlare(false), 400); };
    let w = 0;
    const hi = () => { setWelcome((n) => n + 1); clearTimeout(w); w = window.setTimeout(() => setWelcome(0), 1600); };
    window.addEventListener('campfire:flare', on);
    window.addEventListener('campfire:welcome', hi);
    return () => { clearTimeout(t); clearTimeout(w); window.removeEventListener('campfire:flare', on); window.removeEventListener('campfire:welcome', hi); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const off = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(null); };
    document.addEventListener('pointerdown', off);
    return () => document.removeEventListener('pointerdown', off);
  }, [open]);

  // the portrait pops up centred over whoever was tapped, its bottom just above their head
  const tap = (who: Who, el: HTMLElement) => {
    const b = box.current!.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const pos = { who, left: Math.max(-14, r.left + r.width / 2 - b.left - 68), top: r.top - b.top - 146 };
    if (who === 'pika') setMood((m) => (open?.who === 'pika' ? (m + 1) % MOODS : m));
    else setDtap((d) => d + 1);
    setOpen(pos);
  };
  const character = (who: Who, side: PikaFacing) => {
    const facing = welcome ? 'down' : side;
    return who === 'pika' ? <Pikachu walking={false} facing={facing} /> : copying ? <DittoPika facing={facing} /> : <DittoSprite facing={facing} />;
  };

  return (
    <div
      ref={box}
      data-open={open?.who ?? ''}
      data-copying={copying ? '1' : ''}
      className="relative mt-3 h-16 sm:h-24"
    >
      {open && (
        <div className="duo-pop absolute z-30" style={{ left: open.left, top: open.top }}>
          <Frame>
            {open.who === 'pika' ? (
              <Portrait src="/sprites/pikachu-moods.webp" frames={MOODS} frame={mood} label="Pikachu portrait" />
            ) : copying ? (
              <Portrait src="/sprites/ditto-pika.webp" frames={COPIES} frame={(dtap / TRANSFORM_EVERY - 1) % COPIES} label="Ditto as Pikachu portrait" />
            ) : (
              <Portrait src="/sprites/ditto-moods.webp" frames={MOODS} frame={(dtap - 1 - Math.floor(dtap / TRANSFORM_EVERY)) % MOODS} label="Ditto portrait" />
            )}
          </Frame>
        </div>
      )}
      <style>{`
        @keyframes duo-pop { from { transform: translateY(8px) scale(0.9); opacity: 0; } to { transform: none; opacity: 1; } }
        .duo-pop { animation: duo-pop 180ms ease-out; }
        @keyframes duo-swap { from { transform: scale(1.4, 0.3); } to { transform: none; } }
        .duo-swap { animation: duo-swap 320ms cubic-bezier(0.3, 1.6, 0.5, 1); transform-origin: 50% 100%; }
        @keyframes duo-hi { 0%, 100% { transform: none; } 35% { transform: translateY(-9px); } 60% { transform: translateY(0) scale(1.08, 0.92); } }
        .duo-hi { animation: duo-hi 420ms ease-out; }
        @media (prefers-reduced-motion: reduce) { .duo-hi { animation: none; } }
      `}</style>
      <div
        ref={row}
        className="absolute bottom-0 left-[-14.5px] flex origin-bottom-left items-end gap-3 sm:left-[-30.5px] sm:scale-150"
      >
        {/* left seat: the rail runner */}
        <button type="button" aria-label={runnerWho === 'pika' ? 'Pikachu' : 'Ditto'} data-seat="left" disabled={!join} onClick={(e) => tap(runnerWho, e.currentTarget)} className="cursor-pointer transition-transform hover:-translate-y-0.5 disabled:cursor-default">
          <span ref={seat} key={`hi${welcome}`} className={`block ${join ? '' : 'invisible'} ${welcome ? 'duo-hi' : ''}`}>
            <span key={imposter ? join ?? '' : ''} className="duo-swap block">
              {imposter && join && join !== 'ditto' ? <Sprite look={join} facing="right" /> : character(runnerWho, 'right')}
            </span>
          </span>
        </button>
        <button type="button" aria-label="Campfire" onClick={() => { setFlare(true); setTimeout(() => setFlare(false), 400); }} className="mb-2">
          <PixelFire flare={flare} />
        </button>
        {/* right seat: the one who waits */}
        <button type="button" aria-label={waiterWho === 'pika' ? 'Pikachu' : 'Ditto'} data-seat="right" onClick={(e) => tap(waiterWho, e.currentTarget)} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <span key={`hi${welcome}`} className={`block ${welcome ? 'duo-hi' : ''}`}>{character(waiterWho, 'left')}</span>
        </button>
      </div>
      {fly &&
        createPortal(
          <span ref={flyer} aria-hidden data-flyer className="pointer-events-none absolute left-0 top-0 z-50 block h-16 w-16" style={{ transformOrigin: '50% 100%', opacity: 0 }}>
            <Sprite look={fly.look} facing={fly.facing} walking={fly.walking} />
          </span>,
          document.body,
        )}
    </div>
  );
}
