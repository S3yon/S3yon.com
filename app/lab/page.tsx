import { notFound } from 'next/navigation';
import CratePlay from '@/components/music-fx/CratePlay';
import Dock from '@/components/music-fx/Dock';
import Radio from '@/components/music-fx/Radio';
import Jukebox from '@/components/music-fx/Jukebox';
import RotationPlayer from '@/components/music-fx/RotationPlayer';

export const metadata = { title: 'Music lab', robots: { index: false } };

// Local try-out page for in-site music. Never served in production.
export default async function Lab({ searchParams }: { searchParams: Promise<{ v?: string }> }) {
  const { v } = await searchParams;
  if (process.env.NODE_ENV === 'production') notFound();
  const row = (dark: boolean, n: number, title: string, where: string, how: string, node: React.ReactNode) => (
    <section key={n} className={`border-t px-5 py-10 sm:px-12 ${dark ? 'border-chalk/10 bg-charcoal text-chalk' : 'border-rule bg-paper text-ink'}`}>
      <p className={dark ? 'font-display text-[12px] tracking-[0.24em] text-accent' : 'font-heading text-[11.5px] font-bold uppercase tracking-[0.16em] text-accent'}>
        {String(n).padStart(2, '0')} · {dark ? title.toUpperCase() : title}
      </p>
      <p className={`mt-1 text-[13px] ${dark ? 'text-chalk/40' : 'text-faint'}`}>{where}</p>
      <p className={`mt-2 max-w-[62ch] text-[14px] ${dark ? 'text-chalk/60' : 'text-muted'}`}>{how}</p>
      <div className="mt-8">{node}</div>
    </section>
  );
  return (
    <main className="min-h-screen bg-charcoal">
      <header className="px-5 pb-8 pt-12 sm:px-12">
        <p className="font-display text-[12px] tracking-[0.24em] text-chalk/50">MUSIC LAB · LOCAL ONLY · LIVE DATA</p>
        <p className="mt-2 max-w-[62ch] text-[15px] text-chalk/60">
          Six ways visitors could hear your music. Logged-out visitors get 30-second previews; anyone logged into Spotify Premium in this browser hears the full song.
        </p>
      </header>
      {!v && row(false, 1, 'Crate player', 'Timeline, On rotation row', 'Hover a cover and press play. The Spotify player opens under the crate.', <CratePlay />)}
      {!v && row(true, 2, 'Listen along dock', 'Cover, next to the now-playing line', 'Press Listen along. A small player docks bottom-right and stays while you scroll.', <Dock />)}
      {!v && row(false, 3, 'Radio', 'Timeline, On rotation row', 'Tune in and it plays your last six in order, moving on when each ends. Tap any to jump.', <Radio />)}
      {!v && row(false, 4, 'Pikachu jukebox', 'Timeline, on the rail', 'Tap Pikachu. The player pops out above it in the mood-portrait frame, and it vibes while the song plays.', <Jukebox />)}
      {v !== 'card' && row(false, 5, 'On rotation + square player', 'Timeline, the On rotation row as it is now', 'Click any cover. A small square loads to the right: the cover art, with Spotify’s slim player along the bottom.', <RotationPlayer layout="square" />)}
      {v !== 'square' && row(false, 6, 'On rotation + compact card', 'Timeline, On rotation row', 'Same, with Spotify’s standard compact card (300×152) instead of the square.', <RotationPlayer layout="card" />)}
      <div className="h-40 bg-paper" />
    </main>
  );
}
