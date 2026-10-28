'use client';
// Fill: hover fills the ring with chalk and the icon turns charcoal. Size never changes.
import { linkProps, press, type VariantProps } from './shared';

export default function Fill({ socials, className, style }: VariantProps) {
  return (
    // iOS Safari only shows :active (the press-in) when a touch listener exists
    <nav aria-label="Elsewhere" onTouchStart={() => {}} className={`flex gap-2 ${className ?? ''}`} style={style}>
      {socials.map((s) => (
        <a
          key={s.name}
          {...linkProps(s)}
          className={`grid size-11 shrink-0 place-items-center rounded-full border border-chalk/15 text-chalk/60 transition-[color,background-color,border-color,transform] duration-200 ease-out active:border-chalk active:bg-chalk active:text-charcoal focus-visible:border-chalk focus-visible:bg-chalk focus-visible:text-charcoal [@media(hover:hover)]:hover:border-chalk [@media(hover:hover)]:hover:bg-chalk [@media(hover:hover)]:hover:text-charcoal ${press}`}
        >
          {s.icon}
        </a>
      ))}
    </nav>
  );
}
