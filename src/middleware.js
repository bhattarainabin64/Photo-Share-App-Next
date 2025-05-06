import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value; 

  const protectedRoutes = ["/dashboard", "/profile", "/settings"];

  if (!token && protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/account/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"],
};
