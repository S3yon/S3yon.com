'use client';

export default function SpotifySetup() {
  const clientId = '449fcc54be8b41d194a25e2904862e55';
  const redirectUri = 'http://127.0.0.1:3000/callback';
  const scopes = 'user-read-currently-playing user-read-recently-played';

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;

  return (
    <div className="min-h-screen bg-retro-white retro-scanlines p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-retro-gray-dark border-4 border-retro-black rounded-lg p-8">
          <div className="bg-retro-black rounded border-2 border-retro-gray p-6">
            <h1 className="text-xl font-pixel text-retro-white mb-6 border-b-2 border-retro-gray pb-4">
              SPOTIFY SETUP
            </h1>

            <div className="space-y-6">
              <div className="bg-retro-gray-dark p-4 rounded border border-retro-gray">
                <p className="text-xs font-pixel text-retro-white mb-4">
                  STEP 1: Add Redirect URI
                </p>
                <p className="text-[10px] font-pixel text-retro-gray-light mb-2">
                  In your Spotify app settings, add this redirect URI:
                </p>
                <div className="bg-retro-black p-3 rounded border border-retro-gray">
                  <code className="text-[10px] font-mono text-retro-white">
                    {redirectUri}
                  </code>
                </div>
              </div>

              <div className="bg-retro-gray-dark p-4 rounded border border-retro-gray">
                <p className="text-xs font-pixel text-retro-white mb-4">
                  STEP 2: Authorize Your App
                </p>
                <p className="text-[10px] font-pixel text-retro-gray-light mb-3">
                  Click the button below to authorize Spotify:
                </p>
                <a
                  href={authUrl}
                  className="block w-full bg-retro-white border-4 border-retro-black rounded p-4 text-center font-pixel text-xs text-retro-black hover:bg-retro-gray-light transition-colors"
                >
                  AUTHORIZE SPOTIFY
                </a>
              </div>

              <div className="bg-retro-gray-dark p-4 rounded border border-retro-gray">
                <p className="text-xs font-pixel text-retro-white mb-3">
                  Configuration Details:
                </p>
                <div className="space-y-2 text-[10px] font-pixel text-retro-gray-light">
                  <div>
                    <span className="text-retro-white">Client ID:</span> {clientId}
                  </div>
                  <div>
                    <span className="text-retro-white">Redirect URI:</span> {redirectUri}
                  </div>
                  <div>
                    <span className="text-retro-white">Scopes:</span> {scopes}
                  </div>
                </div>
              </div>
            </div>

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
