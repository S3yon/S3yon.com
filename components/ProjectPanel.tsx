'use client';

// A project entry that opens in place. Its links row gains a More control; the panel under it
// grows to its height: problem, role, stack, outcome, and the screenshot where there is one.
import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { FeedEntry } from '@/lib/experience-data';
import type { ProjectCase, Shot } from '@/lib/projects';
import { ProjectShot } from './ProjectPreview';

const EASE = [0.22, 1, 0.36, 1] as const;
const LABEL = 'font-heading text-[11.5px] font-bold uppercase tracking-[0.16em]';

export default function ProjectPanel({
  story,
  links,
  shot,
}: {
  story: ProjectCase;
  links?: FeedEntry['links'];
  shot?: Shot;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const reduce = useReducedMotion();

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {links?.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group -my-3 inline-flex items-center gap-1.5 py-3 text-ink/70 transition-colors hover:text-accent ${LABEL}`}
          >
            <span className="border-b border-rule pb-0.5 transition-colors group-hover:border-accent">{link.label}</span>
            <span aria-hidden className="text-[13px] leading-none">↗</span>
          </a>
        ))}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          data-project-more
          className={`group -my-3 inline-flex min-h-[44px] items-center gap-1.5 py-3 text-ink transition-colors hover:text-accent ${LABEL}`}
        >
          <span className="border-b border-ink/40 pb-0.5 transition-colors group-hover:border-accent">{open ? 'Less' : 'More'}</span>
          <span className="sr-only">{` about ${story.name}`}</span>
          <svg
            aria-hidden
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-300 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      <motion.div
        id={panelId}
        role="region"
        aria-label={`${story.name}: problem, role, stack and outcome`}
        aria-hidden={!open}
        inert={!open}
        data-project-panel
        data-open={open ? '1' : '0'}
        initial={false}
        animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={
          reduce
            ? { duration: 0 }
            : { height: { duration: 0.42, ease: EASE }, opacity: { duration: open ? 0.3 : 0.18, delay: open ? 0.06 : 0 } }
        }
        className="overflow-hidden"
      >
        <div className="pt-4">
          <div className="max-w-[72ch] border-t border-rule pt-5">
            <dl className="grid gap-x-8 gap-y-1 sm:grid-cols-[6.5rem_1fr] sm:gap-y-4">
              <dt className={`text-faint sm:pt-1 ${LABEL}`}>Problem</dt>
              <dd className="mb-3 text-[15px] leading-relaxed text-muted sm:mb-0">{story.problem}</dd>

              {story.role ? (
                <>
                  <dt className={`text-faint sm:pt-1 ${LABEL}`}>My role</dt>
                  <dd className="mb-3 text-[15px] leading-relaxed text-muted sm:mb-0">
                    {story.role}
                    {story.team && <span className="mt-1 block text-[13.5px] text-faint">{story.team}</span>}
                  </dd>
                </>
              ) : (
                story.team && (
                  <>
                    <dt className={`text-faint sm:pt-1 ${LABEL}`}>Team</dt>
                    <dd className="mb-3 text-[15px] leading-relaxed text-muted sm:mb-0">{story.team}</dd>
                  </>
                )
              )}

              <dt className={`text-faint sm:pt-1 ${LABEL}`}>Stack</dt>
              <dd className="mb-3 text-[15px] leading-relaxed text-ink/80 sm:mb-0">{story.stack.join(' · ')}</dd>

              <dt className={`text-faint sm:pt-2.5 ${LABEL}`}>Outcome</dt>
              <dd>
                <p className="flex flex-wrap items-baseline gap-x-2.5">
                  <span className="font-heading text-[30px] font-extrabold leading-tight tracking-[-0.02em] text-ink">{story.outcome.big}</span>
                  <span className="text-[15px] text-muted">{story.outcome.label}</span>
                </p>
                {story.outcome.detail && <p className="mt-1 text-[14px] leading-relaxed text-faint">{story.outcome.detail}</p>}
              </dd>
            </dl>
            {shot && <ProjectShot shot={shot} className="mt-6 max-w-[560px]" />}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
