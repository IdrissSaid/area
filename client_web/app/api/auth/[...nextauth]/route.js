import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import SpotifyProvider from "next-auth/providers/spotify"
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from 'next/headers'
import bcrypt from 'bcrypt';
import Github from "next-auth/providers/github";
import Reddit from "next-auth/providers/reddit";

const saltRounds = 10;

const authOptions = ({
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {},
            async authorize(credentials) {
                const { email, password } = credentials;
                if (!email || !password) {
                    return null;
                }
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                const response = await fetch(process.env.SESSION_UPDATE_URI, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({user: {provider: "own", email: email, password: hashedPassword}}),
                });
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                cookies().set({name: 'session', value: data.id_session, path: '/'})
                const user = {email: email};
                if (user) {
                    return user;
                } else {
                    return null;
                }
            },
        }),
        GoogleProvider({
            name: "google",
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            authorization: {
                params: {
                    access_type: "offline",
                    response_type: "code",
                    scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/gmail.readonly",
                }
            },
            async profile(profile) {
                return {
                    ...profile,
                    provider: "gmail",
                    id: profile.sub.toString(),
                };
            },
        }),
        SpotifyProvider({
            name: "spotify",
            clientId: process.env.SPOTIFY_ID,
            clientSecret: process.env.SPOTIFY_SECRET,
            async profile(profile) {
                return {
                    ...profile,
                    provider: "spotify",
                    name: profile.id.toString(),
                    photo: profile.images[0],
                };
            },
        }),
        Github({
            name: "github",
            clientId:process.env.GITHUB_ID,
            clientSecret:process.env.GITHUB_SECRET,
            async profile(profile) {
                console.log("profile Github ", profile);
                return {
                    ...profile,
                }
            },
        }),
        Reddit({
            name: "reddit",
            clientId:process.env.REDDIT_ID,
            clientSecret:process.env.REDDIT_SECRET,
            async profile(profile) {
                console.log("profile Reddit ", profile);
                return {
                    ...profile,
                }
            },
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({user, account, profile}) {
            if (user.provider === "own")
                return true
            const session = cookies().get('session')?.value || user.session
            console.log("la session ", session)
            const response = await fetch(process.env.SESSION_UPDATE_URI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({user, account, session}),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            console.log("la data ", data)
            if (data.id_session)
                cookies().set({name: 'session', value: data.id_session, path: '/'})
            user.session = data.id_session
            return true
        },
        async jwt({ token, account }) {
            // console.log("Token authorization ", token)
            if (account) {
                token.accessTokens = token.accessTokens || [];

                if (account.access_token) {
                    token.accessTokens.push({provider: account.provider, token: account.access_token});
                }
            }
            // console.log("Token authorization2 ", token)
            return token;
        },
        async session({ session, token }) {
            // console.log(session)
            return {
                ...session,
                accessTokens: token.accessTokens,
            }
        },
        async redirect({ url, baseUrl, user, account }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`
            else if (new URL(url).origin === baseUrl) return url
            return url
        }
    }
})

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };