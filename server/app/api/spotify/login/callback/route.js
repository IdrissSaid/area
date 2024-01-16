import { NextResponse, NextRequest } from "next/server";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "../../secret";
import { getUserTopItems } from "../../user/top/items/route";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const CONTENT_TYPE = "application/x-www-form-urlencoded";

const getAccessToken = async (auth_code) => {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": CONTENT_TYPE,
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: auth_code,
      redirect_uri: REDIRECT_URI,
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

export const POST = async (request) => {
  const url = new URL(request.url);
  const access_token = url.searchParams.get("access_token");
  const refresh_token = url.searchParams.get("refresh_token");

  console.log("access_token ", access_token);
  console.log("refresh_token ", refresh_token);
}

export const GET = async (request) => {

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const res = await getAccessToken(code);

  const result = {
    "access_token": `${res.access_token}`,
    "refresh_token": `${res.refresh_token}`,
  };

  console.log(JSON.stringify(result, null, 2));
  return NextResponse.json(result);
}
