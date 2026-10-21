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

// A Spotify Embed mounted into `host`. Visitors who aren't logged into Spotify hear 30s previews;
// logged-in Premium users hear the full track.
// Browsers only let the embed start sound when its play command arrives during the visitor's
// click. Loading the embed takes 1.5-3s, so a play sent once it's ready comes too late (Safari
// then waits for a second click on Spotify's own button). warm(uri) loads the embed before
// anyone clicks; play(uri) then sends loadUri + play inside the click.
export function useSpotifyEmbed({ height = 80, onEnded }: { height?: number; onEnded?: () => void } = {}) {
  const host = useRef<HTMLDivElement>(null);
  const ctrl = useRef<any>(null);
  const ready = useRef(false); // the embed takes commands
  const loaded = useRef<string | null>(null); // the uri the embed holds
  const want = useRef<string | null>(null); // the uri the visitor last clicked
  const making = useRef(false);
  const ended = useRef(onEnded);
  ended.current = onEnded;
  const [state, setState] = useState<EmbedState>({ uri: null, loading: false, paused: true, position: 0, duration: 0 });

  const make = useCallback(
    async (uri: string) => {
      if (making.current) return;
      making.current = true;
      const api = await loadIframeApi();
      if (!host.current) return void (making.current = false);
      const el = document.createElement('div');
      host.current.replaceChildren(el);
      loaded.current = uri;
      api.createController(el, { uri, width: '100%', height }, (c: any) => {
        ctrl.current = c;
        // Spotify's iframe is lazy, and a lazy iframe in the hidden player slot never loads
        const frame = host.current?.querySelector('iframe');
        if (frame) frame.loading = 'eager';
        // 'ready' fires on the first load and after every loadUri
        c.addListener('ready', () => {
          ready.current = true;
          const w = want.current;
          if (!w) return;
          // clicked before the embed was ready: load the clicked track, play once it's in
          if (w !== loaded.current) {
            loaded.current = w;
            return c.loadUri(w);
          }
          setState((s) => ({ ...s, loading: false }));
          c.play();
        });
        c.addListener('playback_update', (e: any) => {
          const { isPaused, position, duration } = e.data;
          // a playback update means the (new) track is loaded, including after loadUri
          setState((s) => ({ ...s, paused: isPaused, position, duration, loading: s.loading && duration === 0 }));
          if (!isPaused && duration > 0 && position >= duration - 400) ended.current?.();
        });
      });
    },
    [height]
  );

  const warm = useCallback((uri: string) => void (ctrl.current || make(uri)), [make]);

  const failsafe = useRef<number | undefined>(undefined);
  const play = useCallback(
    (uri: string) => {
      want.current = uri;
      setState((s) => ({ ...s, uri, loading: loaded.current !== uri || !ready.current }));
      // never leave a loader up if the embed is slow to report back
      window.clearTimeout(failsafe.current);
      failsafe.current = window.setTimeout(() => setState((s) => ({ ...s, loading: false })), 5000);
      const c = ctrl.current;
      if (!c) return void make(uri);
      if (!ready.current) return; // 'ready' plays it
      // still inside the click: both commands reach the embed while the browser allows sound
      if (loaded.current !== uri) {
        loaded.current = uri;
        c.loadUri(uri);
      }
      c.play();
    },
    [make]
  );

  const toggle = useCallback(() => ctrl.current?.togglePlay(), []);
  const stop = useCallback(() => {
    ctrl.current?.pause();
  }, []);

  useEffect(() => () => ctrl.current?.destroy?.(), []);

  return { host, state, play, warm, toggle, stop };
}
