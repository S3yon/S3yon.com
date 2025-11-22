'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface VillagerProps {
  name: string;
  startPosition: { x: number; y: number };
  walkSpeed?: number;
  animationSpeed?: number;
  scale?: number;
}

export default function Villager({ name, startPosition, walkSpeed = 100, animationSpeed = 400, scale = 1 }: VillagerProps) {
  const [position] = useState(startPosition);
  const [facing, setFacing] = useState<'front' | 'back' | 'left' | 'right'>('front');
  
  // Get sprite name based on direction
  const getSpriteName = () => {
    // Fix for adam's filename with space issue
    if (name === 'adam' && facing === 'right') {
      return 'adam-right-side'; // Without the space
    }
    
    // Special case for girl villager (different naming)
    if (name === 'girl') {
      if (facing === 'left') return 'girl-left-side';
      if (facing === 'right') return 'girl-right-side';
      return 'girl-front';
    }
    
    // Standard naming for other villagers
    const directionMap = {
      'front': 'front',
      'back': 'back',
      'left': 'left-side',
      'right': 'right-side'
    };
    
    return `${name}-${directionMap[facing]}`;
  };
  
  // Random turning animation
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly change direction
      const directions: Array<'front' | 'back' | 'left' | 'right'> = ['front', 'back', 'left', 'right'];
      const randomDirection = directions[Math.floor(Math.random() * directions.length)];
      setFacing(randomDirection);
    }, 3000 + Math.random() * 3000); // Random interval between 3-6 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      className="absolute villager-sprite pointer-events-none"
      style={{
        right: `${position.x}px`,
        top: `${position.y}%`,
        transform: `scale(${scale})`,
        transition: 'right 0.05s linear',
        zIndex: Math.floor(position.y)
      }}
    >
      <Image
        src={`/${getSpriteName()}.png`}
        alt={name}
        width={32}
        height={32}
        className="pixelated"
        priority
      />
    </div>
  );
}
