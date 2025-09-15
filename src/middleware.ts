import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => token?.role === 'admin', // Only admin can access protected routes
  },
});

export const config = {
  matcher: ["/data", "/api/records", "/api/csv"], // Protect these routes
};
