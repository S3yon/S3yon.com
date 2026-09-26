import { notFound } from 'next/navigation';
import PullCord from '@/components/theme-fx/PullCord';
import ThunderSwitch from '@/components/theme-fx/ThunderSwitch';
import Eclipse from '@/components/theme-fx/Eclipse';
import RecordFlip from '@/components/theme-fx/RecordFlip';
import IconOption, { ICONS, type IconKey } from '@/components/theme-fx/IconOption';

export const metadata = { title: 'Theme lab', robots: { index: false } };

// Local try-out page for the dark mode toggle and the app icon. Never served in production.
export default function Lab() {
  if (process.env.NODE_ENV === 'production') notFound();
  const toggles = [
    { n: 1, title: 'Pull cord', how: 'A light-switch cord hangs from the top edge. Click it or drag it down.', C: PullCord },
    { n: 2, title: 'Thunder switch', how: 'Tap the bolt: the new theme floods out from it in a growing circle.', C: ThunderSwitch },
    { n: 3, title: 'Eclipse', how: 'Tap the sun: the moon slides across into a total eclipse, corona flaring.', C: Eclipse },
    { n: 4, title: 'Side A / Side B', how: 'Tap the record: it flips over. Side A is light, side B is dark.', C: RecordFlip },
  ];
  return (
    <main className="min-h-screen bg-paper text-ink transition-colors duration-500">
      <header className="bg-charcoal px-5 pb-8 pt-12 sm:px-12">
        <p className="font-display text-[12px] tracking-[0.24em] text-chalk/50">THEME LAB · LOCAL ONLY</p>
        <p className="mt-2 max-w-[62ch] text-[15px] text-chalk/60">Four dark-mode toggles (each flips the whole page, so you see real dark mode) and four app icons.</p>
      </header>
      {toggles.map(({ n, title, how, C }) => (
        <section key={n} className="border-t border-rule px-5 py-10 sm:px-12">
          <div className="flex items-start justify-between gap-8">
            <div>
              <p className="font-heading text-[11.5px] font-bold uppercase tracking-[0.16em] text-accent">{String(n).padStart(2, '0')} · {title}</p>
              <p className="mt-1 text-[13px] text-faint">Fixed in the top-right corner of every page</p>
              <p className="mt-2 max-w-[52ch] text-[14px] text-muted">{how}</p>
              <div className="mt-6 max-w-md rounded-xl border border-rule p-4">
                <p className="font-heading text-[19px] font-extrabold">Software Engineer Intern <span className="font-normal text-faint">@</span> Scotiabank</p>
                <p className="mt-1.5 text-[14px] text-muted">A sample entry so you can see the theme change.</p>
                <span className="mt-3 inline-block rounded-md bg-ink/[0.045] px-2 py-1 text-[12.5px] text-muted">SQL</span>
              </div>
            </div>
            <div className="shrink-0 pr-4 text-ink">
              <C />
            </div>
          </div>
        </section>
      ))}
      <section className="border-t border-rule px-5 py-10 sm:px-12">
        <p className="font-heading text-[11.5px] font-bold uppercase tracking-[0.16em] text-accent">App icon + favicon</p>
        <p className="mt-2 max-w-[62ch] text-[14px] text-muted">The S from your name. Shown big, as a home-screen icon, and as a 32px browser-tab favicon.</p>
        <div className="mt-8 grid gap-10 sm:grid-cols-2">
          {(Object.keys(ICONS) as IconKey[]).map((k, i) => (
            <div key={k} className="flex items-end gap-5">
              <IconOption k={k} size={120} />
              <IconOption k={k} size={60} />
              <IconOption k={k} size={32} radius={0.18} />
              <p className="max-w-[18ch] text-[13px] text-muted">
                <span className="font-bold text-ink">{String.fromCharCode(65 + i)}.</span> {ICONS[k].name}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
