import type { NextAuthOptions, User as NextAuthUser, Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import type { AdapterUser } from 'next-auth/adapters'

// Extend NextAuth types to include 'role'
declare module 'next-auth' {
    interface User {
        role?: string;
    }
    interface Session {
        user?: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string;
            id?: string;
        };
    }
}
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { GithubProfile } from 'next-auth/providers/github'

export const options: NextAuthOptions = {
    providers: [
        GitHubProvider({
            profile(profile: GithubProfile){
                console.log("git_profile-", profile);
                return {
                    ...profile,
                    role: profile.role ?? "user",
                    id: profile.id.toString(),
                    image: profile.avatar_url,
                }
            },
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username:",
                    type: "text",
                    placeholder: "your-cool-username"
                },
                password: {
                    label: "Password:",
                    type: "password",
                    placeholder: "your-awesome-password"
                }
            },
            async authorize(credentials) {
                // This is where you need to retrieve user data 
                // to verify with credentials
                // Docs: https://next-auth.js.org/configuration/providers/credentials
                const user = { id: "42", name: "Dave", password: "nextauth", role: "admin" }

                if (credentials?.username === user.name && credentials?.password === user.password) {
                    return user
                } else {
                    return null
                }
            }
        })
    ],
    callbacks: {
        // Ref: https://authjs.dev/guides/role-based-access-control?_gl=1*sd45qr*_gcl_au*OTExNDE1OTc1LjE3NTc1NTk4OTYuMTk4ODExMTkzNC4xNzU3ODc2MjM0LjE3NTc4NzYyMzQ.
        async jwt({ token, user }: { token: JWT; user?: NextAuthUser | AdapterUser }) {
            if (user && 'role' in user) {
                token.role = (user as NextAuthUser & { role?: string }).role;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session?.user) {
                (session.user as typeof session.user & { role?: string }).role = token.role as string;
            }
            return session;
        },
  },
}