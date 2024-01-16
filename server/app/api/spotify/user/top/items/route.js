import { NextResponse } from 'next/server';

export const GET = async (req) => {
  const url = new URL(req.url);
  const access_token = url.searchParams.get("access_token"); // WARNING: Remove this line, bc the access token has to be saved in the database and not in the url
  const result = await fetch("https://api.spotify.com/v1/me/top/artists", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    }
  }).then(response => {
    if (response.status === 200) {
      return response.json()
    } else {
      console.log(access_token);
      console.log("Error status: " + response.status);
      console.log("Error text: " + response.statusText);
      return {
        status: 401,
        statusText: response.statusText
      }
    }
  })
  .catch(error => {
    console.error(error);
  });
  console.log(JSON.stringify(result, null, 2));
  return NextResponse.json(result);
}

