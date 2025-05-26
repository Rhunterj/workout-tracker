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

  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

