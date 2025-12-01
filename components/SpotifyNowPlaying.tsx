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
    Array.from({ length: 60 }, () => 1)
  );
  const [targetHeights, setTargetHeights] = useState<number[]>(
    Array.from({ length: 60 }, () => 1)
  );
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'starting' | 'playing' | 'stopping'>('idle');
  const [prevPlaying, setPrevPlaying] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  // Fetch current track
  useEffect(() => {
    const fetchNowPlaying = async () => {
      const res = await fetch('/api/spotify/now-playing');
      const data = await res.json();
      setNowPlaying(data);
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 15000);

    return () => clearInterval(interval);
  }, []);

  // Set initial animation phase on mount and when track info changes
  useEffect(() => {
    if (nowPlaying.title) {
      // If we have track info (playing or last played), keep animating
      if (nowPlaying.isPlaying && animationPhase !== 'playing' && animationPhase !== 'starting') {
        setAnimationPhase('starting');
        setTimeout(() => setAnimationPhase('playing'), 800);
      } else if (!nowPlaying.isPlaying && animationPhase === 'idle') {
        // Last played song - use playing animation
        setAnimationPhase('playing');
      }
    } else if (!nowPlaying.title && animationPhase !== 'idle') {
      // No track info at all - go to idle
      setAnimationPhase('stopping');
      setTimeout(() => setAnimationPhase('idle'), 1000);
    }
  }, [nowPlaying.isPlaying, nowPlaying.title, animationPhase]);

  // Handle play state changes
  useEffect(() => {
    if (nowPlaying.isPlaying !== prevPlaying) {
      if (nowPlaying.isPlaying) {
        setAnimationPhase('starting');
        setTimeout(() => setAnimationPhase('playing'), 800);
      } else {
        if (nowPlaying.title) {
          // Keep playing animation for last played song
          setAnimationPhase('playing');
        } else {
          setAnimationPhase('stopping');
          setTimeout(() => setAnimationPhase('idle'), 1000);
        }
      }
      setPrevPlaying(nowPlaying.isPlaying);
    }
  }, [nowPlaying.isPlaying, prevPlaying, nowPlaying.title]);

  // Animate visualizer bars using requestAnimationFrame for better performance
  useEffect(() => {
    let animationFrameId: number;
    const UPDATE_INTERVAL = 80; // Slightly faster for smoother animation

    const animate = () => {
      const time = Date.now();

      if (time - lastUpdateTime >= UPDATE_INTERVAL) {
        setLastUpdateTime(time);

        if (animationPhase === 'starting') {
          setTargetHeights(prev =>
            prev.map(() => {
              const progress = (time % 800) / 800;
              return Math.floor(progress * 24);
            })
          );
        } else if (animationPhase === 'playing') {
          setTargetHeights(prev =>
            prev.map((_, i) => {
              const seed = i * 0.5;
              // Smoother, more fluid waves
              const wave1 = Math.sin(time / 350 + seed) * 0.45;
              const wave2 = Math.sin(time / 500 + seed * 1.3) * 0.3;
              const wave3 = Math.sin(time / 700 + seed * 0.7) * 0.2;
              const baseHeight = Math.abs(wave1 + wave2 + wave3);
              // Reduced randomness for smoother flow
              const randomness = Math.random() * 0.25;
              const spike = Math.random() > 0.92 ? Math.random() * 0.4 : 0; // 8% chance of spike
              const height = Math.floor((baseHeight + randomness + spike) * 24);
              return Math.max(1, Math.min(24, height));
            })
          );
        } else if (animationPhase === 'stopping') {
          setTargetHeights(prev =>
            prev.map((_, i) => {
              const cascadeDelay = i * 15;
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
          setTargetHeights(Array.from({ length: 60 }, (_, i) => {
            const idleWave = Math.sin(time / 2000 + i * 0.2) * 0.3 + 1.3;
            return (i % 8 === 0 || i % 8 === 4) ? Math.floor(idleWave) : 1;
          }));
        }

        setBarHeights(prev =>
          prev.map((height, i) => {
            const target = targetHeights[i];
            const diff = target - height;
            if (Math.abs(diff) < 0.1) return height;

            // Smoother easing for fluid motion
            const easing = animationPhase === 'stopping' ? 0.15 :
                           animationPhase === 'starting' ? 0.3 : 0.28;
            return height + diff * easing;
          })
        );
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [animationPhase, targetHeights, lastUpdateTime]);

  return (
    <div className="relative bg-retro-gray-dark dark:bg-retro-black border-4 border-retro-black dark:border-retro-tan rounded-lg overflow-hidden shadow-lg transition-colors duration-300">
      {/* Top section - Album art and track info */}
      <div className="relative p-3 sm:p-4 bg-retro-gray-dark dark:bg-retro-black transition-colors duration-300">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          {nowPlaying.isPlaying ? (
            <>
              <div className="w-2 h-2 bg-retro-white dark:bg-retro-tan rounded-full animate-pulse transition-colors duration-300"></div>
              <p className="text-[10px] font-pixel text-retro-white dark:text-retro-tan transition-colors duration-300">NOW PLAYING</p>
            </>
          ) : nowPlaying.title ? (
            <p className="text-[10px] font-pixel text-retro-white dark:text-retro-tan transition-colors duration-300">LAST PLAYED</p>
          ) : (
            <p className="text-[10px] font-pixel text-retro-white dark:text-retro-tan transition-colors duration-300">NOT PLAYING</p>
          )}
        </div>

        {!nowPlaying.title ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-retro-black dark:bg-retro-gray-dark rounded border-2 border-retro-gray dark:border-retro-tan-dark flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 transition-colors duration-300">
              🎵
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-pixel text-retro-white dark:text-retro-tan transition-colors duration-300">No Recent Tracks</p>
              <p className="text-[9px] sm:text-[10px] font-pixel text-retro-gray-light dark:text-retro-tan-dark transition-colors duration-300">Spotify</p>
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
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 border-2 border-retro-black dark:border-retro-tan flex-shrink-0 transition-colors duration-300">
                <Image
                  src={nowPlaying.albumImageUrl}
                  alt={nowPlaying.album || 'Album cover'}
                  width={80}
                  height={80}
                  className="pixelated"
                />
              </div>
            )}

            <div className="flex-1 min-w-0 pr-2">
              <p className="text-xs sm:text-sm font-pixel text-retro-white dark:text-retro-tan mb-1 transition-colors duration-300 break-words overflow-wrap-anywhere leading-tight">
                {nowPlaying.title}
              </p>
              <p className="text-[9px] sm:text-[10px] font-pixel text-retro-gray-light dark:text-retro-tan-dark transition-colors duration-300 break-words overflow-wrap-anywhere leading-tight">
                {nowPlaying.artist}
              </p>
            </div>
          </a>
        )}
      </div>

      {/* Visualizer section - Retro LED Matrix Style */}
      <div className="relative bg-retro-black dark:bg-retro-gray-dark border-t-2 border-retro-gray dark:border-retro-tan-dark overflow-hidden transition-colors duration-300">
        {/* Grid background for LED matrix effect */}
        <div className="absolute inset-0 visualizer-grid pointer-events-none"></div>

        {/* Visualizer bars */}
        <div
          className={`relative grid items-end gap-[2px] px-2 py-2 visualizer-${animationPhase}`}
          style={{
            gridTemplateColumns: 'repeat(60, minmax(0, 1fr))',
            height: '80px'
          }}
        >
          {Array.from({ length: 60 }).map((_, col) => (
            <div key={col} className="flex flex-col-reverse sound-wave-bar h-full">
              {Array.from({ length: 24 }).map((_, row) => {
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
