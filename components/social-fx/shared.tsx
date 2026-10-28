// Pieces for the social icons: the link attributes and the press-in.
import type { Social } from '@/lib/socials';

export type VariantProps = { socials: Social[]; className?: string; style?: React.CSSProperties };

export const linkProps = (s: Social) => {
  const mail = s.url.startsWith('mailto:');
  return {
    href: s.url,
    'aria-label': s.name,
    title: s.name,
    target: mail ? undefined : '_blank',
    rel: mail ? undefined : 'noopener noreferrer',
  };
};

// Fingers get a small press-in; the hover styles only apply where a pointer can hover.
export const press = '[-webkit-tap-highlight-color:transparent] active:scale-[0.96] focus-visible:outline-none';
