import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("access_token");

    const url = req.nextUrl.clone();
    if (!token && url.pathname.startsWith("/admin")) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    if (token && url.pathname === "/login") {
        url.pathname = "/admin/dashboard";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/login"], // protect all dashboard routes
};