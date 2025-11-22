'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SpotifyCallback() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authCode = searchParams.get('code');
    const authError = searchParams.get('error');

    if (authCode) {
      setCode(authCode);
    }
    if (authError) {
      setError(authError);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-retro-white retro-scanlines p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-retro-gray-dark border-4 border-retro-black rounded-lg p-8">
          <div className="bg-retro-black rounded border-2 border-retro-gray p-6">
            <h1 className="text-xl font-pixel text-retro-white mb-6 border-b-2 border-retro-gray pb-4">
              SPOTIFY AUTHORIZATION
            </h1>

            {code && (
              <div className="space-y-4">
                <p className="text-xs font-pixel text-retro-white mb-4">
                  Success! Copy this authorization code:
                </p>

                <div className="bg-retro-gray-dark p-4 rounded border border-retro-gray">
                  <code className="text-[10px] font-mono text-retro-white break-all">
                    {code}
                  </code>
                </div>

                <div className="mt-6 p-4 bg-retro-gray-dark rounded border border-retro-gray">
                  <p className="text-[10px] font-pixel text-retro-white mb-3">
                    NEXT STEPS:
                  </p>
                  <ol className="text-[10px] font-pixel text-retro-gray-light space-y-2 list-decimal list-inside">
                    <li>Copy the code above</li>
                    <li>Follow step 6 in SPOTIFY_SETUP.md</li>
                    <li>Use this code to get your refresh token</li>
                  </ol>
                </div>
              </div>
            )}

            {error && (
              <div className="space-y-4">
                <p className="text-xs font-pixel text-retro-white mb-4">
                  Authorization failed with error:
                </p>

                <div className="bg-retro-gray-dark p-4 rounded border border-retro-gray">
                  <code className="text-[10px] font-mono text-retro-white">
                    {error}
                  </code>
                </div>
              </div>
            )}

            {!code && !error && (
              <div className="text-center">
                <p className="text-xs font-pixel text-retro-gray-light">
                  Waiting for authorization...
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t-2 border-retro-gray">
              <a
                href="/"
                className="text-[10px] font-pixel text-retro-white hover:text-retro-gray-light transition-colors"
              >
                ← BACK TO HOME
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
