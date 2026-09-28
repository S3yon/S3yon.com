'use client';

const EMAIL = 'sriskans@sheridancollege.ca';

// Hovering or focusing a link stokes the campfire and has both of them turn round to you and hop.
const invite = () => {
  window.dispatchEvent(new Event('campfire:flare'));
  window.dispatchEvent(new Event('campfire:welcome'));
};

export default function CampLinks() {
  const h = { onPointerEnter: invite, onFocus: invite };
  // Same as the rest of the site: one square solid-ink CTA, and the timeline's link style
  // (uppercase micro-label, hairline underline that turns accent, ↗) for LinkedIn.
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-4">
      <a
        href={`mailto:${EMAIL}`}
        title={EMAIL}
        {...h}
        className="inline-block bg-ink px-5 py-3 font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-paper transition-colors hover:bg-accent"
      >
        Email me
      </a>
      <a
        href="https://www.linkedin.com/in/seyon-sri/"
        target="_blank"
        rel="noopener noreferrer"
        {...h}
        className="group -my-2 inline-flex items-center gap-1.5 py-2 font-heading text-[11.5px] font-bold uppercase tracking-[0.16em] text-ink/70 transition-colors hover:text-accent"
      >
        <span className="border-b border-rule pb-0.5 transition-colors group-hover:border-accent">LinkedIn</span>
        <span aria-hidden className="text-[13px] leading-none">↗</span>
      </a>
    </div>
  );
}
