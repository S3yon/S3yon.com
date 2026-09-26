'use client';

import { motion, useAnimate } from 'motion/react';
import { useTheme } from '@/lib/theme';

// 1 · Pull cord: a light-switch cord hangs from the top edge. Pull it (click, tap or drag
// down) and it springs back as the lights go off, or on.
export default function PullCord() {
  const { theme, toggle } = useTheme();
  const [scope, animate] = useAnimate();
  const pull = async () => {
    toggle();
    await animate(scope.current, { y: [0, 26, -6, 0] }, { duration: 0.55, ease: 'easeOut' });
  };
  return (
    <motion.button
      ref={scope}
      type="button"
      onClick={pull}
      drag="y"
      dragConstraints={{ top: 0, bottom: 40 }}
      dragElastic={0.3}
      dragSnapToOrigin
      onDragEnd={(_, info) => info.offset.y > 18 && toggle()}
      aria-label={theme === 'dark' ? 'Turn the lights on' : 'Turn the lights off'}
      className="group flex cursor-grab touch-none flex-col items-center active:cursor-grabbing"
    >
      <span className="block h-24 w-px bg-current opacity-50" />
      <span className="grid h-7 w-7 place-items-center rounded-full border border-current bg-current/10 text-[13px] transition-transform group-hover:scale-110">
        {theme === 'dark' ? '☾' : '☀'}
      </span>
    </motion.button>
  );
}
