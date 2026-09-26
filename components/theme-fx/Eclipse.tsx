'use client';

import { motion } from 'motion/react';
import { useTheme } from '@/lib/theme';

// 3 · Eclipse: a sun; tap it and the moon slides across into a total eclipse (dark mode),
// corona flaring. Tap again and the moon slides off.
export default function Eclipse() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button type="button" onClick={toggle} aria-label={dark ? 'Let the sun out' : 'Eclipse the sun'} className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-full">
      <motion.span
        className="absolute h-7 w-7 rounded-full bg-[#F6CE3A]"
        animate={{ boxShadow: dark ? '0 0 0 3px rgba(246,206,58,0.35), 0 0 18px 6px rgba(246,206,58,0.55)' : '0 0 0 0 rgba(246,206,58,0)' }}
        transition={{ duration: 0.6 }}
      />
      <motion.span
        className="absolute h-7 w-7 rounded-full bg-[#18181A] dark:bg-[#161618]"
        initial={false}
        animate={{ x: dark ? 0 : 30, y: dark ? 0 : -14 }}
        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
      />
    </button>
  );
}
