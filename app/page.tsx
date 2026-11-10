import type { Metadata } from 'next';
import Campfire, { CampGlow } from '@/components/ditto/Campfire';
import CampLinks from '@/components/ditto/CampLinks';
import Feed from '@/components/Feed';
import Intro from '@/components/Intro';
import IntroParallax from '@/components/IntroParallax';
import Reveal from '@/components/Reveal';
import ThunderRings from '@/components/ThunderRings';
import { getGithubStats } from '@/lib/github';
import { SITE_URL } from '@/lib/site';
import { socials } from '@/lib/socials';

// Refresh the GitHub counts every hour.
export const revalidate = 3600;

// Each page names its own canonical address (layout-level would stamp "/" on every route).
export const metadata: Metadata = { alternates: { canonical: '/' } };

// Who the page is about, for search engines (schema.org ProfilePage + Person). Only facts the
// page already shows.
const profile = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: `${SITE_URL}/`,
  mainEntity: {
    '@type': 'Person',
    name: 'Seyon Sri',
    url: `${SITE_URL}/`,
    jobTitle: 'Software Engineer Intern',
    worksFor: { '@type': 'Organization', name: 'Scotiabank', url: 'https://www.scotiabank.com' },
    affiliation: { '@type': 'CollegeOrUniversity', name: 'Sheridan College', url: 'https://www.sheridancollege.ca' },
    sameAs: socials.filter((s) => s.url.startsWith('http')).map((s) => s.url),
  },
};

export default async function Home() {
  const github = await getGithubStats();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profile) }} />
      {/* keyboard users jump past the cover; hidden until focused */}
      <a
        href="#work"
        className="sr-only z-[80] font-heading text-[12px] font-bold uppercase tracking-[0.16em] focus:not-sr-only focus:fixed focus:left-4 focus:top-[max(1rem,env(safe-area-inset-top))] focus:bg-paper focus:px-5 focus:py-3 focus:text-ink focus:outline-none focus:ring-2 focus:ring-accent"
      >
        Skip to the work
      </a>
      <ThunderRings />
      <Intro />
      <IntroParallax />

      {/* content panel rides up over the intro as you scroll */}
      <div id="work" className="relative z-10 overflow-x-clip rounded-t-[28px] bg-paper shadow-[0_-24px_60px_-30px_rgba(0,0,0,0.55)] sm:rounded-t-[40px]">
        <main className="mx-auto max-w-4xl px-5 py-20 pb-[max(5rem,calc(env(safe-area-inset-bottom,0px)+3rem))] sm:px-8 sm:py-28 sm:pb-[max(7rem,calc(env(safe-area-inset-bottom,0px)+4rem))]">
          <Feed github={github} />

          {/* Trailhead: the fire sits right under the end of the rail, the heading in its light */}
          <footer className="relative isolate mt-3">
            <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:gap-12">
              <div className="relative w-[190px] shrink-0 sm:w-[270px]">
                <CampGlow />
                <Campfire />
              </div>
              <Reveal>
                <h2 className="font-heading text-[clamp(34px,8vw,52px)] font-extrabold leading-[0.95] tracking-[-0.03em]">
                  Come sit by the fire.
                  <br />
                  <span className="aurora-text">Let&apos;s build something.</span>
                </h2>
              </Reveal>
            </div>
            <div className="sm:pl-[318px]">
              <p className="mt-5 max-w-[50ch] text-[15px] leading-relaxed text-muted">
                Always up for a good problem, a hackathon team, or a conversation about AI and
                infrastructure. The inbox is open.
              </p>
              <CampLinks />
            </div>

            <p className="mt-16 text-[13px] text-faint">
              © {new Date().getFullYear()} Seyon Sri
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
