import { notFound } from 'next/navigation';
import LoaderRows from './LoaderRows';

export const metadata = { title: 'Loader lab', robots: { index: false } };

// Local try-out page for the Spotify player's loading state. Never served in production.
export default function Lab() {
  if (process.env.NODE_ENV === 'production') notFound();
  return (
    <main className="min-h-screen bg-paper">
      <header className="bg-charcoal px-5 pb-8 pt-12 sm:px-12">
        <p className="font-display text-[12px] tracking-[0.24em] text-chalk/50">LOADER LAB · LOCAL ONLY</p>
        <p className="mt-2 max-w-[62ch] text-[15px] text-chalk/60">Four ways to cover the moment the Spotify player loads. Click a cover in each.</p>
      </header>
      <LoaderRows />
    </main>
  );
}
