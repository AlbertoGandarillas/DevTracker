import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "./prisma"

// Type guard to ensure session has user
export function hasValidSession(session: unknown): session is { user: { id: string; role: string; name?: string | null; email?: string | null } } {
  return session !== null && 
         typeof session === 'object' && 
         session !== null && 
         'user' in session && 
         session.user !== null && 
         typeof session.user === 'object' && 
         'id' in session.user && 
         'role' in session.user;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  debug: true, // Enable debug mode
  callbacks: {
    async signIn({ user, account }) {
      console.log("signIn callback triggered:", { user: user.email, provider: account?.provider });
      
      if (account?.provider === "google") {
        try {
          const userEmail = user.email?.toLowerCase();
          console.log("Looking for user with email:", userEmail);
          
          // Check if user exists in DevTracker_Users table
          const existingUser = await prisma.devTracker_User.findUnique({
            where: { email: userEmail }
          })
          
          console.log("Database user lookup result:", existingUser ? "User found" : "User not found");
          if (existingUser) {
            console.log("Found user:", { id: existingUser.id, name: existingUser.name, role: existingUser.role });
          }
          
          if (existingUser) {
            // Update user info if needed
            await prisma.devTracker_User.update({
              where: { email: userEmail },
              data: {
                name: user.name || existingUser.name,
              }
            })
            console.log("User authorized successfully");
            return true
          } else {
            // User not found in DevTracker_Users table
            console.log("User not found in DevTracker_Users table - access denied");
            return false
          }
        } catch (error) {
          console.error("Error checking user authorization:", error)
          console.error("Error details:", error instanceof Error ? error.message : error)
          return false
        }
      }
      console.log("Non-Google provider or no account - access denied");
      return false
    },
    async jwt({ token, user }) {
      if (user) {
        // Get user data from DevTracker_Users table
        const dbUser = await prisma.devTracker_User.findUnique({
          where: { email: user.email?.toLowerCase() }
        })
        
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.name = dbUser.name
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.name = token.name as string
      }
      return session
    },
  },
  pages: {
    signIn: '/sign-in',
    error: '/sign-in', // Redirect to sign-in page on error
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
} 