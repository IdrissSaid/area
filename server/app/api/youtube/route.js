import { withApiAuthRequired, getSession, getAccessToken } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient()

export const GET = withApiAuthRequired(async function myApiRoute(req) {
  const res = new NextResponse();

  const { user } = await getSession(req, res);

  const auth0Response = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
      audience: process.env.audience,
      grant_type: 'client_credentials',
    })
  });

  if (!auth0Response.ok) {
    console.error('Auth0 token request failed:', auth0Response.statusText);
    return NextResponse.error('Failed to fetch Auth0 token', 500);
  }

  const auth0Data = await auth0Response.json();

  const getRealToken = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${user.sub}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${auth0Data.access_token}`
      }
    }
  )
  if (!getRealToken.ok) {
    console.error('Failed to fetch real user token:', getRealToken.statusText);
    return NextResponse.error('Failed to fetch real user token', 500);
  }
  const realTokenData = await getRealToken.json();
  const youtubeApiResponse = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&myRating=like&key=${process.env.api_key}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${realTokenData?.identities[0]?.access_token}`,
    },
  });
  if (!youtubeApiResponse.ok) {
    console.error('YouTube API request failed:', youtubeApiResponse.statusText);
    return NextResponse.error('Failed to fetch data from YouTube API', 500);
  }

  const youtubeApiData = await youtubeApiResponse.json();
  // console.log(youtubeApiData)
  // console.log("id = ", youtubeApiData.items[0].id)
  let alreadyExist = false
  prisma.$connect()
  try {
    const response = await prisma.likedVideos.create({
      data:{
        name: youtubeApiData.items[0].id
      }
    })
  } catch {
    alreadyExist = true
  }

  if (!alreadyExist){
    const gmailResponse = await fetch(`${process.env.AUTH0_BASE_URL}/api/gmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: user.email,
        subject: "Tu as un nouveau like",
        text: 'Tu as liké Title',
      })
    });
    console.log("New one", gmailResponse)
  }
  prisma.$disconnect()
  return NextResponse.json({ protected: "accessToken", id: user.sub }, res);
});
