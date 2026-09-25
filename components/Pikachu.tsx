// Small side-on Pikachu drawn from primitives (no image asset). Legs cycle and the body
// bobs only while `running`; `facing` flips it when the reader scrolls back up.
export default function Pikachu({
  running,
  facing,
  size = 34,
}: {
  running: boolean;
  facing: 'down' | 'up';
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden
      data-running={running}
      className="pika overflow-visible"
      style={{ transform: facing === 'up' ? 'scaleX(-1)' : undefined }}
    >
      <g className="pika-body">
        {/* tail */}
        <path
          d="M13 25 L4 21 L9 18 L2 11 L12 13 L10 8 L17 17 L12 18 L16 22 Z"
          fill="#F6CE3A"
          stroke="#8B5A2B"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        <path d="M13 25 L10 23.6 L13.8 21.4 Z" fill="#8B5A2B" />

        {/* back leg */}
        <ellipse className="pika-leg-b" cx="17" cy="33.5" rx="3.2" ry="2" fill="#E2B52A" />

        {/* body */}
        <ellipse cx="20" cy="27" rx="8.5" ry="7" fill="#F6CE3A" />
        <path d="M14 22.5 q2 -1 3.5 0.2" stroke="#8B5A2B" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M13.2 25 q2 -1 3.5 0.2" stroke="#8B5A2B" strokeWidth="1.2" fill="none" strokeLinecap="round" />

        {/* front leg */}
        <ellipse className="pika-leg-a" cx="23.5" cy="33.5" rx="3.2" ry="2" fill="#F6CE3A" />

        {/* ears */}
        <path d="M22 12 L14 1 L26.5 9.8 Z" fill="#F6CE3A" />
        <path d="M14 1 L17.2 5.4 L19 4.5 Z" fill="#1B1B1B" />
        <path d="M26.5 9.6 L27 -2 L31.5 10.8 Z" fill="#F6CE3A" />
        <path d="M27 -2 L26.8 2.6 L28.8 3.1 Z" fill="#1B1B1B" />

        {/* head */}
        <circle cx="28" cy="17" r="7.8" fill="#F6CE3A" />
        <circle cx="30.2" cy="15.2" r="1.7" fill="#1B1B1B" />
        <circle cx="30.7" cy="14.6" r="0.6" fill="#fff" />
        <circle cx="31.4" cy="20.2" r="2" fill="#E24A3B" />
        <circle cx="35.3" cy="17.2" r="0.55" fill="#1B1B1B" />
        <path d="M33.6 19.4 q0.8 0.9 1.8 0.2" stroke="#1B1B1B" strokeWidth="0.6" fill="none" strokeLinecap="round" />

        {/* arm */}
        <ellipse cx="26.5" cy="25.5" rx="2.6" ry="1.6" fill="#E2B52A" transform="rotate(-25 26.5 25.5)" />
      </g>
    </svg>
  );
}
