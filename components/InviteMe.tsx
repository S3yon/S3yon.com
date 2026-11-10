// Invite me, above the footer (design lab pick D3, 2026-11-10, "but more lowkey"). Three asks,
// each with proof read straight from the timeline (entry keys, so nothing here can drift from
// experience-data.ts) and one email link with its own subject and a short event template in the
// body. Quieter than the lab version: entry-sized type, no logos, no accent colour, tighter rows.
// It sits on the timeline's indent, so the rail runs past it on its way to the campfire.
import type { FeedEntry } from '@/lib/experience-data';
import { feed } from '@/lib/experience-data';

const EMAIL = 'sriskans@sheridancollege.ca';
const LABEL = 'font-heading text-[11px] font-bold uppercase tracking-[0.16em]';

type Proof = { keys: string[]; label: (e: FeedEntry[]) => string };

const entryKey = (e: FeedEntry) => `${e.year}-${e.month}-${e.title}`;
const short = (e: FeedEntry) => `${e.month.slice(0, 3)} ${e.year}`;

const ASKS: { id: string; ask: string; line: string; subject: string; cta: string; proof: Proof[] }[] = [
  {
    id: 'mentor',
    ask: 'Mentor',
    line: 'Hackathons, datathons and student teams.',
    subject: 'Mentor request',
    cta: 'Email about mentoring',
    proof: [
      { keys: ['2025-November-Mentor'], label: ([e]) => `Mentor, ${e.org}, ${short(e)}` },
      {
        keys: ['2025-March-Organizer', '2025-December-Marketing Lead'],
        label: ([a]) => `${a.org}: organizer, then marketing lead, since ${short(a)}`,
      },
      { keys: ['2025-June-Executive'], label: ([e]) => `Executive, ${e.org}, 15+ events` },
    ],
  },
  {
    id: 'judge',
    ask: 'Judge',
    line: 'Hackathons and project showcases. Placed at three as a builder.',
    subject: 'Judging invite',
    cta: 'Email about judging',
    proof: [
      { keys: ['2025-November-HemoStat — Most Impactful Award'], label: ([e]) => `HemoStat, Most Impactful Award, ${e.org}` },
      { keys: ['2025-February-ThyroTrack — 2nd Place'], label: ([e]) => `ThyroTrack, 2nd place, ${e.org}` },
      { keys: ['2026-February-StanCut — Top 6'], label: ([e]) => `StanCut, top 6, ${e.org}` },
    ],
  },
  {
    id: 'photo',
    ask: 'Photograph your event',
    line: 'Event photos, headshots and recap video.',
    subject: 'Event photography',
    cta: 'Email about photos',
    proof: [
      { keys: ['2026-August-Photo & Video Team Lead'], label: ([e]) => `Photo & Video Team Lead, ${e.org}, since ${short(e)}` },
      { keys: ['2025-September-Volunteer Staff', '2026-September-Photographer'], label: ([a, b]) => `${b.org}: staff ${a.year}, photographer ${b.year}` },
      { keys: ['2026-May-Photographer'], label: ([e]) => `Photographer, ${e.org}, ${short(e)}` },
      { keys: ['2026-February-Job Search Week Volunteer'], label: ([e]) => `Headshots for every attendee, ${e.org} Job Search Week` },
    ],
  },
];

const BODY = 'Event:\nDate:\nWhere:\nWhat you need:\n';
const mailFor = (subject: string) => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(BODY)}`;

const byKey = new Map(feed.map((e) => [entryKey(e), e]));

// A proof line whose entries have left the timeline drops out instead of showing a stale claim.
function proofText(p: Proof) {
  const entries = p.keys.map((k) => byKey.get(k));
  if (entries.some((e) => !e)) {
    if (process.env.NODE_ENV !== 'production') console.warn(`InviteMe: no timeline entry for ${p.keys.join(', ')}`);
    return null;
  }
  return p.label(entries as FeedEntry[]);
}

export default function InviteMe() {
  return (
    <section aria-labelledby="invite-title" className="pb-14 pl-12 sm:pb-16 sm:pl-16">
      <p className={`${LABEL} text-faint`}>Invite me</p>
      <h2 id="invite-title" className="mt-2 font-heading text-[17px] font-bold leading-snug tracking-[-0.01em] sm:text-[19px]">
        Mentor, judge or photographer for your event.
      </h2>
      <div className="mt-4">
        {ASKS.map((a) => (
          <div key={a.id} data-ask={a.id} className="grid gap-2 border-t border-rule py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <div>
              <h3 className="font-heading text-[14.5px] font-bold leading-snug">{a.ask}</h3>
              <p className="mt-0.5 text-[13px] leading-snug text-muted">{a.line}</p>
            </div>
            <div className="min-w-0">
              <ul className="grid gap-1 text-[13.5px] leading-snug text-muted" aria-label={`${a.ask}: from the timeline`}>
                {a.proof.map((p) => {
                  const text = proofText(p);
                  return text && <li key={p.keys.join('|')}>{text}</li>;
                })}
              </ul>
              <div className="mt-2.5 flex">
                <a
                  href={mailFor(a.subject)}
                  data-mail={a.id}
                  className={`group -my-3.5 inline-flex items-center gap-1.5 py-3.5 ${LABEL} text-ink/60 transition-colors focus-visible:text-ink [@media(hover:hover)]:hover:text-ink`}
                >
                  <span className="border-b border-rule pb-0.5 transition-colors group-focus-visible:border-ink [@media(hover:hover)]:group-hover:border-ink">
                    {a.cta}
                  </span>
                  <span aria-hidden className="text-[12px] leading-none">
                    ↗
                  </span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
