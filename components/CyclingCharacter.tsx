'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CyclingCharacter() {
  const [currentFrame, setCurrentFrame] = useState(0);

  // Cycle through the 3 frames for animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % 3);
    }, 200); // Change frame every 200ms for smooth cycling animation

    return () => clearInterval(interval);
  }, []);

  const frames = [
    '/character-19.png',
    '/character-20.png',
    '/character-21.png',
  ];

  return (
    <div className="cycling-character">
      <Image
        src={frames[currentFrame]}
        alt="Cycling character"
        width={36}
        height={36}
        className="pixelated cycling-sprite"
        priority
      />
    </div>
  );
}
