import { NextResponse } from 'next/server'

export default async function middleware(request)
{
    const url = request.nextUrl.clone()
    if (request.nextUrl.pathname.startsWith("/_next")) return NextResponse.next();
    const token = request.cookies.get("session");
    if (request.nextUrl.pathname.startsWith("/dashboard") && !token?.value) {
        url.pathname = "/login"
        return NextResponse.redirect(url);
    } else if ((request.nextUrl.pathname == "/login" || request.nextUrl.pathname == "/signUp") && token) {
        url.pathname = "/dashboard"
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}