'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function CallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'working' | 'done' | 'error'>('working');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('Exchanging your authorization code…');

  useEffect(() => {
    const code = searchParams.get('code');
    const authError = searchParams.get('error');

    if (authError) {
      setStatus('error');
      setMessage(`Spotify returned: ${authError}`);
      return;
    }
    if (!code) {
      setStatus('error');
      setMessage('No authorization code in the URL. Start again from /spotify-setup.');
      return;
    }

    fetch('/api/spotify/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirectUri: `${window.location.origin}/callback` }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.refresh_token) {
          setToken(data.refresh_token);
          setStatus('done');
        } else {
          setStatus('error');
          setMessage(data.error || 'No refresh token returned.');
        }
      })
      .catch((e) => {
        setStatus('error');
        setMessage(e instanceof Error ? e.message : 'Request failed.');
      });
  }, [searchParams]);

  if (status === 'working') {
    return <p className="text-[15px] text-muted">{message}</p>;
  }

  if (status === 'error') {
    return (
      <>
        <p className="text-[15px] text-accent">{message}</p>
        <p className="mt-4 text-[14px] text-faint">
          An <code>invalid_grant</code> usually means the code was already used — each one works
          once. Go back to <code className="text-muted">/spotify-setup</code> and authorize again.
        </p>
      </>
    );
  }

  return (
    <>
      <p className="text-[15px] text-muted">
        Done. Paste this into <code className="text-ink">.env.local</code> as{' '}
        <code className="text-ink">SPOTIFY_REFRESH_TOKEN</code>, then restart the dev server.
      </p>
      <pre className="mt-4 overflow-x-auto border border-rule bg-ink/[0.04] p-3 text-[12px] leading-relaxed">
        {token}
      </pre>
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(token)}
        className="mt-4 bg-ink px-5 py-3 font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-paper transition-colors hover:bg-accent"
      >
        Copy token
      </button>
      <p className="mt-6 text-[14px] text-faint">
        Also add it to Vercel → Project → Settings → Environment Variables, then redeploy, or the
        live site stays broken.
      </p>
    </>
  );
}

export default function SpotifyCallback() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-heading text-3xl font-extrabold tracking-[-0.02em]">Spotify callback</h1>
      <div className="mt-6">
        <Suspense fallback={<p className="text-[15px] text-muted">Loading…</p>}>
          <CallbackContent />
        </Suspense>
      </div>
    </main>
  );
}
