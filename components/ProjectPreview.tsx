'use client';

// A project title previews its page. With a mouse (or keyboard focus on a hover device) a small
// screenshot card floats under the title, follows the pointer sideways, and hides on leave, blur,
// scroll or Escape. It is absolutely positioned, so nothing below moves. Touch screens get the
// screenshot inline instead (ProjectShot), since there is no hover.
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Shot } from '@/lib/projects';

const CARD_W = 300;

// The card's state. `col` is the entry's text column the card is placed in, `link` the title.
export function usePreview(col: React.RefObject<HTMLElement | null>, link: React.RefObject<HTMLElement | null>) {
  const [show, setShow] = useState(false);
  // the card's image loads on the first mouse visit to the entry, not with the page
  const [warm, setWarm] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0, w: CARD_W });
  const muted = useRef(false);

  const place = useCallback(
    (clientX?: number) => {
      const c = col.current?.getBoundingClientRect();
      const l = link.current?.getBoundingClientRect();
      if (!c || !l) return;
      const w = Math.min(CARD_W, Math.round(c.width));
      // under the title's last line, left edge near the pointer (or the title start for focus)
      const want = clientX === undefined ? l.left - c.left : clientX - c.left - 48;
      const x = Math.round(Math.max(0, Math.min(want, c.width - w)));
      const y = Math.round(l.bottom - c.top + 10);
      setPos({ x, y, w });
    },
    [col, link],
  );

  const hide = useCallback(() => setShow(false), []);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        muted.current = true;
        hide();
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', hide, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', hide);
    };
  }, [show, hide]);

  // for the title link
  const handlers = {
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      muted.current = false;
      setWarm(true);
      place(e.clientX);
      setShow(true);
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (e.pointerType !== 'mouse' || muted.current) return;
      place(e.clientX);
    },
    onPointerLeave: () => {
      muted.current = false;
      hide();
    },
    onFocus: () => {
      if (!window.matchMedia('(hover: hover)').matches || muted.current) return;
      setWarm(true);
      place();
      setShow(true);
    },
    onBlur: () => {
      muted.current = false;
      hide();
    },
  };

  const warmUp = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') setWarm(true);
  };

  return { handlers, warmUp, show, warm, pos };
}

// The floating card, for hover devices only. Sits in the entry's text column (`col`).
export function PreviewCard({
  shot,
  id,
  show,
  warm,
  pos,
}: {
  shot: Shot;
  id: string;
  show: boolean;
  warm: boolean;
  pos: { x: number; y: number; w: number };
}) {
  return (
    <div
      id={id}
      role="tooltip"
      data-preview-card
      data-show={show ? '1' : '0'}
      style={{ left: `${pos.x}px`, top: `${pos.y}px`, width: `${pos.w}px` }}
      className={`pointer-events-none absolute z-20 hidden origin-top-left overflow-hidden rounded-[12px] border border-rule bg-paper shadow-[0_10px_30px_-12px_rgb(0_0_0/0.28)] transition-[opacity,transform,visibility] duration-150 ease-out motion-reduce:transform-none [@media(hover:hover)]:block ${
        show ? 'visible translate-y-0 scale-100 opacity-100' : 'invisible translate-y-1 scale-[0.98] opacity-0'
      }`}
    >
      {warm ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} decoding="async" className="block aspect-[16/10] h-auto w-full bg-ink/[0.03]" />
      ) : (
        <span className="block aspect-[16/10] w-full bg-ink/[0.03]" />
      )}
      <span className="flex items-center justify-between gap-3 border-t border-rule px-3 py-2 text-[12px] text-faint">
        <span className="truncate">{shot.host}</span>
        <span aria-hidden>↗</span>
      </span>
    </div>
  );
}

// The screenshot in a hairline frame, sized up front so nothing jumps when it loads. `crop`
// shows it 16:9 from the top (the inline preview); otherwise whole, with when it was taken.
export function ProjectShot({ shot, crop = false, className = '' }: { shot: Shot; crop?: boolean; className?: string }) {
  return (
    <figure className={className}>
      <div className={`overflow-hidden border border-rule bg-ink/[0.03] ${crop ? 'aspect-video rounded-[12px]' : 'rounded-[14px]'}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          loading="lazy"
          decoding="async"
          className={crop ? 'h-full w-full object-cover object-top' : 'block h-auto w-full'}
        />
      </div>
      <figcaption className={`text-faint ${crop ? 'mt-1.5 truncate text-[12px]' : 'mt-2 text-[12.5px]'}`}>
        {crop ? shot.host : `${shot.host}, ${shot.taken}`}
      </figcaption>
    </figure>
  );
}
