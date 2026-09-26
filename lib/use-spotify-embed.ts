'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Spotify's iFrame API: one script per page, shared by every player.
let apiPromise: Promise<any> | null = null;
function loadIframeApi(): Promise<any> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const w = window as any;
    if (w.__spotifyIframeApi) return resolve(w.__spotifyIframeApi);
    const prev = w.onSpotifyIframeApiReady;
    w.onSpotifyIframeApiReady = (api: any) => {
      w.__spotifyIframeApi = api;
      prev?.(api);
      resolve(api);
    };
    const s = document.createElement('script');
    s.src = 'https://open.spotify.com/embed/iframe-api/v1';
    s.async = true;
    document.body.appendChild(s);
  });
  return apiPromise;
}

export const trackUri = (url?: string) => {
  const m = url?.match(/track\/([A-Za-z0-9]+)/);
  return m ? `spotify:track:${m[1]}` : null;
};

export interface EmbedState {
  uri: string | null;
  loading: boolean;
  paused: boolean;
  position: number;
  duration: number;
}

// A Spotify Embed mounted into `host`. play(uri) creates it on first use, then swaps tracks.
// Visitors who aren't logged into Spotify hear 30s previews; logged-in Premium users hear the
// full track. Browsers need the click that calls play() before audio can start.
export function useSpotifyEmbed({ height = 80, onEnded }: { height?: number; onEnded?: () => void } = {}) {
  const host = useRef<HTMLDivElement>(null);
  const ctrl = useRef<any>(null);
  const ended = useRef(onEnded);
  ended.current = onEnded;
  const [state, setState] = useState<EmbedState>({ uri: null, loading: false, paused: true, position: 0, duration: 0 });

  const play = useCallback(
    async (uri: string) => {
      setState((s) => ({ ...s, uri, loading: true }));
      const api = await loadIframeApi();
      if (!ctrl.current) {
        if (!host.current) return;
        const el = document.createElement('div');
        host.current.replaceChildren(el);
        api.createController(el, { uri, width: '100%', height }, (c: any) => {
          ctrl.current = c;
          c.addListener('ready', () => {
            setState((s) => ({ ...s, loading: false }));
            c.play();
          });
          c.addListener('playback_update', (e: any) => {
            const { isPaused, position, duration } = e.data;
            setState((s) => ({ ...s, paused: isPaused, position, duration }));
            if (!isPaused && duration > 0 && position >= duration - 400) ended.current?.();
          });
        });
      } else {
        ctrl.current.loadUri(uri);
      }
    },
    [height]
  );

  const toggle = useCallback(() => ctrl.current?.togglePlay(), []);
  const stop = useCallback(() => {
    ctrl.current?.pause();
  }, []);

  useEffect(() => () => ctrl.current?.destroy?.(), []);

  return { host, state, play, toggle, stop };
}
