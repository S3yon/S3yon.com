import Pikachu, { type PikaFacing } from '../Pikachu';

const ROW: Record<PikaFacing, number> = { down: 0, left: 1, right: 2, up: 3 };

// Ditto from public/sprites/ditto.png: a 4×4 sheet of 64px frames in the same layout as
// Pikachu's (rows down, left, right, up), so it shares the .pika walk and breathe CSS.
// `scale` enlarges it pixel-perfect.
export function DittoSprite({ walking = false, fast = false, facing = 'down', scale = 1 }: { walking?: boolean; fast?: boolean; facing?: PikaFacing; scale?: number }) {
  return (
    <span aria-hidden className="block" style={{ width: 64 * scale, height: 64 * scale }}>
      <span className="block origin-top-left" style={{ transform: `scale(${scale})` }}>
        <span
          data-walking={walking}
          data-fast={fast}
          className="pika block h-16 w-16"
          style={{
            backgroundImage: 'url(/sprites/ditto.png)',
            backgroundSize: '256px 256px',
            backgroundPositionY: `${-ROW[facing] * 64}px`,
            imageRendering: 'pixelated',
          }}
        />
      </span>
    </span>
  );
}

// Ditto's copy of Pikachu: the real sprite, recoloured lavender. The copy is never quite right.
export function DittoPika({ facing = 'down', walking = false }: { facing?: PikaFacing; walking?: boolean }) {
  return (
    <span className="block" style={{ filter: 'hue-rotate(245deg) saturate(0.55) brightness(1.08)' }}>
      <Pikachu walking={walking} facing={facing} />
    </span>
  );
}
