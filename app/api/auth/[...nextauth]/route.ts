import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // Add your authentication logic here
        if (credentials.email === "user@example.com" && credentials.password === "password") {
          return { id: "1", name: "Test User", email: "user@example.com" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/signin',
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
