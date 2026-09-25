// Pikachu from a 4×4 sprite sheet of 64px frames (public/sprites/pikachu.png).
// Top row walks toward the viewer (scrolling down); bottom row walks away (scrolling up).
// Frames cycle only while `running`; at rest it holds the first frame.
export default function Pikachu({
  running,
  facing,
}: {
  running: boolean;
  facing: 'down' | 'up';
}) {
  return (
    <span
      aria-hidden
      data-running={running}
      className="pika block h-16 w-16"
      style={{
        backgroundImage: 'url(/sprites/pikachu.png)',
        backgroundSize: '256px 256px',
        backgroundPositionY: facing === 'up' ? '-192px' : '0px',
        imageRendering: 'pixelated',
      }}
    />
  );
}
