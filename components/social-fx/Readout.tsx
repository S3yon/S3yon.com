'use client';
// Readout: the icons stay still; the hovered one's name appears as a micro-label at the end of
// the row, so a visitor knows where a link goes before clicking. Touch skips it (a tap navigates).
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { linkProps, press, type VariantProps } from './shared';

export default function Readout({ socials, className, style }: VariantProps) {
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const label = socials.find((s) => s.name === active);
  return (
    <nav
      aria-label="Elsewhere"
      onTouchStart={() => {}}
      onPointerLeave={() => setActive(null)}
      className={`flex items-center gap-2 ${className ?? ''}`}
      style={style}
    >
      {socials.map((s) => (
        <a
          key={s.name}
          {...linkProps(s)}
          onPointerEnter={(e) => e.pointerType !== 'touch' && setActive(s.name)}
          onFocus={() => setActive(s.name)}
          onBlur={() => setActive(null)}
          className={`grid size-11 shrink-0 place-items-center rounded-full border border-chalk/15 text-chalk/60 transition-[color,border-color,transform] duration-150 ease-out active:border-chalk/45 active:text-chalk focus-visible:border-chalk/45 focus-visible:text-chalk [@media(hover:hover)]:hover:border-chalk/45 [@media(hover:hover)]:hover:text-chalk ${press}`}
        >
          {s.icon}
        </a>
      ))}
      <span aria-hidden className="relative ml-3 hidden h-4 min-w-0 flex-1 [@media(hover:hover)]:block">
        <AnimatePresence initial={false}>
          {label && (
            <motion.span
              key={label.name}
              initial={{ opacity: 0, x: reduce ? 0 : -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              className="absolute left-0 top-0 whitespace-nowrap font-display text-[11px] leading-4 tracking-[0.22em] text-chalk/65"
            >
              {label.name.toUpperCase()}
              {label.url.startsWith('mailto:') ? '' : ' ↗'}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </nav>
  );
}
