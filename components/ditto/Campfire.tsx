'use client';
import { useEffect, useRef, useState } from 'react';
import Pikachu, { type PikaFacing } from '../Pikachu';
import { DittoPika, DittoSprite } from './Ditto';
import { DANCE_CSS, danceStep, useBeat } from './dance';
import { useDuo, type DittoStage } from '@/lib/duo';

// The footer campfire: the site's pixel sprites sitting round a pixel fire, right under the end
// of the timeline rail (Trailhead). Tap one and its hand-drawn art pops up above it, next mood each tap. Every 4th Ditto tap it transforms: the sprite becomes the
// lavender Pikachu and the portrait is Pikachu in Ditto's colours. The next tap turns it back.
//
// The rail runner (whoever it is) always takes the LEFT seat, nearest the rail; the other one
// waits in the RIGHT seat. The rail ends on the left seat (Feed.tsx), so the runner walks into it
// and the seated sprite takes over on the same spot, no hop; scrolling up hands it back. Normally
// Ditto waits and Pikachu joins. On an Imposter visit Pikachu waits, and the rail's Ditto sits
// down still in its disguise, then turns back into Ditto. Portraits pop by character, not seat.
// The footer's links send `campfire:flare` (the fire flares) and `campfire:welcome` (both turn to
// face you and hop).
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
  const { stage, music, camp } = useDuo();
  // while music plays they dance (dance.ts); a welcome from the footer takes over for its hop
  const beat = useBeat(music);
  const step = welcome ? null : danceStep(beat);
  const [beatFlare, setBeatFlare] = useState(false);
  useEffect(() => {
    if (!step?.flare) return;
    setBeatFlare(true);
    const t = setTimeout(() => setBeatFlare(false), 200);
    return () => clearTimeout(t);
  }, [beat, step?.flare]);
  const imposter = stage !== 'off';
  const runnerWho: Who = imposter ? 'ditto' : 'pika';
  const waiterWho: Who = imposter ? 'pika' : 'ditto';
  // the left seat: empty (null) until the runner reaches it, then what it looks like. An
  // Imposter Ditto sits down in its disguise and turns back into itself a moment later.
  const seated = camp === 'camp';
  const [unmasked, setUnmasked] = useState(false);
  useEffect(() => {
    setUnmasked(false);
    if (!seated || !imposter) return;
    const t = setTimeout(() => setUnmasked(true), 450);
    return () => clearTimeout(t);
  }, [seated, imposter]);
  const join: Look | null = !seated ? null : imposter ? (unmasked ? 'ditto' : railLook(stage)) : 'pika';

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
  const danceFacing = (side: PikaFacing) => (step ? (side === 'right' ? step.left : step.right) : side);
  const character = (who: Who, side: PikaFacing) => {
    const facing = welcome ? 'down' : danceFacing(side);
    const walking = !!step?.walking;
    return who === 'pika' ? <Pikachu walking={walking} facing={facing} /> : copying ? <DittoPika facing={facing} walking={walking} /> : <DittoSprite facing={facing} walking={walking} />;
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
        @keyframes duo-sit { from { transform: scale(0.667); } to { transform: none; } }
        @media (min-width: 640px) { .duo-sit { animation: duo-sit 200ms ease-out; transform-origin: 50% 100%; } }
        @media (prefers-reduced-motion: reduce) { .duo-hi, .duo-sit { animation: none; } }
        ${DANCE_CSS}
      `}</style>
      <div
        data-seat-row
        className="absolute bottom-0 left-[-14.5px] flex origin-bottom-left items-end gap-3 sm:left-[-30.5px] sm:scale-150"
      >
        {/* left seat: the rail runner */}
        <button type="button" aria-label={runnerWho === 'pika' ? 'Pikachu' : 'Ditto'} data-seat="left" disabled={!join} onClick={(e) => tap(runnerWho, e.currentTarget)} className="cursor-pointer transition-transform hover:-translate-y-0.5 disabled:cursor-default">
          <span key={`hi${welcome}`} className={`block ${join ? 'duo-sit' : 'invisible'} ${welcome ? 'duo-hi' : ''}`}>
            <span key={imposter ? join ?? '' : ''} className="duo-swap block">
              <span key={step?.key} className={`block ${step?.lc ?? ''}`}>
                {imposter && join && join !== 'ditto' ? <Sprite look={join} facing={danceFacing('right')} walking={!!step?.walking} /> : character(runnerWho, 'right')}
              </span>
            </span>
          </span>
        </button>
        <button type="button" aria-label="Campfire" onClick={() => { setFlare(true); setTimeout(() => setFlare(false), 400); }} className="mb-2">
          <PixelFire flare={flare || beatFlare} />
        </button>
        {/* right seat: the one who waits */}
        <button type="button" aria-label={waiterWho === 'pika' ? 'Pikachu' : 'Ditto'} data-seat="right" onClick={(e) => tap(waiterWho, e.currentTarget)} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <span key={`hi${welcome}`} className={`block ${welcome ? 'duo-hi' : ''}`}>
            <span key={step?.key} className={`block ${step?.rc ?? ''}`}>{character(waiterWho, 'left')}</span>
          </span>
        </button>
      </div>
    </div>
  );
}
