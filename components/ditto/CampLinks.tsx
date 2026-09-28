'use client';

const EMAIL = 'sriskans@sheridancollege.ca';

// Hovering or focusing a link stokes the campfire and has both of them turn round to you and hop.
const invite = () => {
  window.dispatchEvent(new Event('campfire:flare'));
  window.dispatchEvent(new Event('campfire:welcome'));
};

export default function CampLinks() {
  const h = { onPointerEnter: invite, onFocus: invite };
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <a
        href={`mailto:${EMAIL}`}
        title={EMAIL}
        {...h}
        className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-5 py-2.5 font-heading text-[12px] font-bold uppercase tracking-[0.14em] text-paper shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:shadow-md"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
          <path d="m3 6 9 7 9-7" />
        </svg>
        <span>Email Me</span>
      </a>

      <a
        href="https://www.linkedin.com/in/seyon-sri/"
        target="_blank"
        rel="noopener noreferrer"
        {...h}
        className="group inline-flex items-center gap-2.5 rounded-full border border-rule bg-paper px-5 py-2.5 font-heading text-[12px] font-bold uppercase tracking-[0.14em] text-ink shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-ink hover:text-accent hover:shadow-md"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
        </svg>
        <span>LinkedIn</span>
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
        >
          <path d="M7 17 17 7M7 7h10v10" />
        </svg>
      </a>
    </div>
  );
}
