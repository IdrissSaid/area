import { NextResponse } from 'next/server';

export const GET = async (req) => {
  const url = new URL(req.url);

  const access_token = url.searchParams.get("access_token");
  const username = url.searchParams.get("username");

  const result = await fetch(`https://api.github.com/search/repositories?q=user:${username}`, {
    headers: {
      "Accept": "application/vnd.github+json",
      Authorization: `Bearer ${access_token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  .then((res) => res.json())

  if (!result.items) {
    return NextResponse.json(result);
  }
  console.log("Access Token: " + access_token);
  console.log(JSON.stringify(result.items.map((item) => (item.full_name)), null, 2));
  return NextResponse.json(result.items.map((item) => (item.full_name)));
}
