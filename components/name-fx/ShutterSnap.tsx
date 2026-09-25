'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Letters from './Letters';

// Click or tap the name to take a photo: a flash, the shutter closes and opens, and a
// polaroid of the name drops out, tilts, and fades after a moment.
export default function ShutterSnap({ text }: { text: string }) {
  const [shots, setShots] = useState<{ id: number; x: number; y: number; tilt: number }[]>([]);
  const [flash, setFlash] = useState(0);
  const n = useRef(0);
  const wrap = useRef<HTMLDivElement>(null);

  const snap = (e: React.PointerEvent) => {
    const box = wrap.current!.getBoundingClientRect();
    const id = ++n.current;
    setFlash(id);
    const tilt = ((id * 37) % 17) - 8;
    setShots((s) => [...s.slice(-2), { id, x: e.clientX - box.left, y: e.clientY - box.top, tilt }]);
    window.setTimeout(() => setShots((s) => s.filter((p) => p.id !== id)), 2600);
  };

  return (
    <div ref={wrap} onPointerDown={snap} className="relative cursor-pointer touch-manipulation overflow-hidden py-10">
      <Letters text={text} />

      {/* shutter blades: top and bottom close to the middle and open again */}
      <AnimatePresence>
        {flash > 0 && (
          <motion.div key={`s${flash}`} aria-hidden className="pointer-events-none absolute inset-0">
            {['top-0 origin-top', 'bottom-0 origin-bottom'].map((c) => (
              <motion.span
                key={c}
                className={`absolute inset-x-0 h-1/2 bg-black ${c}`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: [0, 1, 0] }}
                transition={{ duration: 0.18, times: [0, 0.45, 1], ease: 'easeInOut' }}
              />
            ))}
            <motion.span
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0] }}
              transition={{ duration: 0.45, times: [0, 0.35, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shots.map((s) => (
          <motion.div
            key={s.id}
            aria-hidden
            className="pointer-events-none absolute z-10 w-44 bg-[#F4F3F0] p-2 pb-7 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)]"
            style={{ left: s.x - 88, top: s.y - 60 }}
            initial={{ opacity: 0, y: -30, rotate: 0, scale: 0.6 }}
            animate={{ opacity: 1, y: 30, rotate: s.tilt, scale: 1 }}
            exit={{ opacity: 0, y: 70, transition: { duration: 0.5 } }}
            transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.15 }}
          >
            <div className="grid h-24 place-items-center bg-charcoal">
              <motion.span
                className="font-display text-[26px] leading-none text-chalk"
                initial={{ opacity: 0, filter: 'brightness(3)' }}
                animate={{ opacity: 1, filter: 'brightness(1)' }}
                transition={{ duration: 1.2, delay: 0.3 }}
              >
                {text}
              </motion.span>
            </div>
            <p className="mt-2 text-center font-sans text-[10px] tracking-wide text-ink/60">seyons.com · {new Date().getFullYear()}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
