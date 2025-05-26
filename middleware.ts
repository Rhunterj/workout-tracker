import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Skip middleware for auth-related paths
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Debug logs
  console.log("Middleware - Path:", request.nextUrl.pathname);
  console.log("Middleware - Token exists:", !!token);
  if (token) {
    console.log("Middleware - Token payload:", JSON.stringify(token, null, 2));
  }

  const isAuthenticated = !!token;

  // Check if the request is for an authenticated route
  const isAuthenticatedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/calendar") ||
    request.nextUrl.pathname.startsWith("/progress") ||
    request.nextUrl.pathname.startsWith("/settings") ||
    request.nextUrl.pathname.startsWith("/workout");

  // Debug logs
  console.log("Middleware - Is authenticated route:", isAuthenticatedRoute);
  console.log("Middleware - Is authenticated:", isAuthenticated);

  // If trying to access authenticated route without being logged in
  if (isAuthenticatedRoute && !isAuthenticated) {
    console.log("Middleware - Redirecting to home (not authenticated)");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If logged in and trying to access unauthenticated routes
  if (isAuthenticated && request.nextUrl.pathname === "/") {
    console.log("Middleware - Redirecting to dashboard (authenticated)");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

