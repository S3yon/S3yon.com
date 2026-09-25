export type PikaFacing = 'down' | 'left' | 'right' | 'up';

// Row of the 4×4 sprite sheet (64px frames) for each direction.
const ROW: Record<PikaFacing, number> = { down: 0, left: 1, right: 2, up: 3 };

// Pikachu from public/sprites/pikachu.png. Frames cycle only while `walking`; `fast`
// doubles the cadence for quick scrolls. At rest it holds the first frame of its row.
export default function Pikachu({
  walking,
  fast = false,
  facing,
}: {
  walking: boolean;
  fast?: boolean;
  facing: PikaFacing;
}) {
  return (
    <span
      aria-hidden
      data-walking={walking}
      data-fast={fast}
      className="pika block h-16 w-16"
      style={{
        backgroundImage: 'url(/sprites/pikachu.png)',
        backgroundSize: '256px 256px',
        backgroundPositionY: `${-ROW[facing] * 64}px`,
        imageRendering: 'pixelated',
      }}
    />
  );
}
