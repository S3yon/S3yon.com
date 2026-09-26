// App icon candidates: the "S" from the cover name (Anton) on a gradient.
export const ICONS = {
  ember: { bg: 'linear-gradient(135deg, #F2A65A 0%, #B4502A 55%, #5A2314 100%)', fg: '#F4F3F0', name: 'Ember: amber to rust to deep brown, chalk S' },
  thunder: { bg: 'linear-gradient(145deg, #FFE27A 0%, #F6CE3A 35%, #E07B39 100%)', fg: '#18181A', name: 'Thunder: Pikachu yellow to orange, ink S' },
  night: { bg: 'radial-gradient(120% 120% at 20% 10%, #B4502A 0%, #3A2A2A 45%, #161618 100%)', fg: '#C8C7C3', name: 'Night: rust glow into charcoal, chalk S (matches the cover)' },
  dusk: { bg: 'linear-gradient(160deg, #6D5BD0 0%, #C0527A 50%, #F2A65A 100%)', fg: '#F4F3F0', name: 'Dusk: violet to rose to amber, chalk S' },
} as const;
export type IconKey = keyof typeof ICONS;

export default function IconOption({ k, size = 120, radius = 0.22 }: { k: IconKey; size?: number; radius?: number }) {
  const o = ICONS[k];
  return (
    <span
      className="relative grid place-items-center overflow-hidden font-display leading-none"
      style={{ width: size, height: size, borderRadius: size * radius, background: o.bg, color: o.fg, fontSize: size * 0.78 }}
    >
      <span style={{ transform: `translateY(${(size * 0.03).toFixed(1)}px)` }}>S</span>
    </span>
  );
}
