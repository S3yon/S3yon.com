'use client';
// Dock socials (chosen 2026-10-11 from the design lab): with a mouse, the round icons swell like
// the macOS dock as the pointer passes. Fingers get the plain row with a press-in: a phone row has
// no room to grow, and a tap navigates at once.
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useRef } from 'react';
import type { Social } from '@/lib/socials';

function Item({ mouseX, social }: { mouseX: MotionValue<number>; social: Social }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const dist = useTransform(mouseX, (x) => {
    const b = ref.current?.getBoundingClientRect();
    return b ? x - (b.left + b.width / 2) : 9999;
  });
  const size = useSpring(useTransform(dist, [-130, 0, 130], [44, 64, 44]), { mass: 0.1, stiffness: 160, damping: 14 });
  const mail = social.url.startsWith('mailto:');
  return (
    <motion.a
      ref={ref}
      href={social.url}
      aria-label={social.name}
      title={social.name}
      target={mail ? undefined : '_blank'}
      rel={mail ? undefined : 'noopener noreferrer'}
      style={{ width: size, height: size }}
      className="grid shrink-0 place-items-center rounded-full border border-chalk/15 text-chalk/60 transition-[color,border-color,transform] duration-150 [-webkit-tap-highlight-color:transparent] active:scale-90 active:border-chalk/45 active:text-chalk focus-visible:border-chalk/45 focus-visible:text-chalk focus-visible:outline-none [@media(hover:hover)]:hover:border-chalk/45 [@media(hover:hover)]:hover:text-chalk"
    >
      {social.icon}
    </motion.a>
  );
}

export default function SocialDock({ socials, className, style }: { socials: Social[]; className?: string; style?: React.CSSProperties }) {
  const mouseX = useMotionValue(Infinity);
  return (
    // the row keeps the plain 44px height; swollen icons grow up into the gap under the name
    <nav
      aria-label="Elsewhere"
      onPointerMove={(e) => e.pointerType !== 'touch' && mouseX.set(e.clientX)}
      onPointerLeave={() => mouseX.set(Infinity)}
      // iOS Safari only shows :active (the press-in) when a touch listener exists
      onTouchStart={() => {}}
      className={`flex h-11 items-end gap-2 ${className ?? ''}`}
      style={style}
    >
      {socials.map((s) => (
        <Item key={s.name} mouseX={mouseX} social={s} />
      ))}
    </nav>
  );
}
