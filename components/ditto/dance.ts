'use client';

import { useEffect, useState } from 'react';
import type { PikaFacing } from '../Pikachu';

// The campfire dance while music plays: a 12-beat routine on a 500ms beat, looped.
//   beats 1-4  two-step: they turn to each other and away, stepping in and out
//   beats 5-8  hops: they take turns hopping, the fire flares on every beat
//   beats 9-12 spin: both turn through all four facings, with a small hop facing you
export const BEAT = 500;
const SPIN: PikaFacing[] = ['down', 'left', 'up', 'right'];

// counts beats from 1 while `on`; 0 when off or with reduced motion
export function useBeat(on: boolean) {
  const [beat, setBeat] = useState(0);
  useEffect(() => {
    if (!on || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setBeat(0);
    const t = setInterval(() => setBeat((b) => b + 1), BEAT);
    return () => clearInterval(t);
  }, [on]);
  return on ? beat : 0;
}

// left = the left seat (faces right at rest), right = the right seat. `ls`/`rs` sway the seat
// in and out (a transition on a span that stays mounted, so it eases back too); `lh`/`rh` hop.
// A hop's class swaps name each beat, so back-to-back hops restart without remounting the sprite.
export type Step = { left: PikaFacing; right: PikaFacing; ls: string; rs: string; lh: string; rh: string; walking: boolean; flare: boolean };

export function danceStep(beat: number): Step | null {
  if (beat <= 0) return null;
  const b = beat - 1;
  const move = Math.floor(b / 4) % 3;
  const even = b % 2 === 0;
  const hop = even ? 'dance-hop' : 'dance-hop-b';
  if (move === 0)
    return {
      left: even ? 'right' : 'left',
      right: even ? 'left' : 'right',
      ls: even ? 'dance-in-l' : 'dance-out-l',
      rs: even ? 'dance-in-r' : 'dance-out-r',
      lh: '',
      rh: '',
      walking: true,
      flare: false,
    };
  if (move === 1) return { left: 'right', right: 'left', ls: '', rs: '', lh: even ? hop : '', rh: even ? '' : hop, walking: false, flare: true };
  const f = SPIN[b % 4];
  const h = f === 'down' ? hop : '';
  return { left: f, right: f, ls: '', rs: '', lh: h, rh: h, walking: false, flare: false };
}

// The hop only moves up and down: squashing pixel art by non-integer amounts smears its pixels.
const HOP = `0% { transform: none; animation-timing-function: cubic-bezier(.2,.6,.35,1); } 45% { transform: translateY(-12px); animation-timing-function: cubic-bezier(.55,0,.8,.35); } 100% { transform: none; }`;
export const DANCE_CSS = `
  .dance-sway { transition: transform 220ms ease-out; }
  .dance-in-l { transform: translateX(4px); } .dance-out-l { transform: translateX(-3px); }
  .dance-in-r { transform: translateX(-4px); } .dance-out-r { transform: translateX(3px); }
  @keyframes dance-hop { ${HOP} } @keyframes dance-hop-b { ${HOP} }
  .dance-hop { animation: dance-hop ${BEAT - 40}ms; } .dance-hop-b { animation: dance-hop-b ${BEAT - 40}ms; }
`;
