import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware() {
    // Add any custom middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    // Protected routes that require authentication
    '/dashboard/:path*',
    '/history/:path*',
    '/admin/:path*',
    '/api/activities/:path*',
    '/api/admin/:path*',
  ]
}