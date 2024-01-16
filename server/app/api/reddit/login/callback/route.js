import { NextResponse } from 'next/server';

const REDDIT_ACCESS_TOKEN_URL = 'https://www.reddit.com/api/v1/access_token';

export const GET = async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const result = await fetch(REDDIT_ACCESS_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${process.env.REDDIT_REDIRECT_URI}`,
  })
  .then((res) => res.json());

  console.log(result);
  return NextResponse.json({
    body: result,
  });
}
