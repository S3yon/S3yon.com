import NowPlaying from './NowPlaying';
import ThunderCharge from './name-fx/ThunderCharge';
import IntroGlow from './IntroGlow';
import IntroFit from './IntroFit';
import SocialDock from './SocialDock';
import { socials } from '@/lib/socials';

// Glanceable facts in place of a paragraph: a micro-label and a short value each.
const notes = [
  { label: 'NOW', value: 'SWE Intern', sub: 'Scotiabank' },
  { label: 'STUDYING', value: 'Software Dev', sub: 'Sheridan College' },
  { label: 'HACKATHONS', value: '6 built', sub: '2 awards' },
  { label: 'BASED', value: 'Oakville', sub: 'Ontario' },
];

export default function Intro() {
  return (
    <section data-intro className="sticky top-0 z-0 h-screen h-[100dvh] overflow-hidden bg-shell">
      {/* the panel that sweeps up with an arc top, then flattens */}
      <div className="animate-arc absolute inset-0 overflow-hidden bg-charcoal">
        <IntroGlow />
      </div>

      <IntroFit />
      {/* The content fits the smallest height the reader can see (IntroFit), and its spacing
          shrinks with the height, so a short screen or a browser toolbar never cuts off the
          bottom row. Very short screens drop the facts' second lines, then the facts. */}
      <div
        data-intro-inner
        className="relative flex h-[min(100svh,var(--intro-fit,100svh))] flex-col px-6 pb-[max(clamp(12px,3.5svh,40px),env(safe-area-inset-bottom))] pt-[max(clamp(12px,4svh,40px),env(safe-area-inset-top))] sm:px-12"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          {/* Thunder charge: a bolt arcs from the cursor to the nearest letter; tap to strike */}
          <ThunderCharge
            text="SEYON SRI"
            size="text-[clamp(44px,min(15.5vw,24svh),220px)] leading-[0.8]"
            className="animate-intro-fade self-start"
            style={{ animationDelay: '650ms' }}
          />

          {/* socials, right under the name */}
          <SocialDock
            socials={socials}
            className="animate-intro-fade mt-[clamp(10px,3svh,32px)]"
            style={{ animationDelay: '820ms' }}
          />

          {/* at-a-glance notes */}
          <dl className="mt-[clamp(14px,5svh,56px)] grid max-w-3xl grid-cols-2 gap-x-6 gap-y-[clamp(10px,3svh,24px)] sm:gap-x-10 lg:grid-cols-4 [@media(max-height:430px)]:hidden [@media(min-width:640px)_and_(max-height:640px)]:grid-cols-4">
            {notes.map((note, i) => (
              <div
                key={note.label}
                className="animate-intro-fade border-l border-chalk/15 pl-4"
                style={{ animationDelay: `${1050 + i * 90}ms` }}
              >
                <dt className="font-display text-[11px] tracking-[0.22em] text-chalk/40">
                  {note.label}
                </dt>
                <dd className="mt-1.5 text-[16px] leading-tight text-chalk sm:text-[17px]">
                  {note.value}
                </dd>
                <dd className="mt-0.5 text-[13.5px] text-chalk/45 [@media(max-height:600px)]:hidden">{note.sub}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* bottom row: now playing on the left, scroll cue centred; stacks on mobile */}
        <div className="grid shrink-0 items-end gap-[clamp(8px,2.5svh,20px)] sm:grid-cols-[1fr_auto_1fr]">
          <a
            href="#work"
            className="animate-intro-fade group flex flex-col items-center gap-2.5 sm:col-start-2 sm:row-start-1"
            style={{ animationDelay: '1450ms' }}
          >
            <span className="font-display text-[11px] tracking-[0.24em] text-chalk/65 transition-colors group-hover:text-chalk">
              SEE MY WORK
            </span>
            <span className="relative block h-[clamp(18px,5svh,40px)] w-px overflow-hidden bg-chalk/20" aria-hidden>
              <span className="animate-scroll-cue absolute inset-x-0 top-0 h-4 bg-chalk" />
            </span>
          </a>
          <div className="min-w-0 sm:col-start-1 sm:row-start-1">
            <NowPlaying />
          </div>
        </div>
      </div>
    </section>
  );
}
