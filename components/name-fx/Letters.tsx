'use client';

import { forwardRef } from 'react';

// The name split into one span per letter, so effects can measure and style each glyph.
// Renders the same type as the intro headline.
const Letters = forwardRef<HTMLHeadingElement, { text: string; className?: string; style?: React.CSSProperties; plain?: boolean }>(
  function Letters({ text, className = '', style, plain = false }, ref) {
    return (
      <h1
        ref={ref}
        aria-label={text}
        className={`select-none font-display text-[clamp(52px,12.5vw,176px)] leading-[0.82] tracking-[0.005em] text-chalk ${className}`}
        style={style}
      >
        {plain ? text : [...text].map((ch, i) => (
          <span key={i} aria-hidden data-letter={ch === ' ' ? undefined : ''} className="inline-block will-change-[filter,transform]">
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </h1>
    );
  }
);

export default Letters;

export const letterEls = (root: HTMLElement | null) =>
  root ? [...root.querySelectorAll<HTMLSpanElement>('[data-letter]')] : [];

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
