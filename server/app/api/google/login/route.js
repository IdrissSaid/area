import { headers } from 'next/headers'
import { google } from 'googleapis'
import { NextResponse } from 'next/server'

export async function GET(req, res)
{
    const headersList = headers()
    const token = headersList.get('token')
    const callbackUrl = headersList.get('callbackUrl')
    const authClient = new google.auth.OAuth2(
        process.env.GOOGLE_ID,
        process.env.GOOGLE_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    const scopes = [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ];

    const authUrl = authClient.generateAuthUrl({
        access_type: 'offline',
        response_type: 'code',
        scope: scopes,
    });
    // console.log(authUrl);
    return NextResponse.redirect(authUrl)
}