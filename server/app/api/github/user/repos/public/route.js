import { NextResponse } from 'next/server';

export const GET = async (req) => {
  const url = new URL(req.url);

  const access_token = url.searchParams.get("access_token");
  const username = url.searchParams.get("username");

  const result = await fetch(`https://api.github.com/users/${username}/repos`, {
    headers: {
      "Accept": "application/vnd.github+json",
      Authorization: `Bearer ${access_token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  .then((res) => {
    if (res.status === 200) {
      return res.json();
    }
  })
  if (!result)
    return NextResponse.json({ error: "Invalid access token", status: 401 });
  console.log("Access Token: " + access_token);
  console.log(JSON.stringify(result.map((repo) => repo.full_name)));
  return NextResponse.json(result.map((repo) => repo.full_name));
}
