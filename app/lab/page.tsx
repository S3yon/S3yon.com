import { notFound } from 'next/navigation';
import VinylPlayer from '@/components/spotify-fx/VinylPlayer';
import LiveChip from '@/components/spotify-fx/LiveChip';
import AmbientGlow from '@/components/spotify-fx/AmbientGlow';
import Ticker from '@/components/spotify-fx/Ticker';
import RecentFan from '@/components/spotify-fx/RecentFan';
import PikachuVibes from '@/components/spotify-fx/PikachuVibes';

export const metadata = { title: 'Spotify lab', robots: { index: false } };

// Local try-out page for Spotify ideas, using live data. Never served in production.
export default function Lab() {
  if (process.env.NODE_ENV === 'production') notFound();
  const dark = (n: number, title: string, where: string, how: string, node: React.ReactNode) => (
    <section key={n} className="border-t border-chalk/10 bg-charcoal px-5 py-10 text-chalk sm:px-12">
      <p className="font-display text-[12px] tracking-[0.24em] text-accent">{String(n).padStart(2, '0')} · {title.toUpperCase()}</p>
      <p className="mt-1 text-[13px] text-chalk/40">{where}</p>
      <p className="mt-2 max-w-[62ch] text-[14px] text-chalk/60">{how}</p>
      <div className="mt-8">{node}</div>
    </section>
  );
  const light = (n: number, title: string, where: string, how: string, node: React.ReactNode) => (
    <section key={n} className="border-t border-rule bg-paper px-5 py-10 text-ink sm:px-12">
      <p className="font-heading text-[11.5px] font-bold uppercase tracking-[0.16em] text-accent">{String(n).padStart(2, '0')} · {title}</p>
      <p className="mt-1 text-[13px] text-faint">{where}</p>
      <p className="mt-2 max-w-[62ch] text-[14px] text-muted">{how}</p>
      <div className="mt-8">{node}</div>
    </section>
  );
  return (
    <main className="min-h-screen bg-charcoal">
      <header className="px-5 pb-8 pt-12 sm:px-12">
        <p className="font-display text-[12px] tracking-[0.24em] text-chalk/50">SPOTIFY LAB · LOCAL ONLY · LIVE DATA</p>
        <p className="mt-2 max-w-[60ch] text-[15px] text-chalk/60">Six ways your music could show up. Pick by number; they can combine.</p>
      </header>
      {dark(1, 'Vinyl player', 'Cover, bottom-left (replaces the text line)', 'The album art is the record label. It spins only while playing, the tonearm swings on, and hovering slides the sleeve out.', <VinylPlayer />)}
      {dark(2, 'Live mini-player', 'Cover, bottom-left', 'Art, title and a progress bar that moves in real time, with an equalizer. Click it to open your last five tracks.', <div className="pt-64"><LiveChip /></div>)}
      {dark(3, 'Album-colour glow', 'Cover background', "The cover glows in the dominant colour of whatever you're playing, breathing slowly while it plays.", <AmbientGlow><p className="font-display text-[clamp(52px,10vw,140px)] leading-[0.82] text-chalk">SEYON SRI</p></AmbientGlow>)}
      {dark(4, 'Radio ticker', 'Cover, along the bottom edge', 'The track scrolls by in huge outlined type, like a station ticker. Fills in on hover; stops when nothing plays.', <Ticker />)}
      {light(5, 'On rotation', 'Timeline, a row under Still building', 'Your last six covers stacked like a record crate. Hover to fan them out and read each one.', <RecentFan />)}
      {light(6, 'Pikachu vibes', 'Timeline, on the rail', 'While music plays, Pikachu bobs to the beat with notes floating up, and a small card says what it is listening to.', <PikachuVibes />)}
    </main>
  );
}
