'use client';

import { useState, useEffect } from 'react';

export default function Avatar() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-32 h-32 bg-gameboy-lightest border-4 border-gameboy-dark rounded-lg flex items-center justify-center">
      {/* Pixel art avatar placeholder - you can replace with actual pixel art */}
      <div className={`transition-transform ${isAnimating ? 'scale-105' : 'scale-100'}`}>
        <div className="text-6xl">👨‍💻</div>
      </div>
      {/* Animated scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded">
        <div className="absolute w-full h-0.5 bg-white opacity-20 animate-scan"></div>
      </div>
    </div>
  );
}
