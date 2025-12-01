'use client';

export default function CRTOverlay() {
  return (
    <>
      {/* Permanent CRT Effects Overlay */}
      <div className="fixed inset-0 z-[100] pointer-events-none crt-container">
        {/* Scanlines - always visible */}
        <div className="crt-scanlines"></div>

        {/* Screen curvature overlay */}
        <div className="crt-curvature"></div>

        {/* Subtle vignette */}
        <div className="crt-vignette"></div>

        {/* RGB chromatic aberration */}
        <div className="crt-rgb-split"></div>

        {/* Phosphor glow effect */}
        <div className="crt-phosphor-glow"></div>

        {/* Subtle screen flicker */}
        <div className="crt-flicker"></div>
      </div>
    </>
  );
}
