'use client';
// Quiet ring: the icons never change size. Hover brightens the ring and the icon.
import { linkProps, press, type VariantProps } from './shared';

export default function Quiet({ socials, className, style }: VariantProps) {
  return (
    // iOS Safari only shows :active (the press-in) when a touch listener exists
    <nav aria-label="Elsewhere" onTouchStart={() => {}} className={`flex gap-2 ${className ?? ''}`} style={style}>
      {socials.map((s) => (
        <a
          key={s.name}
          {...linkProps(s)}
          className={`grid size-11 shrink-0 place-items-center rounded-full border border-chalk/15 text-chalk/60 transition-[color,border-color,transform] duration-150 ease-out active:border-chalk/45 active:text-chalk focus-visible:border-chalk/45 focus-visible:text-chalk [@media(hover:hover)]:hover:border-chalk/45 [@media(hover:hover)]:hover:text-chalk ${press}`}
        >
          {s.icon}
        </a>
      ))}
    </nav>
  );
}
