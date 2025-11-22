'use client';

import { useState } from 'react';

export default function RecordPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState(0);

  const albums = [
    { title: 'Lofi Beats', artist: 'Chillhop', cover: '🎵' },
    { title: 'Synthwave', artist: 'RetroWave', cover: '🎹' },
    { title: '8-Bit Dreams', artist: 'Pixel Music', cover: '🎮' },
    { title: 'Jazz Vibes', artist: 'Smooth Jazz', cover: '🎺' },
  ];

  return (
    <div className="bg-retro-gray-dark border-4 border-retro-gray rounded-lg p-4">
      <div className="text-center mb-3">
        <h3 className="text-xs font-pixel text-retro-white">RECORD PLAYER</h3>
      </div>

      {/* Turntable */}
      <div className="relative bg-retro-black rounded-full w-32 h-32 mx-auto mb-3 border-4 border-retro-gray flex items-center justify-center">
        {/* Record */}
        <div
          className={`w-28 h-28 bg-retro-gray-dark rounded-full border-4 border-retro-gray flex items-center justify-center transition-transform ${
            isPlaying ? 'animate-spin-slow' : ''
          }`}
        >
          {/* Album Cover */}
          <div className="w-16 h-16 bg-retro-white rounded-full flex items-center justify-center text-3xl border-2 border-retro-black">
            {albums[currentAlbum].cover}
          </div>
        </div>

        {/* Tonearm */}
        <div className="absolute -right-2 top-1/4 w-16 h-1 bg-retro-gray-light origin-left rotate-45"></div>
      </div>

      {/* Album Info */}
      <div className="text-center mb-3 border-2 border-retro-gray rounded p-2 bg-retro-gray-dark">
        <p className="text-xs font-pixel text-retro-white truncate">{albums[currentAlbum].title}</p>
        <p className="text-[10px] font-pixel text-retro-gray-light">{albums[currentAlbum].artist}</p>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setCurrentAlbum((currentAlbum - 1 + albums.length) % albums.length)}
          className="w-10 h-10 bg-retro-gray border-2 border-retro-black hover:bg-retro-gray-light text-retro-white flex items-center justify-center text-xs font-bold"
        >
          ⏮
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 bg-retro-gray border-2 border-retro-black hover:bg-retro-gray-light text-retro-white flex items-center justify-center text-xs font-bold"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          onClick={() => setCurrentAlbum((currentAlbum + 1) % albums.length)}
          className="w-10 h-10 bg-retro-gray border-2 border-retro-black hover:bg-retro-gray-light text-retro-white flex items-center justify-center text-xs font-bold"
        >
          ⏭
        </button>
      </div>
    </div>
  );
}
