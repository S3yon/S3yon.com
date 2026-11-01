'use client';

import { useEffect, useState } from 'react';

// The album cover, loaded and decoded before the island shows it, so the art never pops in or
// blanks mid-morph; a new track's cover replaces the old one only once it is ready. `settled`
// turns true once the current URL has loaded or failed. The island's <img> asks for the same CORS
// mode, so it reuses this decoded image instead of fetching its own.
export function useCover(url?: string) {
  const [cover, setCover] = useState<{ url?: string; src?: string }>({});

  useEffect(() => {
    if (!url) return;
    let alive = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.decode().then(
      () => {
        if (alive) setCover({ url, src: url });
      },
      () => {
        if (alive) setCover({ url });
      },
    );
    return () => {
      alive = false;
    };
  }, [url]);

  return { src: cover.src, settled: !url || cover.url === url };
}
