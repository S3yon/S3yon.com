import Feed from '@/components/Feed';
import Intro from '@/components/Intro';
import Reveal from '@/components/Reveal';

export default function Home() {
  return (
    <>
      <Intro />

      {/* content panel rides up over the intro as you scroll */}
      <div className="relative z-10 rounded-t-[28px] bg-paper shadow-[0_-24px_60px_-30px_rgba(0,0,0,0.55)] sm:rounded-t-[40px]">
        <main className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
          <Feed />

          <footer className="mt-24 border-t border-rule pt-12">
            <Reveal>
              <h2 className="font-heading text-[clamp(34px,8vw,52px)] font-extrabold leading-[0.95] tracking-[-0.03em]">
                Let&apos;s build
                <br />
                something.
              </h2>
              <p className="mt-5 max-w-[50ch] text-[15px] leading-relaxed text-muted">
                Always up for a good problem, a hackathon team, or a conversation about AI and
                infrastructure. The inbox is open.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px]">
                <a
                  href="mailto:sriskans@sheridancollege.ca"
                  className="bg-ink px-5 py-3 font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-paper transition-colors hover:bg-accent"
                >
                  sriskans@sheridancollege.ca
                </a>
                <a
                  href="https://www.linkedin.com/in/seyon-sri/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-ink/70 transition-colors hover:text-accent"
                >
                  LinkedIn
                </a>
              </div>
            </Reveal>

            <p className="mt-16 text-[13px] text-faint">
              © {new Date().getFullYear()} Seyon Sri
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
