import { NextResponse } from 'next/server';

export const GET = async (req) => {
  const url = new URL(req.url);
  const access_token = url.searchParams.get("access_token");

  const profile = await fetch('https://oauth.reddit.com/api/v1/me', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
  .then((res) => res.json());
  console.log(profile);

  return NextResponse.json(profile);
}
