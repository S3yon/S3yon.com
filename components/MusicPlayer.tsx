'use client';

import { useState } from 'react';

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const tracks = [
    { title: 'Lofi Hip Hop', artist: 'Chillhop Music', duration: '3:24' },
    { title: 'Synthwave Dreams', artist: 'RetroWave', duration: '4:12' },
    { title: 'Pixel Beats', artist: '8-Bit Universe', duration: '2:58' },
    { title: 'Code & Coffee', artist: 'Study Music', duration: '5:33' },
    { title: 'Terminal Vibes', artist: 'Dev Sounds', duration: '3:47' },
  ];

  return (
    <div className="bg-retro-gray-light border-4 border-retro-black rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3 border-b-2 border-retro-black pb-2">
        <div className="w-3 h-3 bg-retro-black rounded-full"></div>
        <h3 className="text-xs font-pixel text-retro-black">NOW PLAYING</h3>
      </div>

      {/* Cassette Tape Display */}
      <div className="bg-retro-gray-dark border-2 border-retro-black rounded p-3 mb-3">
        <div className="flex justify-between items-center mb-2">
          <div className="w-8 h-8 border-2 border-retro-white rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-retro-white rounded-full"></div>
          </div>
          <div className="flex-1 mx-2 h-1 bg-retro-white"></div>
          <div className="w-8 h-8 border-2 border-retro-white rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-retro-white rounded-full"></div>
          </div>
        </div>

        <div className="text-center text-xs font-pixel text-retro-white">
          <p className="mb-1 truncate">{tracks[currentTrack].title}</p>
          <p className="text-[10px] text-retro-gray-light">{tracks[currentTrack].artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2 mb-3">
        <button
          onClick={() => setCurrentTrack((currentTrack - 1 + tracks.length) % tracks.length)}
          className="w-8 h-8 bg-retro-black border-2 border-retro-black hover:bg-retro-gray-dark text-retro-white flex items-center justify-center text-xs"
        >
          ⏮
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-8 h-8 bg-retro-black border-2 border-retro-black hover:bg-retro-gray-dark text-retro-white flex items-center justify-center text-xs"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          onClick={() => setCurrentTrack((currentTrack + 1) % tracks.length)}
          className="w-8 h-8 bg-retro-black border-2 border-retro-black hover:bg-retro-gray-dark text-retro-white flex items-center justify-center text-xs"
        >
          ⏭
        </button>
      </div>

      {/* Visualizer Bars */}
      <div className="flex justify-center gap-1 h-12">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="w-2 bg-retro-gray transition-all duration-300"
            style={{
              height: isPlaying
                ? `${Math.random() * 100}%`
                : '10%',
              backgroundColor: isPlaying ? '#2a2a2a' : '#5a5a5a',
            }}
          ></div>
        ))}
      </div>

      {/* Track List */}
      <div className="mt-3 border-t-2 border-retro-black pt-2 max-h-32 overflow-y-auto">
        {tracks.map((track, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentTrack(idx)}
            className={`w-full text-left p-2 text-[10px] font-pixel hover:bg-retro-gray transition-colors ${
              currentTrack === idx ? 'bg-retro-gray text-retro-white' : 'text-retro-black'
            }`}
          >
            <div className="flex justify-between">
              <span className="truncate">{track.title}</span>
              <span>{track.duration}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
