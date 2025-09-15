import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(request: NextRequest) {
    // Allow the homepage and NextAuth API routes to bypass this middleware
    const { pathname } = request.nextUrl;
    if (pathname === "/" || pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }
    // continue with default behavior (logging kept for debugging)
    // console.log(pathname);
    return undefined;
  },
  {
    callbacks: {
      // Only admin can access protected routes
      authorized: ({ token }) => token?.role === "admin",
    },
  }
);

export const config = {
  // Explicitly protect only these paths; do not include '/'
  matcher: ["/data", "/dashboard", "/api/records", "/api/csv", "/upload"],
};
