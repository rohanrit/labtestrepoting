import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import connectDB from "@/lib/db"
import User from "@/models/User"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        await connectDB()
        const user = await User.findOne({ email: credentials.email })
        
        if (!user) return null
        
        const isValid = await compare(credentials.password, user.password)
        
        if (!isValid) return null
        
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  pages: {
    signIn: '/signin',
  }
})
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/signin',
  }
} satisfies NextAuthConfig

export const { auth, signIn, signOut } = NextAuth(config)
