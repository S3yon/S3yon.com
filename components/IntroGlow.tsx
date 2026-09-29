// A warm glow behind the name. The intro has one look; the theme switch only changes the timeline.
export default function IntroGlow() {
  return (
    <span aria-hidden className="absolute left-[-10%] top-[8%] h-[80vmin] w-[120vmin] rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(238,155,75,0.12), rgba(232,119,58,0.05) 55%, transparent)' }} />
  );
}
