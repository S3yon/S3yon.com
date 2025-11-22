'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function RetroAvatar() {
  const [currentFrame, setCurrentFrame] = useState(0);

  // Blinking animation - mostly normal, occasional blinks
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      // Show blink for 200ms
      setCurrentFrame(1);
      setTimeout(() => setCurrentFrame(0), 200);
    }, 2000 + Math.random() * 1000); // Random interval between 2-3 seconds

    return () => clearInterval(blinkInterval);
  }, []);

  const frames = [
    '/avatar-normal.png',    // Normal face
    '/avatar-blink.png',     // Eyes closed
  ];

  return (
    <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-retro-black rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-retro-black p-1">
      <div className="w-full h-full bg-retro-white rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden">
        <Image
          src={frames[currentFrame]}
          alt="Avatar"
          width={184}
          height={184}
          className="pixelated w-full h-full object-cover"
          priority
        />
      </div>
    </div>
  );
}
