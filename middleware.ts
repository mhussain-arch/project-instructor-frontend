import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // 1. Define routes that do NOT require authentication
  const isPublicRoute = 
    nextUrl.pathname.startsWith("/login") || 
    nextUrl.pathname.startsWith("/register") || 
    nextUrl.pathname.startsWith("/api/auth"); // Crucial: allow auth API calls

  // 2. Redirect logged-in users AWAY from login page
  if (isLoggedIn && isPublicRoute && !nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // 3. Redirect unauthenticated users TO login page
  if (!isLoggedIn && !isPublicRoute) {
    // Add ?callbackUrl to redirect them back after login
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
    matcher: [
        /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};