import { NextResponse } from 'next/server';
import { generateRandomString } from '../utils';

const REDDIT_AUTH_URL = 'https://www.reddit.com/api/v1/authorize';

export const GET = async () => {
  const scopes = ['identity', 'account', 'submit'];
  const params = new URLSearchParams({
    client_id: process.env.REDDIT_CLIENT_ID,
    response_type: 'code',
    state: generateRandomString(10),
    redirect_uri: `${process.env.REDDIT_REDIRECT_URI}`,
    duration: 'permanent',
    scope: scopes.join(' '),
  });
  const result = await fetch(`${REDDIT_AUTH_URL}?${params.toString()}`);

  return NextResponse.redirect(result.url);
}
