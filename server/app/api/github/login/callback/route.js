import { NextResponse } from 'next/server';

export const GET = async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const token = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'next.js',
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  })
  .then((res) => res.json())

  console.log(JSON.stringify(token, null, 2));
  return NextResponse.json({access_token: token.access_token});
}
