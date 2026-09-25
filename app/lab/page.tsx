import { notFound } from 'next/navigation';
import FocusPull from '@/components/name-fx/FocusPull';
import ShutterSnap from '@/components/name-fx/ShutterSnap';
import LightPainting from '@/components/name-fx/LightPainting';
import Flashlight from '@/components/name-fx/Flashlight';
import ThunderCharge from '@/components/name-fx/ThunderCharge';

export const metadata = { title: 'Name lab', robots: { index: false } };

// Local try-out page for name effects. Never served in production.
const FX = [
  { n: 1, title: 'Focus pull', how: 'Move across the name. Letters near you snap into focus, the rest blur like a shallow depth of field.', C: FocusPull },
  { n: 2, title: 'Shutter snap', how: 'Click or tap the name. Flash, shutter, and a polaroid of it drops out.', C: ShutterSnap },
  { n: 3, title: 'Light painting', how: 'Drag across the name. You leave a long-exposure light trail that fades.', C: LightPainting },
  { n: 4, title: 'Flashlight reveal', how: 'The name sits dim. Move around to light it up. The warm fill could be a real photo.', C: Flashlight },
  { n: 5, title: 'Thunder charge', how: 'Bring the cursor near the name, or tap. A bolt arcs to the nearest letter.', C: ThunderCharge },
];

export default function Lab() {
  if (process.env.NODE_ENV === 'production') notFound();
  return (
    <main className="min-h-screen bg-charcoal px-5 py-12 text-chalk sm:px-12">
      <p className="font-display text-[12px] tracking-[0.24em] text-chalk/50">NAME LAB · LOCAL ONLY</p>
      <p className="mt-2 max-w-[60ch] text-[15px] text-chalk/60">
        Five ways the name on the cover could react. Try each one, then pick by number.
      </p>
      {FX.map(({ n, title, how, C }) => (
        <section key={n} className="mt-14 border-t border-chalk/10 pt-8">
          <p className="font-display text-[12px] tracking-[0.24em] text-accent">
            {String(n).padStart(2, '0')} · {title.toUpperCase()}
          </p>
          <p className="mt-2 max-w-[60ch] text-[14px] text-chalk/55">{how}</p>
          <C text="SEYON SRI" />
        </section>
      ))}
    </main>
  );
}
