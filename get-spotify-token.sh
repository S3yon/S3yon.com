#!/bin/bash

echo "============================================"
echo "Spotify Refresh Token Generator"
echo "============================================"
echo ""

# Get Client ID
echo "Enter your Spotify Client ID:"
read CLIENT_ID

# Get Client Secret
echo "Enter your Spotify Client Secret:"
read -s CLIENT_SECRET
echo ""

# Get Authorization Code
echo ""
echo "1. Go to: http://127.0.0.1:3000/spotify-setup"
echo "2. Click 'AUTHORIZE SPOTIFY'"
echo "3. Copy the authorization code from the callback page"
echo ""
echo "Enter the Authorization Code:"
read AUTH_CODE

echo ""
echo "Requesting refresh token..."
echo ""

# Make the request
RESPONSE=$(curl -s -X POST https://accounts.spotify.com/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=$CLIENT_ID" \
  -d "client_secret=$CLIENT_SECRET" \
  -d "grant_type=authorization_code" \
  -d "code=$AUTH_CODE" \
  -d "redirect_uri=http://127.0.0.1:3000/callback")

# Check if we got an error
if echo "$RESPONSE" | grep -q "error"; then
  echo "❌ Error:"
  echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
  echo ""
  echo "Common issues:"
  echo "- Authorization code expired (get a new one)"
  echo "- Code was already used (get a new one)"
  echo "- Wrong Client ID or Secret"
  echo "- Code wasn't copied completely"
  exit 1
fi

# Extract refresh token
REFRESH_TOKEN=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('refresh_token', ''))" 2>/dev/null)

if [ -z "$REFRESH_TOKEN" ]; then
  echo "❌ Could not extract refresh token from response:"
  echo "$RESPONSE"
  exit 1
fi

echo "✅ Success! Here are your credentials:"
echo ""
echo "SPOTIFY_CLIENT_ID=$CLIENT_ID"
echo "SPOTIFY_CLIENT_SECRET=$CLIENT_SECRET"
echo "SPOTIFY_REFRESH_TOKEN=$REFRESH_TOKEN"
echo ""
echo "Add these to your .env.local file!"
