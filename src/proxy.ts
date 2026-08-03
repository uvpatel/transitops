import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request) || request.cookies.get("better-auth.session_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");
  const isDashboardPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/fleet") ||
    pathname.startsWith("/drivers") ||
    pathname.startsWith("/dispatch") ||
    pathname.startsWith("/trips") ||
    pathname.startsWith("/maintenance") ||
    pathname.startsWith("/fuel") ||
    pathname.startsWith("/expenses") ||
    pathname.startsWith("/compliance") ||
    pathname.startsWith("/users") ||
    pathname.startsWith("/organizations") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/audit") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/profile");

  // Redirect logged-in users away from auth pages
  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect guest users away from protected pages
  if (isDashboardPage && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analytics/:path*",
    "/fleet/:path*",
    "/drivers/:path*",
    "/dispatch/:path*",
    "/trips/:path*",
    "/maintenance/:path*",
    "/fuel/:path*",
    "/expenses/:path*",
    "/compliance/:path*",
    "/users/:path*",
    "/organizations/:path*",
    "/notifications/:path*",
    "/audit/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/login",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/auth-error",
  ],
};