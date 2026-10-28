'use client';
// Dock, contained: the macOS-dock swell kept, but smaller (44 to 52px) and inside a row that
// reserves the room, so a swollen icon never reaches the name. Touch and reduced motion stay still.
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useRef } from 'react';
import type { Social } from '@/lib/socials';
import { linkProps, press, type VariantProps } from './shared';

function Item({ mouseX, social }: { mouseX: MotionValue<number>; social: Social }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const dist = useTransform(mouseX, (x) => {
    const b = ref.current?.getBoundingClientRect();
    return b ? x - (b.left + b.width / 2) : 9999;
  });
  const size = useSpring(useTransform(dist, [-110, 0, 110], [44, 52, 44]), { mass: 0.1, stiffness: 170, damping: 17 });
  return (
    <motion.a
      ref={ref}
      {...linkProps(social)}
      style={{ width: size, height: size }}
      className={`grid shrink-0 place-items-center rounded-full border border-chalk/15 text-chalk/60 transition-[color,border-color,transform] duration-150 ease-out active:border-chalk/45 active:text-chalk focus-visible:border-chalk/45 focus-visible:text-chalk [@media(hover:hover)]:hover:border-chalk/45 [@media(hover:hover)]:hover:text-chalk ${press}`}
    >
      {social.icon}
    </motion.a>
  );
}

export default function DockContained({ socials, className, style }: VariantProps) {
  const mouseX = useMotionValue(Infinity);
  const reduce = useReducedMotion();
  return (
    // the row is 52px tall and centres the icons, so the swell stays inside it
    <nav
      aria-label="Elsewhere"
      onPointerMove={(e) => !reduce && e.pointerType !== 'touch' && mouseX.set(e.clientX)}
      onPointerLeave={() => mouseX.set(Infinity)}
      onTouchStart={() => {}}
      className={`flex h-[52px] items-center gap-2 ${className ?? ''}`}
      style={style}
    >
      {socials.map((s) => (
        <Item key={s.name} mouseX={mouseX} social={s} />
      ))}
    </nav>
  );
}
