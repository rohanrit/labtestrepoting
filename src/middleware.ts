export { withAuth } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(request: NextRequest) {
        console.log(request.nextUrl.pathname)
        console.log(request)
    },{
  callbacks: {
    authorized: ({ token }) => token?.role === 'admin', // Only admin can access protected routes
  },
});

export const config = {
  matcher: ["/data", "/api/records", "/api/csv"], // Protect these routes
};
