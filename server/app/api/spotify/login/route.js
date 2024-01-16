import { NextResponse } from 'next/server';
import { CLIENT_ID, ACCOUNT_URL, REDIRECT_URI, AUTH_ISSUER_BASE_URL } from '../secret';
import { generateRandomString } from "../utils";

const authorizeURL = `${ACCOUNT_URL}/authorize`;

/**
 * The GET method of the route /api/spotify redirects the user to the Spotify login page
 *
 * @async
 * @param {Request} req The incoming request
 * @returns {Response} The response to the request with the redirect to the Spotify login page
 */
export const GET = async (req) => {
  try {
    var state = generateRandomString(16);
    var scopes = ['user-read-private', 'user-read-email', 'user-top-read', 'user-library-read', 'user-read-currently-playing', 'playlist-modify-public', 'playlist-modify-private'];
    var params = "";

    console.log("The current state is: ", state);
    params += "?response_type=code";
    params += "&client_id=" + encodeURIComponent(CLIENT_ID);
    params += "&scope=" + encodeURIComponent(scopes.join(' '));
    params += "&redirect_uri=" + encodeURIComponent(`${REDIRECT_URI}`);
    params += "&state=" + encodeURIComponent(state);
    params += "&show_dialog=false";

    return NextResponse.redirect(authorizeURL + params);
  } catch (error) {
    console.error("Error, can not fetch the given url:", error);
    return NextResponse.error(error);
  }
}
