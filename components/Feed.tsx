import Reveal from './Reveal';
import { feed, years, type FeedEntry, type EntryKind } from '@/lib/experience-data';

function KindIcon({ kind, award }: { kind: EntryKind; award: boolean }) {
  const stroke = 'currentColor';
  const common = {
    width: 15,
    height: 15,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (award) {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="6" />
        <path d="M8.2 13.5 7 22l5-3 5 3-1.2-8.5" />
      </svg>
    );
  }

  switch (kind) {
    case 'role':
      return (
        <svg {...common}>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      );
    case 'project':
      return (
        <svg {...common}>
          <path d="m8 18-6-6 6-6" />
          <path d="m16 6 6 6-6 6" />
        </svg>
      );
    case 'community':
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        </svg>
      );
    case 'education':
      return (
        <svg {...common}>
          <path d="M22 10 12 5 2 10l10 5 10-5Z" />
          <path d="M6 12.5V17c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-4.5" />
        </svg>
      );
  }
}

function Entry({ entry, index }: { entry: FeedEntry; index: number }) {
  const award = /award|place/i.test(entry.title);

  return (
    <Reveal delay={Math.min(index, 3) * 70}>
      <article className="relative grid gap-2.5 pb-10 pl-12 sm:grid-cols-[6rem_1fr] sm:gap-8 sm:pl-16">
        {/* rail marker */}
        <span
          aria-hidden
          className="absolute left-0 top-0 grid h-9 w-9 place-items-center rounded-full border border-rule bg-paper text-muted"
        >
          <KindIcon kind={entry.kind} award={award} />
        </span>

        <p className="text-sm text-faint sm:pt-1.5">{entry.month}</p>

        <div className="min-w-0">
          <h3 className="font-heading text-[19px] font-extrabold leading-snug tracking-[-0.01em] text-balance sm:text-[21px]">
            {entry.title}
            {entry.org && (
              <>
                <span className="font-normal text-faint"> @ </span>
                {entry.orgUrl ? (
                  <a
                    href={entry.orgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-2 decoration-rule underline-offset-[5px] transition-colors hover:decoration-accent"
                  >
                    {entry.org}
                  </a>
                ) : (
                  <span>{entry.org}</span>
                )}
              </>
            )}
            {entry.current && (
              <span className="ml-2 inline-block align-middle rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-accent">
                now
              </span>
            )}
          </h3>

          <p className="mt-2 max-w-[72ch] text-[15px] leading-relaxed text-muted">
            {entry.description}
          </p>

          {entry.links && entry.links.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {entry.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 font-heading text-[11.5px] font-bold uppercase tracking-[0.16em] text-ink/70 transition-colors hover:text-accent"
                >
                  <span className="border-b border-rule pb-0.5 transition-colors group-hover:border-accent">
                    {link.label}
                  </span>
                  <span aria-hidden className="text-[13px] leading-none">↗</span>
                </a>
              ))}
            </div>
          )}

          {entry.tags && entry.tags.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md bg-ink/[0.045] px-2 py-1 text-[12.5px] text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </Reveal>
  );
}

export default function Feed() {
  return (
    <div>
      {years.map((year) => {
        const entries = feed.filter((e) => e.year === year);
        return (
          <section key={year} className="pt-14 first:pt-0">
            <Reveal>
              <div className="mb-8 flex items-center gap-5">
                <h2 className="font-heading text-[44px] font-extrabold leading-none tracking-[-0.03em] sm:text-[56px]">
                  {year}
                </h2>
                <span className="h-px flex-1 bg-rule" aria-hidden />
              </div>
            </Reveal>

            {/* vertical rail */}
            <div className="relative">
              <span
                aria-hidden
                className="absolute bottom-10 left-[17px] top-4 w-px bg-rule sm:left-[17px]"
              />
              {entries.map((entry, i) => (
                <Entry key={`${entry.title}-${entry.month}`} entry={entry} index={i} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
