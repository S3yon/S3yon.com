import { notFound } from 'next/navigation';
import SocialDock from '@/components/SocialDock';
import Quiet from '@/components/social-fx/Quiet';
import Fill from '@/components/social-fx/Fill';
import Readout from '@/components/social-fx/Readout';
import Rail from '@/components/social-fx/Rail';
import DockContained from '@/components/social-fx/DockContained';
import { socials } from '@/lib/socials';

export const metadata = { title: 'Social lab', robots: { index: false } };

// Local try-out page for the intro's social icons. Never served in production.
export default function Lab() {
  if (process.env.NODE_ENV === 'production') notFound();
  const variants = [
    { n: 0, title: 'Now: the dock', how: 'What is live today. Hover: icons swell from 44 to 64px, up into the name.', C: SocialDock },
    { n: 1, title: 'Quiet ring', how: 'No size change. Hover brightens the ring and the icon.', C: Quiet },
    { n: 2, title: 'Fill', how: 'No size change. Hover fills the ring with chalk; the icon turns charcoal.', C: Fill },
    { n: 3, title: 'Readout', how: 'No size change. Hover shows where the link goes, as a micro-label at the end of the row.', C: Readout },
    { n: 4, title: 'Rail', how: 'No rings. A hairline slides under the hovered icon.', C: Rail },
    { n: 5, title: 'Dock, contained', how: 'The dock swell kept, but 44 to 52px and inside its own row, so it never reaches the name.', C: DockContained },
  ];
  return (
    <main className="min-h-screen bg-charcoal text-chalk">
      <header className="px-6 pb-6 pt-12 sm:px-12">
        <p className="font-display text-[12px] tracking-[0.24em] text-chalk/50">SOCIAL LAB · LOCAL ONLY</p>
        <p className="mt-2 max-w-[62ch] text-[15px] text-chalk/60">
          Five ways for the icons under your name to react to a mouse. Each sits under the name at its real size and gap. Hover along each row.
        </p>
      </header>
      {variants.map(({ n, title, how, C }) => (
        <section key={n} data-variant={n} className="border-t border-chalk/10 px-6 py-10 sm:px-12">
          <p className="font-display text-[11px] tracking-[0.22em] text-chalk/45">
            {String(n).padStart(2, '0')} · {title.toUpperCase()}
          </p>
          <p className="mt-1.5 max-w-[60ch] text-[14px] text-chalk/55">{how}</p>
          <p data-name className="mt-8 font-display text-[clamp(44px,min(15.5vw,24svh),220px)] leading-[0.8] text-chalk">SEYON SRI</p>
          <C socials={socials} className="mt-[clamp(10px,3svh,32px)]" />
        </section>
      ))}
    </main>
  );
}
