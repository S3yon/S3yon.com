'use client';

import { motion } from 'motion/react';
import { useTheme } from '@/lib/theme';

// 4 · Side A / Side B: a small record; tap it and it flips over in 3D. Side A is light, side
// B is dark, each with its own label.
export default function RecordFlip() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  const face = (label: string, color: string) => (
    <span
      className="absolute inset-0 grid place-items-center rounded-full [backface-visibility:hidden]"
      style={{ background: 'repeating-radial-gradient(circle, #111 0 1px, #232323 1px 2px)' }}
    >
      <span className="grid h-5 w-5 place-items-center rounded-full font-display text-[8px] text-[#18181A]" style={{ background: color }}>
        {label}
      </span>
    </span>
  );
  return (
    <button type="button" onClick={toggle} aria-label={dark ? 'Flip to side A, light' : 'Flip to side B, dark'} className="group h-12 w-12 [perspective:400px]">
      <motion.span
        className="relative block h-full w-full [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: dark ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 16 }}
      >
        {face('A', '#F4F3F0')}
        <span className="absolute inset-0 [transform:rotateY(180deg)] [transform-style:preserve-3d]">{face('B', '#F6CE3A')}</span>
      </motion.span>
    </button>
  );
}
