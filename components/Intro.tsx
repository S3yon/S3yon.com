import NowPlaying from './NowPlaying';

const socials = [
  { name: 'LINKEDIN', url: 'https://www.linkedin.com/in/seyon-sri/' },
  { name: 'GITHUB', url: 'https://github.com/S3yon' },
  { name: 'INSTAGRAM', url: 'https://www.instagram.com/s3yon' },
  { name: 'X', url: 'https://x.com/s3yon_' },
  { name: 'EMAIL', url: 'mailto:sriskans@sheridancollege.ca' },
];

export default function Intro() {
  return (
    <section className="sticky top-0 z-0 h-screen overflow-hidden bg-shell">
      {/* the panel that sweeps up with an arc top, then flattens */}
      <div className="animate-arc absolute inset-0 bg-charcoal" />

      {/* quiet now-playing line, bottom-left */}
      <NowPlaying />

      <div className="relative flex h-full flex-col px-6 py-8 sm:px-12 sm:py-10">
        <div className="flex flex-1 flex-col justify-center">
          <h1
            className="animate-intro-fade font-display text-[clamp(60px,15.5vw,220px)] leading-[0.8] tracking-[0.005em] text-chalk"
            style={{ animationDelay: '650ms' }}
          >
            SEYON SRI
          </h1>

          <p
            className="animate-intro-fade mt-4 font-display text-[clamp(22px,4.6vw,64px)] leading-[0.95] tracking-[0.01em] text-chalk/55"
            style={{ animationDelay: '820ms' }}
          >
            BUILDING SKILLS, CHASING BIG IDEAS
          </p>

          <div className="mt-10 flex flex-col gap-6 sm:mt-12 sm:flex-row sm:items-start sm:justify-between sm:gap-16">
            <p
              className="animate-intro-fade max-w-[46ch] text-[16px] leading-relaxed text-chalk/55 sm:text-[17px]"
              style={{ animationDelay: '1050ms' }}
            >
              Software engineer building data pipelines at{' '}
              <span className="text-chalk">Scotiabank</span>, studying software development
              at Sheridan College, and shipping AI and full-stack products at hackathons in
              between.
            </p>

            <p
              className="animate-intro-fade shrink-0 text-[14px] leading-relaxed text-chalk/40 sm:text-right"
              style={{ animationDelay: '1200ms' }}
            >
              Oakville, Ontario
              <br />
              Six hackathons, two awards
            </p>
          </div>

          {/* social links */}
          <nav
            className="animate-intro-fade mt-9 flex flex-wrap items-center gap-x-6 gap-y-3"
            style={{ animationDelay: '1320ms' }}
            aria-label="Elsewhere"
          >
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                rel={social.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="font-display text-[12px] tracking-[0.2em] text-chalk/55 transition-colors hover:text-chalk"
              >
                {social.name}
              </a>
            ))}
          </nav>
        </div>

        {/* scroll cue */}
        <div
          className="animate-intro-fade flex shrink-0 flex-col items-center gap-2.5"
          style={{ animationDelay: '1450ms' }}
        >
          <span className="font-display text-[11px] tracking-[0.24em] text-chalk/65">
            SEE MY WORK
          </span>
          <span className="block h-10 w-px bg-chalk/35" aria-hidden />
        </div>
      </div>
    </section>
  );
}
