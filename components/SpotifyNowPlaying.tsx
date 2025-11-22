'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface NowPlaying {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

export default function SpotifyNowPlaying() {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>({ isPlaying: false });
  const [barHeights, setBarHeights] = useState<number[]>(
    Array.from({ length: 80 }, () => 2)
  );
  const [targetHeights, setTargetHeights] = useState<number[]>(
    Array.from({ length: 80 }, () => 2)
  );
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'starting' | 'playing' | 'stopping'>('idle');
  const [prevPlaying, setPrevPlaying] = useState(false);

  // Fetch current track
  useEffect(() => {
    const fetchNowPlaying = async () => {
      const res = await fetch('/api/spotify/now-playing');
      const data = await res.json();
      setNowPlaying(data);
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle play state changes
  useEffect(() => {
    if (nowPlaying.isPlaying !== prevPlaying) {
      if (nowPlaying.isPlaying) {
        setAnimationPhase('starting');
        setTimeout(() => setAnimationPhase('playing'), 800);
      } else {
        setAnimationPhase('stopping');
        setTimeout(() => setAnimationPhase('idle'), 1000);
      }
      setPrevPlaying(nowPlaying.isPlaying);
    }
  }, [nowPlaying.isPlaying, prevPlaying]);

  // Animate visualizer bars
  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now();

      if (animationPhase === 'starting') {
        // Startup animation - bars rise in a wave
        setTargetHeights(prev =>
          prev.map((_, i) => {
            const wavePosition = (time / 50) % 80;
            const distance = Math.abs(i - wavePosition);
            if (distance < 10) {
              const intensity = 1 - (distance / 10);
              return Math.floor(intensity * 12);
            }
            return 1;
          })
        );
      } else if (animationPhase === 'playing') {
        // Normal playing animation
        setTargetHeights(prev =>
          prev.map((_, i) => {
            const wave1 = Math.sin(time / 300 + i * 0.1) * 0.3;
            const wave2 = Math.sin(time / 200 + i * 0.2) * 0.2;
            const wave3 = Math.sin(time / 400 + i * 0.15) * 0.2;
            const baseHeight = (wave1 + wave2 + wave3) + 0.5;
            const randomness = Math.random() * 0.2;
            const height = Math.floor((baseHeight + randomness) * 12);
            return Math.max(2, Math.min(12, height));
          })
        );
      } else if (animationPhase === 'stopping') {
        // Stopping animation - cascade drop effect
        setTargetHeights(prev =>
          prev.map((_, i) => {
            const cascadeDelay = i * 15; // Delay for cascade effect
            const timeSinceStopping = time % 1000;
            if (timeSinceStopping > cascadeDelay) {
              const dropProgress = Math.min(1, (timeSinceStopping - cascadeDelay) / 200);
              const currentHeight = prev[i];
              return Math.floor(currentHeight * (1 - dropProgress * 0.8));
            }
            return prev[i];
          })
        );
      } else {
        // Idle state - minimal movement
        setTargetHeights(Array.from({ length: 80 }, (_, i) => {
          const idleWave = Math.sin(time / 2000 + i * 0.2) * 0.3 + 1.3;
          return (i % 8 === 0 || i % 8 === 4) ? Math.floor(idleWave) : 1;
        }));
      }

      // Smooth transition to target heights
      setBarHeights(prev =>
        prev.map((height, i) => {
          const target = targetHeights[i];
          const diff = target - height;
          // Different easing based on animation phase
          const easing = animationPhase === 'stopping' ? 0.15 :
                         animationPhase === 'starting' ? 0.25 : 0.3;
          return height + diff * easing;
        })
      );
    }, 40); // Faster updates for smoother animations

    return () => clearInterval(interval);
  }, [animationPhase, targetHeights]);

  return (
    <div className="bg-retro-gray-dark border-4 border-retro-black rounded-lg overflow-hidden shadow-lg">
      {/* Top section - Album art and track info */}
      <div className="p-3 sm:p-4 bg-retro-gray-dark">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          {nowPlaying.isPlaying ? (
            <>
              <div className="w-2 h-2 bg-retro-white rounded-full animate-pulse"></div>
              <p className="text-[10px] font-pixel text-retro-white">NOW PLAYING</p>
            </>
          ) : nowPlaying.title ? (
            <p className="text-[10px] font-pixel text-retro-white">LAST PLAYED</p>
          ) : (
            <p className="text-[10px] font-pixel text-retro-white">NOT PLAYING</p>
          )}
        </div>

        {!nowPlaying.title ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-retro-black rounded border-2 border-retro-gray flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
              🎵
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-pixel text-retro-white">No Recent Tracks</p>
              <p className="text-[9px] sm:text-[10px] font-pixel text-retro-gray-light">Spotify</p>
            </div>
          </div>
        ) : (
          <a
            href={nowPlaying.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
          >
            {nowPlaying.albumImageUrl && (
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 border-2 border-retro-black flex-shrink-0">
                <Image
                  src={nowPlaying.albumImageUrl}
                  alt={nowPlaying.album || 'Album cover'}
                  width={80}
                  height={80}
                  className="pixelated"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-pixel text-retro-white truncate mb-1">
                {nowPlaying.title}
              </p>
              <p className="text-[9px] sm:text-[10px] font-pixel text-retro-gray-light truncate">
                {nowPlaying.artist}
              </p>
            </div>
          </a>
        )}
      </div>

      {/* Visualizer section - Retro LED Matrix Style */}
      <div className="relative bg-retro-black border-t-2 border-retro-gray overflow-hidden">
        {/* Grid background for LED matrix effect */}
        <div className="absolute inset-0 visualizer-grid pointer-events-none"></div>

        {/* Visualizer bars */}
        <div
          className={`relative grid items-end gap-[1px] px-1 py-1 visualizer-${animationPhase}`}
          style={{
            gridTemplateColumns: 'repeat(80, minmax(0, 1fr))',
            height: '40px'
          }}
        >
          {Array.from({ length: 80 }).map((_, col) => (
            <div key={col} className="flex flex-col-reverse sound-wave-bar h-full">
              {Array.from({ length: 12 }).map((_, row) => {
                const height = Math.floor(barHeights[col]);
                const isActive = row < height;
                const isTop = row === height - 1;
                return (
                  <div
                    key={row}
                    data-row={row}
                    className={`visualizer-pixel ${isActive ? 'is-active' : ''} ${isTop && isActive ? 'is-peak' : ''}`}
                    style={{
                      width: '100%',
                      height: '3px',
                      marginBottom: '1px'
                    }}
                  ></div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
