// One-time helper: exchanges a Spotify auth code for a refresh token.
// Used only by /callback during setup — not part of the live site.

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { code, redirectUri } = await request.json();

    if (!code || !redirectUri) {
      return Response.json({ error: 'Missing code or redirectUri' }, { status: 400 });
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return Response.json(
        { error: 'SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET missing from .env.local' },
        { status: 500 }
      );
    }

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return Response.json({ error: data.error_description || data.error }, { status: res.status });
    }

    return Response.json({ refresh_token: data.refresh_token });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Token exchange failed' },
      { status: 500 }
    );
  }
}
