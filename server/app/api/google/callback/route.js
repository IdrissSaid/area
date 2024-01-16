import { google } from 'googleapis';
import { NextResponse } from 'next/server';
const { OAuth2Client } = require('google-auth-library');
import prisma from '../../../../db'

export async function GET(req, res) {
    const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_ID,
        process.env.GOOGLE_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    const url = new URL(req.url);
    const code = url?.searchParams?.get("code");
    // console.log(req)

    if (!code) {
        // console.log("no code")
        return NextResponse.redirect(process.env.FRONT, { message: "Authorization code is missing." });
    }

    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        const people = google.people({ version: 'v1', auth: oAuth2Client });
        const { data } = await people.people.get({
            resourceName: 'people/me',
            personFields: 'names,emailAddresses,photos',
        });

        const id = prisma.auth.create({
            data: {
                provider: 'google',
                profile: {
                    name: data?.names[0]?.displayName,
                    email: data?.emailAddresses[0]?.value,
                    photo: data?.photos[0]?.url,
                },
                credential: {
                    access_token: tokens?.access_token,
                    refresh_token: tokens?.refresh_token,
                    token_type: tokens?.token_type,
                    expiry_data: tokens?.expires_data,
                }
            }
        }).catch(error => {
            console.error("Error creating record in the database:", error.message);
            return NextResponse.redirect(process.env.FRONT, { error:  error.message });
        });
        console.log(id);
        return NextResponse.redirect(process.env.FRONT, { id: id });
    } catch (error) {
        console.error("Error exchanging code for tokens:", error.message);
        return NextResponse.redirect(process.env.FRONT, { message: "Failed to retrieve tokens." });
    }
}
