import { useSyncExternalStore } from 'react';

// Shared state between the rail runner (Feed) and the footer campfire.
// `stage` is who is really on the rail: 'off' = Pikachu, anything else = Ditto (Imposter).
// `camp` is where the runner is: on the rail, mid-jump, or sitting at the fire.
// `music` is true while a song plays (the site's crate or Seyon's Spotify): they dance at the fire.
export type DittoStage = 'off' | 'pika' | 'blob' | 'copy';
export type CampSpot = 'rail' | 'flying' | 'camp';
type Duo = { stage: DittoStage; camp: CampSpot; music: boolean };

let state: Duo = { stage: 'off', camp: 'rail', music: false };
const subs = new Set<() => void>();

export function setDuo(next: Partial<Duo>) {
  state = { ...state, ...next };
  subs.forEach((f) => f());
}

export function getDuo() {
  return state;
}

const subscribe = (f: () => void) => {
  subs.add(f);
  return () => subs.delete(f);
};
const server: Duo = { stage: 'off', camp: 'rail', music: false };

export function useDuo() {
  return useSyncExternalStore(subscribe, getDuo, () => server);
}
