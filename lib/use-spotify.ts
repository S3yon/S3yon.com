'use client';

import { useEffect, useState } from 'react';

export interface SpotifyTrack {
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  playedAt?: string;
}

export interface SpotifyState extends Partial<SpotifyTrack> {
  isPlaying: boolean;
  progressMs?: number;
  durationMs?: number;
  fetchedAt?: number;
  recent: SpotifyTrack[];
}

// Polls the now-playing route every 20s. `progress` (0..1) ticks locally between polls so a
// progress bar moves smoothly while a track plays.
export function useSpotify(pollMs = 20000) {
  const [data, setData] = useState<SpotifyState | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch('/api/spotify/now-playing');
        const json = (await res.json()) as SpotifyState;
        if (alive) setData({ ...json, recent: json.recent ?? [], fetchedAt: Date.now() });
      } catch {
        if (alive) setData((d) => d ?? { isPlaying: false, recent: [] });
      }
    };
    load();
    const t = window.setInterval(load, pollMs);
    return () => {
      alive = false;
      window.clearInterval(t);
    };
  }, [pollMs]);

  useEffect(() => {
    if (!data?.durationMs) return;
    const tick = () => {
      const elapsed = data.isPlaying ? Date.now() - (data.fetchedAt ?? Date.now()) : 0;
      setProgress(Math.min(1, ((data.progressMs ?? 0) + elapsed) / data.durationMs!));
    };
    tick();
    if (!data.isPlaying) return;
    const t = window.setInterval(tick, 500);
    return () => window.clearInterval(t);
  }, [data]);

  return { data, progress };
}

export function timeAgo(iso?: string) {
  if (!iso) return '';
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.round(h / 24)}d ago`;
}
