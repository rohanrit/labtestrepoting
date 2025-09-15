// Without a defined matcher, this one line applies next-auth to the entire project
// export {default} from "next-auth/middleware";
// export { withAuth, NextRequestWithAuth} from "next-auth/middleware";
export { withAuth } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";

export default withAuth(
    function middleware(request: NextRequest) {
        console.log(request.nextUrl.pathname)
        console.log(request.nextauth.token)
    },
    {
        callbacks: {
            authorized: ({ token }) => token?.role === "admin"
        },
    }
)
// Applies next-auth only to matching routes -  can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = { matcher: ["/client", "/extra", "/dashboard"] }