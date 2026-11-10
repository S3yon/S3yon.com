'use client';
// The resume as a sixth ring after the socials (design lab pick A3a, 2026-11-10). Same quiet ring
// as social-fx/Quiet.tsx; a RESUME label fades in beside it on hover or keyboard focus (under it
// on phones, where only a keyboard can show it). Opens the PDF itself, no resume page.
import { press } from './social-fx/shared';
import { RESUME_PATH } from '@/lib/site';

export default function ResumeRing() {
  return (
    <a
      href={RESUME_PATH}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Resume (PDF)"
      // iOS Safari only shows :active (the press-in) when a touch listener exists
      onTouchStart={() => {}}
      className={`group relative grid size-11 shrink-0 place-items-center rounded-full border border-chalk/15 text-chalk/60 transition-[color,border-color,transform] duration-150 ease-out active:border-chalk/45 active:text-chalk focus-visible:border-chalk/45 focus-visible:text-chalk [@media(hover:hover)]:hover:border-chalk/45 [@media(hover:hover)]:hover:text-chalk ${press}`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2.5V8h5.5M8.5 13h7M8.5 17h5" />
      </svg>
      <span
        aria-hidden
        data-resume-label
        className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap font-display text-[11px] leading-none tracking-[0.24em] text-chalk opacity-0 transition-opacity duration-150 ease-out group-focus-visible:opacity-100 sm:left-full sm:top-1/2 sm:ml-3 sm:mt-0 sm:-translate-y-1/2 sm:translate-x-0 [@media(hover:hover)]:group-hover:opacity-100"
      >
        RESUME
      </span>
    </a>
  );
}
