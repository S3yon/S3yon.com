import { getNowPlaying, getRecentlyPlayed } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET() {
  const response = await getNowPlaying();

  // If nothing is currently playing, fetch the last played track
  if (response.status === 204 || response.status > 400) {
    const recentResponse = await getRecentlyPlayed();

    if (recentResponse.status === 200) {
      const recentData = await recentResponse.json();
      const lastTrack = recentData.items[0]?.track;

      if (lastTrack) {
        return Response.json({
          album: lastTrack.album.name,
          albumImageUrl: lastTrack.album.images[0].url,
          artist: lastTrack.artists.map((_artist: any) => _artist.name).join(', '),
          isPlaying: false,
          songUrl: lastTrack.external_urls.spotify,
          title: lastTrack.name,
        });
      }
    }

    return Response.json({ isPlaying: false });
  }

  const song = await response.json();

  if (song.item === null) {
    // Try to get recently played track
    const recentResponse = await getRecentlyPlayed();

    if (recentResponse.status === 200) {
      const recentData = await recentResponse.json();
      const lastTrack = recentData.items[0]?.track;

      if (lastTrack) {
        return Response.json({
          album: lastTrack.album.name,
          albumImageUrl: lastTrack.album.images[0].url,
          artist: lastTrack.artists.map((_artist: any) => _artist.name).join(', '),
          isPlaying: false,
          songUrl: lastTrack.external_urls.spotify,
          title: lastTrack.name,
        });
      }
    }

    return Response.json({ isPlaying: false });
  }

  const isPlaying = song.is_playing;
  const title = song.item.name;
  const artist = song.item.artists.map((_artist: any) => _artist.name).join(', ');
  const album = song.item.album.name;
  const albumImageUrl = song.item.album.images[0].url;
  const songUrl = song.item.external_urls.spotify;

  return Response.json({
    album,
    albumImageUrl,
    artist,
    isPlaying,
    songUrl,
    title,
  });
}
