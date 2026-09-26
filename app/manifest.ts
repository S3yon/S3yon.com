import type { MetadataRoute } from 'next';

// Installable web app: added to a home screen it opens full screen, no browser bars.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Seyon Sri',
    short_name: 'Seyon',
    description: 'Software engineer, photographer and hackathon regular. Everything in one timeline.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    orientation: 'portrait',
    background_color: '#212225',
    theme_color: '#212225',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
