'use client';

import { AnimatePresence, motion } from 'motion/react';

// Speech bubble matching the rail's "Pika!" lines.
export default function Bubble({ id, text }: { id: number; text: string | null }) {
  return (
    <AnimatePresence>
      {text && (
        <motion.span
          key={id}
          role="status"
          className="pointer-events-none absolute bottom-[calc(100%-6px)] left-0 block"
          initial={{ opacity: 0, scale: 0.3, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -4 }}
          transition={{ type: 'spring', stiffness: 460, damping: 22 }}
          style={{ originX: '32px', originY: 1 }}
        >
          <span className="block whitespace-nowrap rounded-full border border-rule bg-paper px-2.5 py-1 font-heading text-[11px] font-bold uppercase tracking-[0.14em] text-ink shadow-[0_6px_18px_-10px_rgba(0,0,0,0.35)]">
            {text}
          </span>
          <span className="absolute -bottom-[4px] left-[32px] block h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-rule bg-paper" />
        </motion.span>
      )}
    </AnimatePresence>
  );
}

