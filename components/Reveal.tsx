'use client';

import { useRef } from 'react';
import { useInViewOnce } from '@/lib/use-in-view-once';

// Scroll-triggered fade-up. Failsafes live in useInViewOnce.
export default function Reveal({
  children,
  delay = 0,
  className = '',
  instantIfPast = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  instantIfPast?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const hidden = useInViewOnce(ref, { instantIfPast }) === 'hidden';

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? 'translateY(14px)' : 'none',
        transition: hidden
          ? 'none'
          : `opacity 600ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
