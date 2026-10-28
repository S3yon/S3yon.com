'use client';
// Rail: bare icons, no rings. A chalk hairline slides under the hovered icon, the same hairline
// the timeline uses for its rules. Everything stays inside the row's own 44px.
import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { linkProps, press, type VariantProps } from './shared';

export default function Rail({ socials, className, style }: VariantProps) {
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();
  return (
    <nav
      aria-label="Elsewhere"
      onTouchStart={() => {}}
      onPointerLeave={() => setActive(null)}
      className={`-ml-3 flex gap-1 ${className ?? ''}`}
      style={style}
    >
      {socials.map((s) => (
        <a
          key={s.name}
          {...linkProps(s)}
          onPointerEnter={(e) => e.pointerType !== 'touch' && setActive(s.name)}
          onFocus={() => setActive(s.name)}
          onBlur={() => setActive(null)}
          className={`relative grid size-11 shrink-0 place-items-center text-chalk/55 transition-[color,transform] duration-150 ease-out active:text-chalk focus-visible:text-chalk [@media(hover:hover)]:hover:text-chalk ${press}`}
        >
          {s.icon}
          {active === s.name && (
            <motion.span
              layoutId="social-rail"
              aria-hidden
              transition={reduce ? { duration: 0 } : { type: 'spring', duration: 0.3, bounce: 0 }}
              className="absolute inset-x-0 bottom-1 mx-auto h-px w-5 bg-chalk"
            />
          )}
        </a>
      ))}
    </nav>
  );
}
