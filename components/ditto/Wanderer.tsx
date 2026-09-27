'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimate } from 'motion/react';
import type { PikaFacing } from '../Pikachu';
import { DittoSprite, DittoPika } from './Ditto';
import Bubble from './Bubble';

// Ditto lives along the bottom edge of the timeline and roams on its own: walks somewhere,
// stops, looks at you, wanders off again. Tap it and it copies Pikachu for a few seconds (a
// lavender Pikachu), then slumps back into itself and finishes its walk.
export default function Wanderer() {
  const box = useRef<HTMLDivElement>(null);
  const [scope, animate] = useAnimate();
  const [walking, setWalking] = useState(false);
  const [facing, setFacing] = useState<PikaFacing>('down');
  const [copy, setCopy] = useState(false);
  const [line, setLine] = useState<{ id: number; text: string | null }>({ id: 0, text: null });
  const x = useRef(40);
  const paused = useRef(false);
  const leg = useRef<{ facing: PikaFacing; walk: { pause: () => void; play: () => void } } | null>(null);

  useEffect(() => {
    let alive = true;
    let t = 0;
    const wait = (ms: number) => new Promise<void>((r) => { t = window.setTimeout(r, ms); });
    (async () => {
      await wait(600);
      while (alive) {
        if (paused.current) { await wait(300); continue; }
        const w = (box.current?.clientWidth ?? 400) - 64;
        const to = Math.round(Math.random() * w);
        const dist = Math.abs(to - x.current);
        if (dist < 40) continue;
        const dir: PikaFacing = to > x.current ? 'right' : 'left';
        setFacing(dir);
        setWalking(true);
        const walk = animate(scope.current, { x: to }, { duration: dist / 55, ease: 'linear' });
        leg.current = { facing: dir, walk };
        await walk;
        leg.current = null;
        if (!alive) return;
        x.current = to;
        setWalking(false);
        setFacing('down');
        await wait(1200 + Math.random() * 2200);
      }
    })();
    return () => { alive = false; window.clearTimeout(t); };
  }, [animate, scope]);

  const tap = () => {
    if (copy) return;
    paused.current = true;
    leg.current?.walk.pause();
    setCopy(true);
    setWalking(false);
    setFacing('down');
    setLine((l) => ({ id: l.id + 1, text: 'Pika?' }));
    window.setTimeout(() => setLine((l) => ({ ...l, text: null })), 1400);
    window.setTimeout(() => {
      setCopy(false);
      paused.current = false;
      // mid-leg: pick the walk back up, frames and all
      if (leg.current) {
        setFacing(leg.current.facing);
        setWalking(true);
        leg.current.walk.play();
      }
    }, 3200);
  };

  return (
    <div ref={box} className="relative mt-6 h-16 w-full">
      <div ref={scope} data-testid="wanderer" data-walking={walking} data-copy={copy} className="absolute bottom-0 left-0" style={{ transform: 'translateX(40px)' }}>
        <div className="relative">
          <button type="button" aria-label="Ditto" onClick={tap} className="block cursor-pointer">
            <motion.span key={String(copy)} className="block" initial={{ scaleY: 0.3, scaleX: 1.4 }} animate={{ scaleY: 1, scaleX: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 16 }} style={{ originY: 1 }}>
              {copy ? <DittoPika /> : <DittoSprite walking={walking} facing={facing} />}
            </motion.span>
          </button>
          <Bubble id={line.id} text={line.text} />
        </div>
      </div>
    </div>
  );
}
