'use client';

import { useEffect, useRef, useState } from 'react';

// Scroll-triggered reveal with two failsafes:
//  1. Starts hidden only after JS mounts, so no-JS renders fully visible.
//  2. A timeout reveals it regardless if the observer never fires.
export default function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }

    setArmed(true);

    const reveal = () => setShown(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          reveal();
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);

    // Failsafe: never let content stay hidden.
    const failsafe = window.setTimeout(reveal, 2000);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  const hidden = armed && !shown;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? 'translateY(14px)' : 'none',
        transition: `opacity 600ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
