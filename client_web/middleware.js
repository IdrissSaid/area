import { NextResponse } from 'next/server'

export default async function middleware(request)
{
    if (request.nextUrl.pathname.startsWith("/_next")) return NextResponse.next();
    const token = request.cookies.get("session");
    if (request.nextUrl.pathname.startsWith("/dashboard") && !token?.value) {
        return NextResponse.redirect("http://localhost:8081/login");
    } else if ((request.nextUrl.pathname == "/login" || request.nextUrl.pathname == "/signUp") && token) {
        return NextResponse.redirect("http://localhost:8081/dashboard");
    }
    return NextResponse.next();
}