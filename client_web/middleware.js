import { NextResponse } from 'next/server'

export default async function middleware(request)
{
    const url = request.nextUrl.clone()
    const res = NextResponse.next()
    res.headers.append('Access-Control-Allow-Credentials', "true")
    res.headers.append('Access-Control-Allow-Origin', '*')
    res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
    res.headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (request.nextUrl.pathname.startsWith("/_next")) return res;
    const token = request.cookies.get("session");
    if (url.pathname === "/dashboard" && !token?.value) {
        url.pathname = "/login"
        return NextResponse.redirect(url);
    } else if ((url.pathname === "/login" || url.pathname === "/signUp") && token) {
        url.pathname = "/dashboard"
        return NextResponse.redirect(url);
    }
    return res;
}