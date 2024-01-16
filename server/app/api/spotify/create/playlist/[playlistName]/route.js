import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

/**
 * The method GET for the /api/spotify/create/playlist/[playlistName] route must create a new Spotify Playlist.
 *
 * @async
 * @param {req} req - The name of the new Spotify Playlist
 * @param {res} res - Res
 * @returns {Response} response - returns a json with the status of the request
 */
export const GET = async (req, res) => {
  const url = new URL(req.url);
  const access_token = url.searchParams.get('access_token');
  const newPlaylistName = url.pathname.split('/').slice(-1)[0];
  console.log("[*] Creating new playlist: " + newPlaylistName);

  const userId = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
  .then((response) => response.json())
  .then((data) => data.id)


  const newPlaylist = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({name: newPlaylistName, description: "Created by Spotify Playlist Creator"}),
    json: true,
  })

  return NextResponse.json({ newPlaylistName: newPlaylistName, status: newPlaylist.status });
}
