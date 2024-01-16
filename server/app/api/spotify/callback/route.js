import { NextResponse, NextRequest } from "next/server";
import { CLIENT_ID, CLIENT_SECRET } from "../secret";

const TOKEN_URL = "https://accounts.spotify.com/api/token";


/**
 * The getUserTopItems function gets the user top items from Spotify.
 *
 * @async
 * @param {res} res - Contains the access token for the request.
 * @throws {Error} - Unable to get user top items.
 * @returns {Response} - The response with the user top items.
 */
const getUserTopItems = async (res) => {
  const result = await fetch("https://api.spotify.com/v1/me/top/artists", {
    headers: {
      Authorization: `Bearer ${res.access_token}`,
    }
  }).then(response => {
    if (response.status === 200) {
      return response.json()
    } else {
      console.log(res.access_token);
      console.log("Error status: " + response.status);
      console.log("Error text: " + response.statusText);
      throw new Error("Unable to get user top items");
    }
  })
  .catch(error => {
    console.error(error);
  });
  return result;
}

/**
 * The getCurrentPlayingTrack function gets the current playing track from Spotify.
 *
 * @async
 * @param {res} res - Contains the access token for the request.
 * @throws {Error} - Unable to get user current playing tracks.
 * @returns {Response} - The response with the current playing track.
 */
const getCurrentPlayingTrack = async (res) => {
  const result = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${res.access_token}`,
    }
  })
  .then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      console.log(res.access_token);
      console.log("Error status: " + response.status);
      console.log("Error text: " + response.statusText);
      throw new Error("Unable to get user current playing tracks");
    }
  })
  .catch(error => {
    console.error(error)
  })
  return result;
}

/**
 * The getUserProfile function gets the user profile from Spotify.
 *
 * @async
 * @param {res} res - Contains the access token for the request.
 * @throws {Error} - Unable to get user profile.
 * @returns {Response} - The response with the user profile.
 */
const getUserProfile = async (res) => {
  const userProfile = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${res.access_token}`,
    }
  }).then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      console.log(res.access_token);
      console.log("Error status: " + response.status);
      console.log("Error text: " + response.statusText);
      throw new Error("Unable to get user profile");
    }
  })
  .catch(error => {
    console.error(error);
  })
  return userProfile;
}

/**
 * The getAccessToken function gets the access token and refresh token from Spotify.
 *
 * @async
 * @param {string} auth_code - The authorization code from Spotify.
 * @throws {Error} - Unable to get token.
 * @returns {Response} - The response with the access token and refresh token.
 */
const getAccessToken = async (auth_code) => {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: auth_code,
      redirect_uri: "http://10.106.1.32:8080/api/spotify/callback",
    }),
  }).then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error("Unable to get token");
    }
  })
  .catch(error => {
    console.error(error);
  })
  return res;
}

/**
 * The POST method to the /api/spotify/callback route is used to get the access token and refresh token from Spotify.
 *
 * @async
 * @param {Request} request The incoming request data with the access code from Spotify.
 */
export const POST = async (request) => {
  const url = new URL(request.url);
  const access_token = url.searchParams.get("access_token");
  const refresh_token = url.searchParams.get("refresh_token");

  console.log("access_token ", access_token);
  console.log("refresh_token ", refresh_token);

}

/**
 * The GetArtistsGenres function gets the genres of the artists that are currently playing.
 *
 * @async
 * @param {res} res - Contains the access token for the request.
 * @param {string} artists - The artists that are currently playing.
 * @throws {Error} - Unable to get artists genres.
 * @returns {Response} - The response with the artists genres.
 */
const getArtistsGenres = async (res, artists) => {
  const result = await fetch(`https://api.spotify.com/v1/artists?ids=${artists}`, {
    headers: {
      Authorization: `Bearer ${res.access_token}`,
    }
  }).then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      console.log(res.access_token);
      console.log("Error status: " + response.status);
      console.log("Error text: " + response.statusText);
      throw new Error("Unable to get artists genres");
    }
  })
  .catch(error => {
    console.error(error);
  })
  return result;
}


/**
 * The GET method to the /api/spotify/callback route is used to get the access token and refresh token from Spotify.
 *
 * @async
 * @param {Request} request The incoming request data with the access code from Spotify.
 * @returns {Response} The reponse with the access token and refresh token.
 */
export const GET = async (request) => {

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const res = await getAccessToken(code);
  const userProfile = await getUserProfile(res);

  const userTopItems = await getUserTopItems(res);
  const topArtists = userTopItems.items.slice(0, 3);
  const topGenres = topArtists.map(artist => artist.genres).flat();

  const userCurrentPlayingTrack = await getCurrentPlayingTrack(res);
  const currentTrack = userCurrentPlayingTrack.item.name;
  const currentTrackArtist = userCurrentPlayingTrack.item.artists.map(artist => artist.name);
  const currentArtistGenres = await getArtistsGenres(res, userCurrentPlayingTrack.item.artists.map(artist => artist.id));

  if (currentArtistGenres.artists.map(artist => artist.genres).flat().some(genre => topGenres.includes(genre))) {
    console.log("You are listening to your top artist");
  } else {
    console.log("You are not listening to your top artist");
  }

  const result = {
    "access_token": `${res.access_token}`,
    "refresh_token": `${res.refresh_token}`,
    "currentTrack": {
      "name": `${currentTrack}`,
      "artists": `${currentTrackArtist}`,
      "genres": `${currentArtistGenres.artists.map(artist => artist.genres).flat()}`,
    },
    "user": `${userProfile.display_name}`,
    "topItems": {
      "topArtists": `${topArtists.map(artist => artist.name)}`,
      "topGenres": `${topGenres}`,
    },
  };

  console.log(JSON.stringify(result, null, 2));
  return NextResponse.json(result);
}
