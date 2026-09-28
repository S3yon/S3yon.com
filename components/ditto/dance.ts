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

// left = the left seat (faces right at rest), right = the right seat. `key` changes when a
// one-shot animation (a hop) has to restart on this beat.
export type Step = { left: PikaFacing; right: PikaFacing; lc: string; rc: string; walking: boolean; flare: boolean; key: string };

export function danceStep(beat: number): Step | null {
  if (beat <= 0) return null;
  const b = beat - 1;
  const move = Math.floor(b / 4) % 3;
  const even = b % 2 === 0;
  if (move === 0)
    return {
      left: even ? 'right' : 'left',
      right: even ? 'left' : 'right',
      lc: even ? 'dance-in-l' : 'dance-out-l',
      rc: even ? 'dance-in-r' : 'dance-out-r',
      walking: true,
      flare: false,
      key: '',
    };
  if (move === 1) return { left: 'right', right: 'left', lc: even ? 'dance-hop' : '', rc: even ? '' : 'dance-hop', walking: false, flare: true, key: String(beat) };
  const f = SPIN[b % 4];
  const hop = f === 'down' ? 'dance-hop' : '';
  return { left: f, right: f, lc: hop, rc: hop, walking: false, flare: false, key: String(beat) };
}

export const DANCE_CSS = `
  .dance-in-l, .dance-out-l, .dance-in-r, .dance-out-r { transition: transform 220ms ease-out; }
  .dance-in-l { transform: translateX(4px); } .dance-out-l { transform: translateX(-3px); }
  .dance-in-r { transform: translateX(-4px); } .dance-out-r { transform: translateX(3px); }
  @keyframes dance-hop { 0% { transform: none; } 12% { transform: scale(1.12, .86); } 45% { transform: translateY(-12px) scale(.95, 1.06); } 78% { transform: translateY(0) scale(1.1, .9); } 100% { transform: none; } }
  .dance-hop { animation: dance-hop ${BEAT - 40}ms ease-out; transform-origin: 50% 100%; }
`;
