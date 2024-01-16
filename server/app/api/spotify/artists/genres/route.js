import { NextResponse } from 'next/server';

const SPOTIFY_ARTISTS_URL = "https://api.spotify.com/v1/artists";

export const GET = async (req) => {
  const url = new URL(req.url);
  const artists = url.searchParams.get("artists");
  const access_token = url.searchParams.get("access_token"); // WARNING: Remove this line, bc the access token has to be saved in the database and not in the url

  if (!artists) {
    return NextResponse.json({ error: "No artists provided" }, { status: 400 });
  }
  const result = await fetch(SPOTIFY_ARTISTS_URL + `?ids=${artists}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    }
  }).then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      console.log(access_token);
      console.log("Error status: " + response.status);
      console.log("Error text: " + response.statusText);
      throw new Error("Unable to get artists genres");
    }
  })
  .catch(error => {
    console.error(error);
  })
  console.log(JSON.stringify(result, null, 2));
  return NextResponse.json({ status: 200, result: result });
}
