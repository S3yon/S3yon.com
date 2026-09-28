// The intro changes with the theme but keeps its charcoal. Light: a warm glow behind the name.
// Dark: a deeper charcoal (globals.css) and a lightning flicker across the panel every ~7s.
export default function IntroGlow() {
  return (
    <>
      <span aria-hidden className="intro-light absolute left-[-10%] top-[8%] h-[80vmin] w-[120vmin] rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(238,155,75,0.12), rgba(232,119,58,0.05) 55%, transparent)' }} />
      <span aria-hidden className="intro-dark intro-flicker absolute inset-0 bg-[#DCE4FF]" />
    </>
  );
}
