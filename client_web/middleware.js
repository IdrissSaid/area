import { NextResponse } from 'next/server'

export default async function middleware(request)
{
    const url = request.nextUrl.clone()
    const res = NextResponse.next()
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