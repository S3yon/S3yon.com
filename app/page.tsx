import Campfire, { CampGlow } from '@/components/ditto/Campfire';
import CampLinks from '@/components/ditto/CampLinks';
import Feed from '@/components/Feed';
import Intro from '@/components/Intro';
import Reveal from '@/components/Reveal';
import { getGithubStats } from '@/lib/github';

// Refresh the GitHub counts every hour.
export const revalidate = 3600;

export default async function Home() {
  const github = await getGithubStats();
  return (
    <>
      <Intro />

      {/* content panel rides up over the intro as you scroll */}
      <div id="work" className="relative z-10 rounded-t-[28px] bg-paper shadow-[0_-24px_60px_-30px_rgba(0,0,0,0.55)] sm:rounded-t-[40px]">
        <main className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
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
                  Pull up a log.
                  <br />
                  <span className="text-accent">Let&apos;s build something.</span>
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
