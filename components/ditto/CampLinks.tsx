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
    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px]">
      <a href={`mailto:${EMAIL}`} {...h} className="bg-ink px-5 py-3 font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-paper transition-colors hover:bg-accent">
        {EMAIL}
      </a>
      <a
        href="https://www.linkedin.com/in/seyon-sri/"
        target="_blank"
        rel="noopener noreferrer"
        {...h}
        className="font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-ink/70 transition-colors hover:text-accent"
      >
        LinkedIn
      </a>
    </div>
  );
}
