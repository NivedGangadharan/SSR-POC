import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protect selected routes by requiring the demo_auth cookie
export function middleware(req: NextRequest) {
    const { nextUrl, cookies } = req;
    const { pathname, search } = nextUrl;

    const isProtected = pathname.startsWith("/cart");
    if (!isProtected) return NextResponse.next();

    const isSignedIn = Boolean(cookies.get("demo_auth")?.value);
    if (isSignedIn) return NextResponse.next();

    const signInUrl = new URL("/sign-in", req.url);
    const returnUrl = pathname + (search || "");
    signInUrl.searchParams.set("returnUrl", returnUrl);
    return NextResponse.redirect(signInUrl);
}

// Only run middleware on the protected routes
export const config = {
    matcher: [
        "/cart",
        "/cart/:path*",
    ],
};
