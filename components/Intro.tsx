import NowPlaying from './NowPlaying';

type Social = { name: string; url: string; icon: React.ReactNode };

const svg = (path: React.ReactNode) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    {path}
  </svg>
);

const socials: Social[] = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/seyon-sri/',
    icon: svg(
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    ),
  },
  {
    name: 'GitHub',
    url: 'https://github.com/S3yon',
    icon: svg(
      <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .3Z" />
    ),
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/s3yon',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'X',
    url: 'https://x.com/s3yon_',
    icon: svg(
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.49l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41Z" />
    ),
  },
  {
    name: 'Email',
    url: 'mailto:sriskans@sheridancollege.ca',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
        <path d="m3 6 9 7 9-7" />
      </svg>
    ),
  },
];

// Glanceable facts in place of a paragraph: a micro-label and a short value each.
const notes = [
  { label: 'NOW', value: 'SWE Intern', sub: 'Scotiabank' },
  { label: 'STUDYING', value: 'Software Dev', sub: 'Sheridan College' },
  { label: 'HACKATHONS', value: '6 built', sub: '2 awards' },
  { label: 'BASED', value: 'Oakville', sub: 'Ontario' },
];

export default function Intro() {
  return (
    <section className="sticky top-0 z-0 h-screen overflow-hidden bg-shell">
      {/* the panel that sweeps up with an arc top, then flattens */}
      <div className="animate-arc absolute inset-0 bg-charcoal" />

      <div className="relative flex h-full flex-col px-6 py-8 sm:px-12 sm:py-10">
        <div className="flex flex-1 flex-col justify-center">
          <h1
            className="animate-intro-fade font-display text-[clamp(60px,15.5vw,220px)] leading-[0.8] tracking-[0.005em] text-chalk"
            style={{ animationDelay: '650ms' }}
          >
            SEYON SRI
          </h1>

          {/* socials, right under the name */}
          <nav
            className="animate-intro-fade mt-6 flex items-center gap-2 sm:mt-8"
            style={{ animationDelay: '820ms' }}
            aria-label="Elsewhere"
          >
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                aria-label={social.name}
                title={social.name}
                target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                rel={social.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="grid h-11 w-11 place-items-center rounded-full border border-chalk/15 text-chalk/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-chalk/45 hover:text-chalk"
              >
                {social.icon}
              </a>
            ))}
          </nav>

          {/* at-a-glance notes */}
          <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-6 sm:mt-14 sm:gap-x-10 lg:grid-cols-4">
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
                <dd className="mt-0.5 text-[13.5px] text-chalk/45">{note.sub}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* bottom row: now playing on the left, scroll cue centred; stacks on mobile */}
        <div className="grid shrink-0 items-end gap-5 sm:grid-cols-[1fr_auto_1fr]">
          <a
            href="#work"
            className="animate-intro-fade group flex flex-col items-center gap-2.5 sm:col-start-2 sm:row-start-1"
            style={{ animationDelay: '1450ms' }}
          >
            <span className="font-display text-[11px] tracking-[0.24em] text-chalk/65 transition-colors group-hover:text-chalk">
              SEE MY WORK
            </span>
            <span className="relative block h-10 w-px overflow-hidden bg-chalk/20" aria-hidden>
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
