'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { animate } from 'motion/react';
import Pikachu, { type PikaFacing } from '../Pikachu';
import { DittoPika, DittoSprite } from './Ditto';
import { getDuo, setDuo, useDuo, type DittoStage } from '@/lib/duo';

// The footer campfire: the site's pixel sprites sitting round a pixel fire. Tap one and its hand-drawn art pops
// up above it, next mood each tap. Every 4th Ditto tap it transforms: the sprite becomes the
// lavender Pikachu and the portrait is Pikachu in Ditto's colours. The next tap turns it back.
//
// One of them waits here and the other is the rail runner: when the fire scrolls into view the
// runner jumps off the end of the timeline into its seat, and jumps back when you scroll up.
// Normally Ditto waits and Pikachu joins. On an Imposter visit Pikachu waits, and the rail's
// Ditto lands still in its disguise, then turns back into Ditto.
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
const railLook = (s: DittoStage): Look => (s === 'copy' ? 'copy' : s === 'blob' ? 'ditto' : 'pika');

function Sprite({ look, facing, walking = false }: { look: Look; facing: PikaFacing; walking?: boolean }) {
  if (look === 'ditto') return <DittoSprite facing={facing} walking={walking} />;
  if (look === 'copy') return <DittoPika facing={facing} walking={walking} />;
  return <Pikachu facing={facing} walking={walking} />;
}

// Bottom-centre of an element in page coordinates, and its scale against the 64px sprite.
function spot(el: Element) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2 + window.scrollX, y: r.bottom + window.scrollY, s: r.height / 64 };
}
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const frame = () => new Promise((r) => requestAnimationFrame(() => r(null)));

export default function Campfire() {
  const [open, setOpen] = useState<null | 'pika' | 'ditto'>(null);
  const [mood, setMood] = useState(10);
  const [dtap, setDtap] = useState(0); // Ditto taps so far
  const copying = dtap > 0 && dtap % TRANSFORM_EVERY === 0;
  const [flare, setFlare] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const { stage } = useDuo();
  const imposter = stage !== 'off';
  // the rail runner's seat: empty (null) until it lands, then what it looks like
  const [join, setJoin] = useState<Look | null>(null);
  const [fly, setFly] = useState<{ look: Look; facing: PikaFacing } | null>(null);
  const flyer = useRef<HTMLSpanElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const seat = useRef<{ pika: HTMLSpanElement | null; ditto: HTMLSpanElement | null }>({ pika: null, ditto: null });

  useEffect(() => {
    let seen = 0;
    let busy = false;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const runner = () => document.querySelector('[data-rail-runner] button');
    const target = () => seat.current[getDuo().stage === 'off' ? 'pika' : 'ditto'];
    // wait until the page and the rail's spring stop moving, so the arc is measured where it ends up
    const settle = async () => {
      let last = NaN;
      for (let i = 0, still = 0; i < 45 && still < 4; i++) {
        await frame();
        const r = runner()?.getBoundingClientRect();
        const y = (r ? r.top : 0) + window.scrollY;
        still = Math.abs(y - last) < 0.5 ? still + 1 : 0;
        last = y;
      }
    };
    // an arc: a small hop up off the start, then a fall into the end, peaking below the sticky filter bar
    const jump = async (from: ReturnType<typeof spot>, to: ReturnType<typeof spot>, look: Look, facing: PikaFacing) => {
      if (reduce || Math.abs(to.y - from.y) > window.innerHeight * 2) return;
      setFly({ look, facing });
      await frame();
      if (!flyer.current) return;
      const top = Math.max(Math.min(from.y, to.y) - 70, window.scrollY + 64 + 64 * Math.max(from.s, to.s));
      await animate(
        flyer.current,
        {
          x: [from.x - 32, from.x + (to.x - from.x) * 0.3 - 32, to.x - 32],
          y: [from.y - 64, top - 64, to.y - 64],
          scale: [from.s, from.s + (to.s - from.s) * 0.3, to.s],
        },
        { duration: 0.8, times: [0, 0.3, 1], ease: ['easeOut', 'easeIn'] },
      );
    };
    const down = async () => {
      busy = true;
      await settle();
      const look = railLook(getDuo().stage);
      setDuo({ camp: 'flying' });
      const r = runner();
      const t = target();
      if (r && t) await jump(spot(r), spot(t), look, 'down');
      setFly(null);
      setJoin(look);
      if (look !== 'ditto' && getDuo().stage !== 'off') {
        await wait(450);
        setJoin('ditto');
      }
      setDuo({ camp: 'camp' });
      busy = false;
      check();
    };
    const up = async () => {
      busy = true;
      const look = railLook(getDuo().stage);
      if (getDuo().stage !== 'off' && look !== 'ditto') {
        setJoin(look);
        await wait(350);
      }
      await settle();
      setDuo({ camp: 'flying' });
      const t = target();
      const from = t && spot(t);
      setJoin(null);
      const r = runner();
      if (r && from) await jump(from, spot(r), look, 'up');
      setFly(null);
      setDuo({ camp: 'rail' });
      busy = false;
      check();
    };
    const check = () => {
      if (busy) return;
      const at = getDuo().camp;
      if (seen >= 0.6 && at === 'rail') down();
      else if (seen < 0.2 && at === 'camp') up();
    };
    const io = new IntersectionObserver(([e]) => { seen = e.intersectionRatio; check(); }, { threshold: [0, 0.2, 0.6, 1] });
    if (row.current) io.observe(row.current);
    return () => { io.disconnect(); setDuo({ camp: 'rail' }); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const off = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(null); };
    document.addEventListener('pointerdown', off);
    return () => document.removeEventListener('pointerdown', off);
  }, [open]);
  const tapPika = () => { setMood((m) => (open === 'pika' ? (m + 1) % MOODS : m)); setOpen('pika'); };
  const tapDitto = () => { setDtap((d) => d + 1); setOpen('ditto'); };
  return (
    <div ref={box} data-open={open ?? ''} data-copying={copying ? '1' : ''} className="relative h-[260px] w-[300px]">
      {open && (
        <div className="duo-pop absolute top-0 z-10" style={{ left: open === 'pika' ? 166 : 0 }}>
          <Frame>
            {open === 'pika' ? (
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
      `}</style>
      <div ref={row} className="absolute bottom-2 left-0 right-0 flex origin-bottom scale-150 items-end justify-center gap-3">
        <button type="button" aria-label="Ditto" disabled={imposter && !join} onClick={tapDitto} className="cursor-pointer transition-transform hover:-translate-y-0.5 disabled:cursor-default">
          <span ref={(el) => { seat.current.ditto = el; }} className={`block ${imposter && !join ? 'invisible' : ''}`}>
            <span key={imposter ? join ?? '' : ''} className="duo-swap block">
              {imposter && join && join !== 'ditto' ? <Sprite look={join} facing="right" /> : copying ? <DittoPika facing="right" /> : <DittoSprite facing="right" />}
            </span>
          </span>
        </button>
        <button type="button" aria-label="Campfire" onClick={() => { setFlare(true); setTimeout(() => setFlare(false), 400); }} className="mb-2">
          <PixelFire flare={flare} />
        </button>
        <button type="button" aria-label="Pikachu" disabled={!imposter && !join} onClick={tapPika} className="cursor-pointer transition-transform hover:-translate-y-0.5 disabled:cursor-default">
          <span ref={(el) => { seat.current.pika = el; }} className={`block ${!imposter && !join ? 'invisible' : ''}`}>
            <Pikachu walking={false} facing="left" />
          </span>
        </button>
      </div>
      {fly &&
        createPortal(
          <span ref={flyer} aria-hidden className="pointer-events-none absolute left-0 top-0 z-50 block h-16 w-16" style={{ transformOrigin: '50% 100%' }}>
            <Sprite look={fly.look} facing={fly.facing} walking />
          </span>,
          document.body,
        )}
    </div>
  );
}
