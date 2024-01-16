import { NextResponse } from 'next/server';

const SPOTIFY_API_CURRENTLY_PLAYING = "https://api.spotify.com/v1/me/player/currently-playing";

export const GET = async (req) => {
  const url = new URL(req.url); // WARNING: This is the URL as seen by the user, so it should not contain private data, like the access_token
  const access_token = url.searchParams.get("access_token");
  const result = await fetch(SPOTIFY_API_CURRENTLY_PLAYING, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    }
  })
  .then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      console.log(access_token);
      console.log("Error status: " + response.status);
      console.log("Error text: " + response.statusText);
      return { status: response.status, statusText: response.statusText }; 
    }
  })
  .catch(error => {
    console.error(error)
  })
  return NextResponse.json(result);
}
