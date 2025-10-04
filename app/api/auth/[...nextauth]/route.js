import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Add your authentication logic here
        // This is a mock example:
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
});

export { handler as GET, handler as POST };
