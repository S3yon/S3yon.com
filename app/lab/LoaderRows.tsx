'use client';

import OnRotation from '@/components/OnRotation';
import { useSpotify } from '@/lib/use-spotify';
import type { LoaderKind } from '@/components/PlayerLoader';

const ROWS: { kind: LoaderKind; title: string; how: string }[] = [
  { kind: 'skeleton', title: 'Skeleton card', how: 'A dark card in the player’s shape with the cover and a light sweep, then the player fades in.' },
  { kind: 'record', title: 'Record cueing up', how: 'The record slides out of its sleeve and spins, “Cueing up” + title, then the player fades in.' },
  { kind: 'pikachu', title: 'Pikachu fetching', how: 'Pixel Pikachu runs on the spot with bouncing dots and the title, then the player fades in.' },
  { kind: 'eq', title: 'Blurred cover + equalizer', how: 'The cover blurred into a colour wash behind a live equalizer, then the player fades in.' },
];

export default function LoaderRows() {
  const { data } = useSpotify();
  return (
    <>
      {ROWS.map((r, i) => (
        <section key={r.kind} className="border-t border-rule bg-paper px-5 py-10 text-ink sm:px-12">
          <p className="font-heading text-[11.5px] font-bold uppercase tracking-[0.16em] text-accent">
            {String(i + 1).padStart(2, '0')} · {r.title}
          </p>
          <p className="mt-1 text-[13px] text-faint">Timeline, the On rotation player slot</p>
          <p className="mt-2 max-w-[62ch] text-[14px] text-muted">{r.how} Click any cover (the loader is held for 3s here so you can see it).</p>
          <div className="mt-8 max-w-4xl">
            <OnRotation spotify={data} loader={r.kind} minLoadMs={3000} />
          </div>
        </section>
      ))}
    </>
  );
}
