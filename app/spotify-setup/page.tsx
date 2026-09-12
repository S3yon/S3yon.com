'use client';

import { useEffect, useState } from 'react';

const CLIENT_ID = '449fcc54be8b41d194a25e2904862e55';
const SCOPES = 'user-read-currently-playing user-read-recently-played';

export default function SpotifySetup() {
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const redirectUri = origin ? `${origin}/callback` : '';
  const authUrl = redirectUri
    ? `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=${encodeURIComponent(SCOPES)}`
    : '';

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-heading text-3xl font-extrabold tracking-[-0.02em]">Spotify setup</h1>
      <p className="mt-3 text-[15px] text-muted">
        One-time flow to generate a new <code className="text-ink">SPOTIFY_REFRESH_TOKEN</code>.
      </p>

      <ol className="mt-10 space-y-8">
        <li>
          <h2 className="font-heading text-[13px] font-bold uppercase tracking-[0.16em] text-accent">
            1 · Register this redirect URI
          </h2>
          <p className="mt-2 text-[15px] text-muted">
            In the Spotify developer dashboard → your app → Settings → Redirect URIs, add this
            exactly (no trailing slash), then Save:
          </p>
          <pre className="mt-3 overflow-x-auto border border-rule bg-ink/[0.04] p-3 text-[13px]">
            {redirectUri || 'loading…'}
          </pre>
          <p className="mt-2 text-[13px] text-faint">
            Spotify rejects <code>localhost</code> — open this page at{' '}
            <code className="text-muted">http://127.0.0.1:3000/spotify-setup</code> instead.
          </p>
        </li>

        <li>
          <h2 className="font-heading text-[13px] font-bold uppercase tracking-[0.16em] text-accent">
            2 · Authorize
          </h2>
          <p className="mt-2 text-[15px] text-muted">
            Only works once the URI above is saved in the dashboard.
          </p>
          {authUrl && (
            <a
              href={authUrl}
              className="mt-4 inline-block bg-ink px-5 py-3 font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-paper transition-colors hover:bg-accent"
            >
              Authorize Spotify
            </a>
          )}
        </li>

        <li>
          <h2 className="font-heading text-[13px] font-bold uppercase tracking-[0.16em] text-accent">
            3 · Save the token
          </h2>
          <p className="mt-2 text-[15px] text-muted">
            The callback page shows a refresh token. Paste it into{' '}
            <code className="text-ink">.env.local</code> as{' '}
            <code className="text-ink">SPOTIFY_REFRESH_TOKEN</code>, restart the dev server, and
            add it to Vercel&apos;s environment variables before redeploying.
          </p>
        </li>
      </ol>
    </main>
  );
}
