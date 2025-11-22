# Spotify Integration Setup

This guide will help you connect your Spotify account to display what you're currently playing on your portfolio.

## Important Note

Spotify requires using explicit loopback addresses (like 127.0.0.1) instead of "localhost" for HTTP redirect URIs.

## Step 1: Create a Spotify Application

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create app"
4. Fill in the details:
   - **App name**: Portfolio Now Playing (or any name you prefer)
   - **App description**: Displays currently playing music on my portfolio
   - **Redirect URI**: `http://127.0.0.1:3000/callback`
   - **Website**: Your portfolio URL (optional)
   - Check the box to agree to Terms of Service
5. Click "Save"

## Step 2: Get Your Client ID and Client Secret

1. After creating the app, you'll see your **Client ID** on the app dashboard
2. Click "Settings" to view your **Client Secret**
3. Keep these values - you'll need them later

## Step 3: Get Your Refresh Token

1. Make sure your dev server is running on port 3000:
   ```bash
   npm run dev -- -p 3000
   ```

2. Go to the setup page in your browser:
   ```
   http://127.0.0.1:3000/spotify-setup
   ```

3. Click the "AUTHORIZE SPOTIFY" button

4. Click "Agree" to authorize

5. You'll be redirected to the callback page which will display your authorization code

6. Copy the authorization code and run this command (replace the placeholders):

```bash
curl -X POST https://accounts.spotify.com/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "grant_type=authorization_code" \
  -d "code=YOUR_AUTHORIZATION_CODE" \
  -d "redirect_uri=http://127.0.0.1:3000/callback"
```

7. The response will be JSON containing a `refresh_token` - copy this value

## Step 4: Add Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add your Spotify credentials:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REFRESH_TOKEN=your_refresh_token_here
```

3. Save the file

## Step 5: Restart Your Development Server

1. Stop your development server (Ctrl+C)
2. Start it again: `npm run dev`
3. Your Spotify now playing widget should now work!

## Troubleshooting

### Not showing currently playing music
- Make sure you're actively playing music on Spotify
- Check that all three environment variables are set correctly
- The widget refreshes every 5 seconds, so wait a moment after starting playback

### "isPlaying: false" always shows
- Verify your refresh token is correct
- Make sure the authorization scopes include `user-read-currently-playing`
- Try generating a new refresh token

### Authentication errors
- Check that your Client ID and Client Secret match your Spotify app
- Ensure there are no extra spaces in your `.env.local` file
- Restart your development server after making changes

## How It Works

The integration:
1. Uses your refresh token to get a temporary access token
2. Calls Spotify's API every 5 seconds to check what you're currently playing
3. Displays the album art, song title, and artist name
4. Shows an animated visualizer when music is playing
5. Shows "Not Playing" when nothing is active

The refresh token never expires, so once set up, it will continue working indefinitely.
